document.addEventListener("DOMContentLoaded", function () {
  var scriptUrl = document.currentScript.src;
  var contentEndpoint = new URL("../../backend/api/public-content.php", scriptUrl);
  var eventSearch = document.getElementById("eventSearch");
  var clearSearch = document.getElementById("clearSearch");
  var filters = document.getElementById("eventFilters");
  var eventsGrid = document.getElementById("eventsGrid");
  var resultsLabel = document.getElementById("resultsLabel");
  var noEvents = document.getElementById("noEvents");
  var storiesTrack = document.getElementById("storiesTrack");
  var featuredEvent = document.querySelector(".featured-event");
  var events = [];
  var announcements = [];
  var selectedSport = "all";

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function slug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function displayDate(value) {
    if (!value) return "Date to be announced";
    var parts = value.slice(0, 10).split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(undefined, {
      day: "numeric", month: "short", year: "numeric"
    });
  }

  function renderEvent(event, index) {
    var category = slug(event.sport);
    var iconClass = event.kind === "Tournament" ? "fa-trophy" : "fa-calendar-days";
    var description = [event.kind, event.homeClub, event.opponent && "vs " + event.opponent]
      .filter(Boolean).join(" · ");
    return '<article class="event-tile" data-category="' + escapeHtml(category) + '">' +
      '<div class="tile-art tile-' + escapeHtml(category) + '"><span class="tile-number">' +
      String(index + 1).padStart(2, "0") + '</span><span class="tile-type">' +
      escapeHtml(event.kind || "EVENT") + '</span><i class="fa-solid ' + iconClass +
      '" aria-hidden="true"></i><span class="tile-art-name">' + escapeHtml(event.sport) + '</span></div>' +
      '<div class="tile-content"><div class="tile-meta"><span>' + escapeHtml(event.sport) +
      '</span><span>' + escapeHtml(event.kind || "Event") + '</span></div><h3>' +
      escapeHtml(event.title) + '</h3><p>' + escapeHtml(description) + '</p><div class="tile-footer">' +
      '<span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ' +
      escapeHtml(displayDate(event.date)) + '</span><button type="button" class="tile-details" data-event-id="' +
      escapeHtml(event.id) + '">Explore <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></button>' +
      '</div></div></article>';
  }

  function renderFeatured() {
    var event = events[0];
    if (!event) {
      featuredEvent.innerHTML = '<div class="featured-info"><span class="featured-tag">SPORTSHUB</span>' +
        '<h3>No featured event</h3><p>Events created by administrators will appear here when available.</p></div>';
      return;
    }
    featuredEvent.innerHTML = '<div class="featured-art"><span class="featured-art-label">SPORTSHUB</span>' +
      '<div class="featured-big-icon"><i class="fa-solid fa-trophy" aria-hidden="true"></i></div>' +
      '<span class="featured-art-bottom">' + escapeHtml(event.kind || "EVENT") + '</span></div>' +
      '<div class="featured-info"><span class="featured-tag"><span></span>' + escapeHtml(event.sport) +
      '</span><h3>' + escapeHtml(event.title) + '</h3><p>' +
      escapeHtml([event.homeClub, event.opponent && "vs " + event.opponent].filter(Boolean).join(" · ")) +
      '</p><div class="featured-facts"><div><i class="fa-regular fa-calendar"></i><span><small>DATE</small>' +
      escapeHtml(displayDate(event.date)) + '</span></div><div><i class="fa-solid fa-location-dot"></i><span><small>VENUE</small>' +
      escapeHtml(event.venue || "Not published") + '</span></div></div><button class="featured-button" type="button" data-event-id="' +
      escapeHtml(event.id) + '">View event <i class="fa-solid fa-arrow-right"></i></button></div>';
  }

  function renderFilters() {
    var sports = Array.from(new Set(events.map(function (item) { return item.sport; }).filter(Boolean))).sort();
    filters.replaceChildren();
    var allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "filter-chip active";
    allButton.dataset.filter = "all";
    allButton.setAttribute("aria-pressed", "true");
    allButton.textContent = "Everything " + events.length;
    filters.appendChild(allButton);
    sports.forEach(function (sport) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.dataset.filter = slug(sport);
      button.setAttribute("aria-pressed", "false");
      button.textContent = sport;
      filters.appendChild(button);
    });
  }

  function filterEvents() {
    var searchText = eventSearch.value.trim().toLowerCase();
    var cards = Array.from(eventsGrid.querySelectorAll(".event-tile"));
    var visibleCount = 0;
    cards.forEach(function (card) {
      var matchesSport = selectedSport === "all" || card.dataset.category === selectedSport;
      var matchesSearch = card.textContent.toLowerCase().includes(searchText);
      card.hidden = !(matchesSport && matchesSearch);
      if (!card.hidden) visibleCount += 1;
    });
    resultsLabel.textContent = "Showing " + visibleCount + (visibleCount === 1 ? " event" : " events");
    noEvents.hidden = visibleCount > 0;
    clearSearch.hidden = eventSearch.value.length === 0;
  }

  function renderAnnouncements() {
    if (!announcements.length) {
      storiesTrack.innerHTML = '<p class="section-subtitle">No published student announcements.</p>';
      return;
    }
    storiesTrack.innerHTML = announcements.map(function (item, index) {
      return '<button class="story-item" type="button" data-story-index="' + index +
        '" data-story-title="' + escapeHtml(item.title) + '" data-story-category="ANNOUNCEMENT" ' +
        'data-story-text="' + escapeHtml(item.content) + '" data-story-type="bell" data-story-time="' +
        escapeHtml(displayDate(item.publishedDate)) + '"><span class="story-avatar story-green">' +
        '<i class="fa-solid fa-bullhorn" aria-hidden="true"></i></span><span class="story-label">' +
        escapeHtml(item.title) + '</span></button>';
    }).join("");
  }

  async function fetchRecords(entity) {
    var url = new URL(contentEndpoint);
    url.searchParams.set("entity", entity);
    var response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    var payload = await response.json();
    if (!response.ok || payload.success !== true || !Array.isArray(payload.records)) {
      throw new Error(payload.message || "The " + entity + " request could not be completed.");
    }
    return payload.records;
  }

  async function loadContent() {
    var results = await Promise.allSettled([fetchRecords("events"), fetchRecords("announcements")]);
    if (results[0].status === "fulfilled") {
      events = results[0].value;
      renderFilters();
      eventsGrid.innerHTML = events.map(renderEvent).join("");
      renderFeatured();
      filterEvents();
    } else {
      console.error("Unable to load public event records.", results[0].reason);
      eventsGrid.replaceChildren();
      resultsLabel.textContent = "Events unavailable";
      noEvents.hidden = false;
      noEvents.textContent = "Event records are temporarily unavailable.";
      renderFeatured();
    }
    if (results[1].status === "fulfilled") {
      announcements = results[1].value;
      renderAnnouncements();
    } else {
      console.error("Unable to load public announcements.", results[1].reason);
      storiesTrack.textContent = "Announcements are temporarily unavailable.";
    }
  }

  filters.addEventListener("click", function (event) {
    var button = event.target.closest("[data-filter]");
    if (!button) return;
    selectedSport = button.dataset.filter;
    filters.querySelectorAll("[data-filter]").forEach(function (item) {
      var active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    filterEvents();
  });
  eventSearch.addEventListener("input", filterEvents);
  clearSearch.addEventListener("click", function () {
    eventSearch.value = "";
    filterEvents();
    eventSearch.focus();
  });
  document.getElementById("resetFilters").addEventListener("click", function () {
    selectedSport = "all";
    eventSearch.value = "";
    var allButton = filters.querySelector('[data-filter="all"]');
    if (allButton) allButton.click();
    filterEvents();
  });
  eventsGrid.addEventListener("click", function (event) {
    var button = event.target.closest("[data-event-id]");
    if (!button) return;
    var record = events.find(function (item) { return String(item.id) === button.dataset.eventId; });
    if (!record) return;
    document.getElementById("dialogCategory").textContent = (record.sport || "Event") + " · " + (record.kind || "Event");
    document.getElementById("dialogTitle").textContent = record.title;
    document.getElementById("dialogDescription").textContent =
      [record.homeClub, record.opponent && "vs " + record.opponent, record.status, record.result]
        .filter(Boolean).join(" · ");
    document.getElementById("dialogDate").textContent = displayDate(record.date);
    document.getElementById("dialogLocation").textContent = record.venue || "Venue not published";
    document.getElementById("eventDialog").showModal();
  });
  document.getElementById("closeDialog").addEventListener("click", function () {
    document.getElementById("eventDialog").close();
  });
  storiesTrack.addEventListener("click", function (event) {
    var story = event.target.closest("[data-story-index]");
    if (!story) return;
    var index = Number(story.dataset.storyIndex);
    document.getElementById("viewerTitle").textContent = announcements[index].title;
    document.getElementById("viewerCategory").textContent = "ANNOUNCEMENT";
    document.getElementById("viewerText").textContent = announcements[index].content;
    document.getElementById("viewerTime").textContent = displayDate(announcements[index].publishedDate);
    document.getElementById("viewerCounter").textContent = (index + 1) + " / " + announcements.length;
    document.getElementById("storyViewer").classList.add("is-active");
    document.getElementById("storyViewer").setAttribute("aria-hidden", "false");
    document.body.classList.add("story-open");
  });
  function closeStories() {
    document.getElementById("storyViewer").classList.remove("is-active");
    document.getElementById("storyViewer").setAttribute("aria-hidden", "true");
    document.body.classList.remove("story-open");
  }
  document.getElementById("closeStoryViewer").addEventListener("click", closeStories);
  document.getElementById("storyBackdrop").addEventListener("click", closeStories);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeStories();
  });

  loadContent();
});
