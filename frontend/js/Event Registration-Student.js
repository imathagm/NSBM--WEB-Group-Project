(function () {
  var tournaments = {
    "nsbm-t20": {
      name: "NSBM T20 League",
      sport: "Cricket",
      category: "CRICKET · TEAM EVENT",
      icon: "../assets/cricket.svg",
      start: "2026-11-28",
      deadline: "2026-11-20",
      venue: "Main Grounds"
    },
    "inter-faculty-cup": {
      name: "Inter-Faculty Cup",
      sport: "Football",
      category: "FOOTBALL · FACULTY TEAMS",
      icon: "../assets/football.svg",
      start: "2026-12-01",
      deadline: "2026-11-24",
      venue: "University Main Grounds"
    },
    "badminton-cup": {
      name: "Inter-University Badminton Cup",
      sport: "Badminton",
      category: "BADMINTON",
      icon: "../assets/badminton.svg",
      start: "2026-11-14",
      deadline: "2026-11-07",
      venue: "NSBM Recreational Center"
    },
    "basketball-cup": {
      name: "University Basketball Challenge",
      sport: "Basketball",
      category: "BASKETBALL",
      icon: "../assets/basketball.svg",
      start: "2026-11-21",
      deadline: "2026-11-14",
      venue: "NSBM Basketball Court"
    },
    "volleyball-cup": {
      name: "University Volleyball Trophy",
      sport: "Volleyball",
      category: "VOLLEYBALL",
      icon: "../assets/volleyball.svg",
      start: "2026-11-23",
      deadline: "2026-11-16",
      venue: "University Indoor Court"
    },
    "netball-cup": {
      name: "Inter-University Netball Cup",
      sport: "Netball",
      category: "NETBALL",
      icon: "../assets/netball.svg",
      start: "2026-11-25",
      deadline: "2026-11-18",
      venue: "NSBM Sports Hall"
    },
    "table-tennis-cup": {
      name: "Inter-University Table Tennis Cup",
      sport: "Table Tennis",
      category: "TABLE TENNIS",
      icon: "../assets/table-tennis.svg",
      start: "2026-11-29",
      deadline: "2026-11-20",
      venue: "NSBM Indoor Sports Center"
    },
    "karate-open": {
      name: "Open Karate Championship",
      sport: "Karate",
      category: "KARATE",
      icon: "../assets/karate.svg",
      start: "2026-12-02",
      deadline: "2026-11-22",
      venue: "NSBM Sports Hall"
    }
  };
  var params = new URLSearchParams(window.location.search);
  var tournamentId = params.get("tournament");
  var tournament = Object.prototype.hasOwnProperty.call(tournaments, tournamentId) ? tournaments[tournamentId] : null;
  var form = document.getElementById("registration-form");
  var formMessage = document.getElementById("form-message");
  var successPanel = document.getElementById("success-panel");
  var formPanelHeading = document.querySelector(".form-panel-heading");
  var statusTag = document.querySelector(".summary-tag");
  var deadlineNote = document.getElementById("deadline-note");

  function formatDate(dateString) {
    var date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function todayAsISO() {
    var today = new Date();
    return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  }

  function isDeadlinePassed() {
    return todayAsISO() > tournament.deadline;
  }

  function showFormError(message) {
    formMessage.textContent = message;
    formMessage.hidden = false;
  }

  function clearFormError() {
    formMessage.textContent = "";
    formMessage.hidden = true;
  }

  function disableUnavailableRegistration(message) {
    statusTag.classList.add("is-closed");
    statusTag.innerHTML = "<span></span>Registration Closed";
    deadlineNote.classList.add("is-expired");
    deadlineNote.innerHTML = '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ' + message;
    form.querySelectorAll("input, select, button").forEach(function (control) {
      control.disabled = true;
    });
    showFormError(message);
  }

  if (!tournament) {
    document.getElementById("tournament-name").textContent = "Tournament unavailable";
    document.getElementById("summary-category").textContent = "REGISTRATION NOT AVAILABLE";
    document.getElementById("summary-start").textContent = "—";
    document.getElementById("summary-deadline").textContent = "—";
    document.getElementById("summary-venue").textContent = "—";
    disableUnavailableRegistration("Choose an open tournament from the tournament registration section.");
  } else {
    document.title = "Register — " + tournament.name + " | NSBM Student Portal";
    document.getElementById("tournament-name").textContent = tournament.name;
    document.getElementById("summary-category").textContent = tournament.category;
    document.getElementById("summary-start").textContent = formatDate(tournament.start);
    document.getElementById("summary-deadline").textContent = formatDate(tournament.deadline);
    document.getElementById("summary-venue").textContent = tournament.venue;
    document.getElementById("summary-sport-icon").src = tournament.icon;
    document.getElementById("summary-sport-icon").alt = tournament.sport;
    document.getElementById("summary-art").dataset.sport = tournament.sport.toLowerCase().replace(/\s+/g, "-");

    if (isDeadlinePassed()) {
      disableUnavailableRegistration("The registration deadline for this tournament has passed.");
    }
  }

  var idInput = document.getElementById("student-id");
  var emailInput = document.getElementById("student-email");

  idInput.addEventListener("input", function () {
    idInput.setCustomValidity("");
    idInput.removeAttribute("aria-invalid");
    clearFormError();
  });
  document.getElementById("full-name").addEventListener("input", function (event) {
    event.currentTarget.setCustomValidity("");
    event.currentTarget.removeAttribute("aria-invalid");
    clearFormError();
  });
  emailInput.addEventListener("input", function () {
    emailInput.setCustomValidity("");
    emailInput.removeAttribute("aria-invalid");
    clearFormError();
  });
  form.querySelectorAll("input, select").forEach(function (field) {
    field.addEventListener("change", function () {
      field.setCustomValidity("");
      field.removeAttribute("aria-invalid");
      clearFormError();
    });
  });

  function getRegistrations() {
    var stored = window.localStorage.getItem("nsbm-tournament-registrations");
    if (!stored) return [];

    var parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(function (registration) {
      return registration &&
        typeof registration.tournamentId === "string" &&
        typeof registration.studentId === "string";
    })) {
      throw new Error("Saved registration data is invalid.");
    }
    return parsed;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFormError();
    idInput.setCustomValidity("");

    if (!tournament) {
      showFormError("Registration is unavailable because this tournament could not be found.");
      return;
    }

    if (isDeadlinePassed()) {
      disableUnavailableRegistration("The registration deadline for this tournament has passed.");
      return;
    }

    if (!form.reportValidity()) return;

    var fullNameInput = document.getElementById("full-name");
    if (!fullNameInput.value.trim()) {
      fullNameInput.setCustomValidity("Enter your full name.");
      fullNameInput.setAttribute("aria-invalid", "true");
      fullNameInput.reportValidity();
      return;
    }
    fullNameInput.setCustomValidity("");

    var studentId = idInput.value.trim();
    if (!/^[A-Za-z0-9][A-Za-z0-9/-]{3,22}[A-Za-z0-9]$/.test(studentId)) {
      idInput.setCustomValidity("Enter a valid student ID using 5–24 letters, numbers, slashes, or hyphens.");
      idInput.setAttribute("aria-invalid", "true");
      idInput.reportValidity();
      return;
    }

    if (!emailInput.validity.valid) {
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.reportValidity();
      return;
    }

    var registrations;
    try {
      registrations = getRegistrations();
    } catch (error) {
      console.error("Unable to read saved tournament registrations.", error);
      showFormError("Saved registrations could not be read. Clear this site's local storage and try again.");
      return;
    }

    var normalizedId = studentId.toLowerCase();
    var alreadyRegistered = registrations.some(function (registration) {
      return registration.tournamentId === tournamentId && registration.studentId === normalizedId;
    });
    if (alreadyRegistered) {
      showFormError("This student ID is already registered for this tournament in this browser.");
      idInput.setAttribute("aria-invalid", "true");
      idInput.focus();
      return;
    }

    registrations.push({
      tournamentId: tournamentId,
      studentId: normalizedId,
      registeredAt: new Date().toISOString()
    });

    try {
      window.localStorage.setItem("nsbm-tournament-registrations", JSON.stringify(registrations));
    } catch (error) {
      console.error("Unable to save the tournament registration.", error);
      showFormError("Your registration could not be saved in this browser. Check storage availability and try again.");
      return;
    }

    var studentName = document.getElementById("full-name").value.trim();
    var confirmation = document.getElementById("success-copy");
    confirmation.textContent = studentName + ", your registration for " + tournament.name + " has been recorded in this browser.";
    form.hidden = true;
    formPanelHeading.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
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
})();
