(function () {
  var sportFilter = document.getElementById("sport-filter");
  var statusFilter = document.getElementById("status-filter");
  var dateFilter = document.getElementById("date-filter");
  var resetButton = document.getElementById("reset-filters");
  var filterCards = Array.from(document.querySelectorAll(".filter-card"));
  var sections = [
    { element: document.getElementById("upcoming-section"), count: document.getElementById("upcoming-count"), id: "upcoming", kind: "match", label: "MATCHES" },
    { element: document.getElementById("scheduled-section"), count: document.getElementById("scheduled-count"), id: "scheduled", kind: "match", label: "EVENTS" },
    { element: document.getElementById("tournaments-section"), count: document.getElementById("tournaments-count"), id: "tournaments", kind: "tournament", label: "TOURNAMENTS" },
    { element: document.getElementById("results-section"), count: null, id: "results", kind: "result", label: "" }
  ];
  function todayAsISO() {
    var today = new Date();
    return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  }

  function updateTournamentRegistrationStates() {
    var today = todayAsISO();
    document.querySelectorAll('.tournament-card[data-status="open"]').forEach(function (card) {
      if (today <= card.dataset.registrationDeadline) return;

      card.dataset.status = "closed";
      var badge = card.querySelector("[data-registration-badge]");
      badge.classList.add("registration-closed");
      badge.innerHTML = "<span></span>Registration Closed";

      var registrationLink = card.querySelector("[data-registration-link]");
      var closedButton = document.createElement("button");
      closedButton.className = "register-button register-button--disabled";
      closedButton.type = "button";
      closedButton.disabled = true;
      closedButton.setAttribute("aria-disabled", "true");
      closedButton.textContent = "Registration Closed";
      registrationLink.replaceWith(closedButton);
    });
  }

  function displayDate(value, longMonth) {
    if (!value) return "To Be Announced";
    var parts = value.split("-");
    var monthNames = longMonth
      ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthIndex = Number(parts[1]) - 1;
    if (parts.length !== 3 || monthIndex < 0 || monthIndex > 11) {
      throw new Error("The fixture API returned an invalid event date.");
    }
    return Number(parts[2]) + " " + monthNames[monthIndex] + " " + parts[0];
  }

  function displayTime(value) {
    if (!value) return "To Be Announced";
    var parts = value.split(":");
    if (parts.length < 2) throw new Error("The fixture API returned an invalid start time.");
    var hour = Number(parts[0]);
    var minute = Number(parts[1]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error("The fixture API returned an invalid start time.");
    }
    var suffix = hour >= 12 ? "PM" : "AM";
    var displayHour = hour % 12 || 12;
    return displayHour + ":" + String(minute).padStart(2, "0") + " " + suffix;
  }

  function renderFixture(fixture, card) {
    if (!fixture || fixture.section !== card.dataset.section) {
      throw new Error("The fixture API returned a record for the wrong section.");
    }

    var dateLabel = displayDate(fixture.event_date, false);
    var fullDateLabel = displayDate(fixture.event_date, true);
    var timeLabel = displayTime(fixture.start_time);
    var venueLabel = fixture.venue || "Venue To Be Announced";
    var detailButton = card.querySelector("[data-details]");

    card.querySelector("[data-fixture-date]").textContent = dateLabel;
    card.querySelector("[data-fixture-time]").textContent = timeLabel;
    card.querySelector("[data-fixture-venue]").textContent = venueLabel;
    if (fixture.event_date) card.dataset.date = fixture.event_date;
    else delete card.dataset.date;

    detailButton.dataset.title = fixture.competition;
    detailButton.dataset.sportName = fixture.sport;
    detailButton.dataset.dateLabel = fullDateLabel;
    detailButton.dataset.time = timeLabel;
    detailButton.dataset.venue = venueLabel;
    detailButton.dataset.teamA = fixture.home_team;
    detailButton.dataset.teamB = fixture.opponent_name || "Opponent To Be Announced";
    detailButton.dataset.extra = fixture.competition;

    if (card.dataset.section === "scheduled") {
      var isDemo = fixture.is_demo === true;
      var opponentName = card.querySelector("[data-opponent-name]");
      var opponentCode = card.querySelector("[data-opponent-code]");
      var statusBadge = card.querySelector(".status-tag");

      opponentName.textContent = fixture.opponent_name || "Opponent\nTo Be Announced";
      opponentCode.textContent = fixture.opponent_code || "TBA";
      statusBadge.textContent = isDemo ? "Proposed · Demo" : "Proposed";
      statusBadge.classList.toggle("status-demo", isDemo);
      detailButton.dataset.statusLabel = isDemo
        ? "Proposed schedule - demonstration opponent pairing, not confirmed"
        : "Proposed schedule - not officially announced";
    }
  }

  function loadFixtureData() {
    return fetch("../../backend/api/fixtures.php", {
      headers: { Accept: "application/json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("The fixture API returned HTTP " + response.status + ".");
      return response.json();
    }).then(function (payload) {
      if (!payload || !Array.isArray(payload.fixtures)) {
        throw new Error("The fixture API returned an invalid response.");
      }

      var cards = Object.create(null);
      document.querySelectorAll("[data-fixture-id]").forEach(function (card) {
        cards[card.dataset.fixtureId] = card;
      });

      var loaded = Object.create(null);
      payload.fixtures.forEach(function (fixture) {
        var card = fixture && cards[fixture.fixture_id];
        if (!card || loaded[fixture.fixture_id]) {
          throw new Error("The fixture API returned an unknown or duplicate fixture.");
        }
        renderFixture(fixture, card);
        loaded[fixture.fixture_id] = true;
      });

      if (Object.keys(cards).length !== Object.keys(loaded).length) {
        throw new Error("The fixture API did not return every fixture shown on this page.");
      }

      applyFilters();
    }).catch(function (error) {
      console.error("Unable to load fixture data from the database.", error);
    });
  }

  function applyFilters() {
    var selectedSport = sportFilter.value;
    var selectedStatus = statusFilter.value;
    var selectedDate = dateFilter.value;
    var visibleTotal = 0;

    sections.forEach(function (section) {
      var cards = filterCards.filter(function (card) {
        return card.dataset.kind === section.kind && card.dataset.section === section.id;
      });
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesSport = selectedSport === "all" || card.dataset.sport === selectedSport;
        var matchesStatus = selectedStatus === "all" || card.dataset.status === selectedStatus;
        var matchesDate = !selectedDate || card.dataset.date === selectedDate;
        var isVisible = matchesSport && matchesStatus && matchesDate;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      section.element.hidden = visibleCount === 0 && section.element.dataset.keepVisible !== "true";
      visibleTotal += visibleCount;

      if (section.count) {
        section.count.textContent = String(visibleCount).padStart(2, "0") + " " + section.label;
      }

      var emptyMessage = section.element.querySelector(".empty-message");
      if (emptyMessage) emptyMessage.hidden = true;
    });

    var globalEmpty = document.getElementById("global-empty");
    if (globalEmpty) globalEmpty.hidden = visibleTotal > 0;
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

  var detailsDialog = document.getElementById("details-dialog");
  var dialogTitle = document.getElementById("dialog-title");
  var dialogSport = document.getElementById("dialog-sport");
  var dialogStatus = document.getElementById("dialog-status");
  var dialogTeams = document.getElementById("dialog-teams");
  var dialogDate = document.getElementById("dialog-date");
  var dialogTime = document.getElementById("dialog-time");
  var dialogVenue = document.getElementById("dialog-venue");
  var dialogExtraLabel = document.getElementById("dialog-extra-label");
  var dialogExtra = document.getElementById("dialog-extra");

  function openDetails(button) {
    dialogTitle.textContent = button.dataset.title;
    dialogSport.textContent = button.dataset.sportName.toUpperCase() + " DETAILS";
    dialogStatus.textContent = button.dataset.statusLabel;
    dialogTeams.replaceChildren();

    [button.dataset.teamA, "VS", button.dataset.teamB].forEach(function (text, index) {
      var item = document.createElement(index === 1 ? "span" : "strong");
      item.textContent = text;
      dialogTeams.appendChild(item);
    });

    dialogDate.textContent = button.dataset.dateLabel;
    dialogTime.textContent = button.dataset.time;
    dialogVenue.textContent = button.dataset.venue;
    dialogExtraLabel.textContent = button.dataset.extraLabel;
    dialogExtra.textContent = button.dataset.extra;
    detailsDialog.showModal();
  }

  document.querySelectorAll("[data-details]").forEach(function (button) {
    button.addEventListener("click", function () {
      openDetails(button);
    });
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
  backdrop.addEventListener("click", function () {
    setSidebarOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setSidebarOpen(false);
  });

  var toast = document.getElementById("toast-message");
  var toastTimer;
  document.querySelectorAll("[data-portal-link]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      toast.textContent = (link.textContent.trim() || link.getAttribute("aria-label")) + " is outside this page preview.";
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 2400);
      setSidebarOpen(false);
    });
  });

  updateTournamentRegistrationStates();
  applyFilters();
  loadFixtureData();
})();
