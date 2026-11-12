(function () {
  var scriptUrl = document.currentScript.src;
  var fixturesEndpoint = new URL("../../backend/api/fixtures.php", scriptUrl);
  var sportFilter = document.getElementById("sport-filter");
  var statusFilter = document.getElementById("status-filter");
  var dateFilter = document.getElementById("date-filter");
  var resetButton = document.getElementById("reset-filters");
  var grids = {
    upcoming: document.getElementById("upcoming-grid"),
    scheduled: document.getElementById("scheduled-grid"),
    tournaments: document.getElementById("tournaments-grid"),
    results: document.getElementById("results-grid")
  };
  var counts = {
    upcoming: document.getElementById("upcoming-count"),
    scheduled: document.getElementById("scheduled-count"),
    tournaments: document.getElementById("tournaments-count"),
    results: document.getElementById("results-count")
  };
  var detailsDialog = document.getElementById("details-dialog");
  var fixtures = [];

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function slug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function formatDate(value, longMonth) {
    if (!value) return "To Be Announced";
    var parts = value.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: longMonth ? "long" : "short",
      year: "numeric"
    }).format(new Date(parts[0], parts[1] - 1, parts[2]));
  }

  function formatTime(value) {
    if (!value) return "To Be Announced";
    var parts = value.split(":").map(Number);
    if (parts.length < 2 || parts[0] > 23 || parts[1] > 59) return "To Be Announced";
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" })
      .format(new Date(2000, 0, 1, parts[0], parts[1]));
  }

  function isRegistrationOpen(fixture) {
    return fixture.status === "Scheduled" && fixture.registration_deadline &&
      new Date().toISOString().slice(0, 10) <= fixture.registration_deadline;
  }

  function sectionFor(fixture) {
    if (fixture.status === "Completed") return "results";
    if (fixture.kind === "Tournament") return "tournaments";
    return fixture.section === "upcoming" ? "upcoming" : "scheduled";
  }

  function createDetailsButton(fixture, label) {
    return '<button class="details-button" type="button" data-details data-id="' + escapeHtml(fixture.fixture_id) +
      '" data-title="' + escapeHtml(fixture.competition) + '" data-sport="' + escapeHtml(fixture.sport) +
      '" data-date="' + escapeHtml(formatDate(fixture.event_date, true)) + '" data-time="' + escapeHtml(formatTime(fixture.start_time)) +
      '" data-venue="' + escapeHtml(fixture.venue || "Venue To Be Announced") + '" data-team-a="' + escapeHtml(fixture.home_team) +
      '" data-team-b="' + escapeHtml(fixture.opponent_name || "Opponent To Be Announced") +
      '" data-status="' + escapeHtml(label) + '" data-extra="' + escapeHtml(fixture.result || fixture.competition) +
      '">' + label + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>';
  }

  function renderMatch(fixture) {
    var status = fixture.status === "Completed" ? "Completed" : "Scheduled";
    return '<article class="match-card filter-card" data-sport="' + escapeHtml(slug(fixture.sport)) +
      '" data-status="' + status.toLowerCase() + '" data-date="' + escapeHtml(fixture.event_date || "") + '">' +
      '<div class="card-topline"><span class="sport-tag">' + escapeHtml(fixture.sport) +
      '</span><span class="status-tag">' + status + '</span></div><p class="match-name">' +
      escapeHtml(fixture.competition) + '</p><div class="versus"><div class="team"><strong>' +
      escapeHtml(fixture.home_team) + '</strong></div><span class="versus-label">VS</span><div class="team team-right"><strong>' +
      escapeHtml(fixture.opponent_name || "Opponent To Be Announced") + '</strong></div></div>' +
      '<div class="card-divider"></div><div class="match-meta"><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ' +
      escapeHtml(formatDate(fixture.event_date, false)) + '</span><span><i class="fa-regular fa-clock" aria-hidden="true"></i> ' +
      escapeHtml(formatTime(fixture.start_time)) + '</span></div><div class="match-venue"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ' +
      escapeHtml(fixture.venue || "Venue To Be Announced") + '</div>' +
      createDetailsButton(fixture, status) + '</article>';
  }

  function renderTournament(fixture) {
    var open = Boolean(isRegistrationOpen(fixture));
    var status = open ? "open" : "closed";
    var deadline = fixture.registration_deadline
      ? "Registration deadline: " + formatDate(fixture.registration_deadline, true)
      : "Registration deadline not published";
    var registration = open
      ? '<a class="register-button" href="tournament-registration.html?tournament=' +
        encodeURIComponent(fixture.fixture_id) + '">Register Now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>'
      : '<button class="register-button register-button--disabled" type="button" disabled>Registration unavailable</button>';
    return '<article class="tournament-card filter-card" data-sport="' + escapeHtml(slug(fixture.sport)) +
      '" data-status="' + status + '" data-date="' + escapeHtml(fixture.event_date || "") + '">' +
      '<div class="tournament-visual"><span class="sport-tag">' + escapeHtml(fixture.sport) +
      '</span><span class="status-tag">' + (open ? "Registration Open" : "Registration Closed") +
      '</span></div><div class="tournament-content"><span class="sport-caption">' +
      escapeHtml(fixture.sport) + '</span><h3>' + escapeHtml(fixture.competition) +
      '</h3><p>' + escapeHtml(formatDate(fixture.event_date, true)) + '</p><p>' +
      escapeHtml(fixture.venue || "Venue To Be Announced") + '</p><p>' + escapeHtml(deadline) +
      '</p>' + registration + createDetailsButton(fixture, "View Details") + '</div></article>';
  }

  function renderResult(fixture) {
    return '<article class="research-card filter-card" data-sport="' + escapeHtml(slug(fixture.sport)) +
      '" data-status="completed" data-date="' + escapeHtml(fixture.event_date || "") + '">' +
      '<p class="sport-caption">' + escapeHtml(fixture.sport) + '</p><h3>' +
      escapeHtml(fixture.competition) + '</h3><p>' + escapeHtml(fixture.result || "Result not published") +
      '</p><p>' + escapeHtml(formatDate(fixture.event_date, true)) + ' · ' +
      escapeHtml(fixture.venue || "Venue not published") + '</p>' +
      createDetailsButton(fixture, "View Details") + '</article>';
  }

  function populateFilters() {
    var sports = Array.from(new Set(fixtures.map(function (item) { return item.sport; }).filter(Boolean))).sort();
    sports.forEach(function (sport) {
      var option = document.createElement("option");
      option.value = slug(sport);
      option.textContent = sport;
      sportFilter.appendChild(option);
    });
    [
      ["upcoming", "Upcoming"],
      ["scheduled", "Scheduled"],
      ["open", "Registration open"],
      ["closed", "Registration closed"],
      ["completed", "Completed"]
    ].forEach(function (item) {
      if (!fixtures.some(function (fixture) {
        return item[0] === "completed" ? fixture.status === "Completed" :
          item[0] === "open" ? isRegistrationOpen(fixture) :
          item[0] === "closed" ? fixture.kind === "Tournament" && !isRegistrationOpen(fixture) :
          fixture.status === "Scheduled" && sectionFor(fixture) === item[0];
      })) return;
      var option = document.createElement("option");
      option.value = item[0];
      option.textContent = item[1];
      statusFilter.appendChild(option);
    });
  }

  function renderFixtures() {
    Object.keys(grids).forEach(function (section) {
      var records = fixtures.filter(function (fixture) { return sectionFor(fixture) === section; });
      grids[section].innerHTML = records.map(function (fixture) {
        return section === "tournaments" ? renderTournament(fixture) :
          section === "results" ? renderResult(fixture) : renderMatch(fixture);
      }).join("");
      counts[section].textContent = records.length + " " +
        ({ upcoming: "MATCHES", scheduled: "EVENTS", tournaments: "TOURNAMENTS", results: "RESULTS" })[section];
    });
    applyFilters();
  }

  function applyFilters() {
    var selectedSport = sportFilter.value;
    var selectedStatus = statusFilter.value;
    var selectedDate = dateFilter.value;
    var visibleTotal = 0;
    document.querySelectorAll(".filter-card").forEach(function (card) {
      var matchesSport = selectedSport === "all" || card.dataset.sport === selectedSport;
      var matchesStatus = selectedStatus === "all" || card.dataset.status === selectedStatus;
      var matchesDate = !selectedDate || card.dataset.date === selectedDate;
      card.hidden = !(matchesSport && matchesStatus && matchesDate);
      if (!card.hidden) visibleTotal += 1;
    });
    var globalEmpty = document.getElementById("global-empty");
    globalEmpty.textContent = fixtures.length
      ? "No database records match the selected filters."
      : "No match or tournament records have been added by an administrator yet.";
    globalEmpty.hidden = visibleTotal > 0;
  }

  async function loadFixtures() {
    var globalEmpty = document.getElementById("global-empty");
    globalEmpty.textContent = "Loading schedule from the database…";
    globalEmpty.hidden = false;
    try {
      var response = await fetch(fixturesEndpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      var payload = await response.json();
      if (!response.ok || !payload || !Array.isArray(payload.fixtures)) {
        throw new Error(payload && payload.error ? payload.error : "The fixture service returned an invalid response.");
      }
      fixtures = payload.fixtures;
      populateFilters();
      renderFixtures();
    } catch (error) {
      console.error("Unable to load fixture data from the database.", error);
      globalEmpty.textContent = "Match and tournament records are temporarily unavailable.";
      globalEmpty.hidden = false;
    }
  }

  sportFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  dateFilter.addEventListener("change", applyFilters);
  resetButton.addEventListener("click", function () {
    sportFilter.value = "all";
    statusFilter.value = "all";
    dateFilter.value = "";
    applyFilters();
  });
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-details]");
    if (!button) return;
    var fixture = fixtures.find(function (item) { return item.fixture_id === button.dataset.id; });
    if (!fixture) return;
    document.getElementById("dialog-title").textContent = fixture.competition;
    document.getElementById("dialog-sport").textContent = fixture.sport.toUpperCase() + " DETAILS";
    document.getElementById("dialog-status").textContent = fixture.status === "Completed"
      ? fixture.result || "Result not published" : fixture.status;
    var teams = document.getElementById("dialog-teams");
    teams.replaceChildren();
    [fixture.home_team, "VS", fixture.opponent_name || "Opponent To Be Announced"].forEach(function (text, index) {
      var item = document.createElement(index === 1 ? "span" : "strong");
      item.textContent = text;
      teams.appendChild(item);
    });
    document.getElementById("dialog-date").textContent = formatDate(fixture.event_date, true);
    document.getElementById("dialog-time").textContent = formatTime(fixture.start_time);
    document.getElementById("dialog-venue").textContent = fixture.venue || "Venue To Be Announced";
    document.getElementById("dialog-extra-label").textContent = fixture.kind === "Tournament" ? "Registration deadline" : "Competition";
    document.getElementById("dialog-extra").textContent = fixture.kind === "Tournament"
      ? formatDate(fixture.registration_deadline, true) : fixture.result || fixture.competition;
    detailsDialog.showModal();
  });

  var menuToggle = document.getElementById("menu-toggle");
  var backdrop = document.getElementById("sidebar-backdrop");
  function setSidebarOpen(isOpen) {
    document.body.classList.toggle("sidebar-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close student portal navigation" : "Open student portal navigation");
  }
  menuToggle.addEventListener("click", function () {
    setSidebarOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  backdrop.addEventListener("click", function () { setSidebarOpen(false); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setSidebarOpen(false);
  });

  loadFixtures();
})();
