(function () {
  var scriptUrl = document.currentScript.src;
  var registrationEndpoint = new URL("../../backend/api/tournament-registration.php", scriptUrl);
  var eventsEndpoint = new URL("../../backend/api/public-content.php?entity=events", scriptUrl);
  var tournamentId = new URLSearchParams(window.location.search).get("tournament");
  var tournament = null;
  var form = document.getElementById("registration-form");
  var formMessage = document.getElementById("form-message");
  var successPanel = document.getElementById("success-panel");
  var formPanelHeading = document.querySelector(".form-panel-heading");
  var statusTag = document.querySelector(".summary-tag");
  var deadlineNote = document.getElementById("deadline-note");
  var submitButton = document.getElementById("submit-registration");
  var csrfToken = "";

  function showFormError(message) {
    formMessage.textContent = message;
    formMessage.hidden = false;
  }

  function clearFormError() {
    formMessage.textContent = "";
    formMessage.hidden = true;
  }

  function formatDate(value) {
    if (!value) return "Not published";
    var parts = value.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("en", {
      day: "2-digit", month: "long", year: "numeric"
    }).format(new Date(parts[0], parts[1] - 1, parts[2]));
  }

  function todayAsISO() {
    var today = new Date();
    return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");
  }

  function isDeadlinePassed() {
    return !tournament || !tournament.registrationDeadline || todayAsISO() > tournament.registrationDeadline;
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

  function showTournament(record) {
    tournament = record;
    document.title = "Register — " + record.title + " | NSBM Student Portal";
    document.getElementById("tournament-name").textContent = record.title;
    document.getElementById("summary-category").textContent =
      (record.sport || "SPORT") + " · TOURNAMENT";
    document.getElementById("summary-start").textContent = formatDate(record.date);
    document.getElementById("summary-deadline").textContent = formatDate(record.registrationDeadline);
    document.getElementById("summary-venue").textContent = record.venue || "Not published";
    document.getElementById("summary-sport-icon").hidden = true;
    document.getElementById("summary-art").dataset.sport =
      String(record.sport || "sport").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (isDeadlinePassed()) {
      disableUnavailableRegistration(record.registrationDeadline
        ? "The registration deadline for this tournament has passed."
        : "Registration is unavailable because this tournament has no deadline.");
    }
  }

  async function loadTournament() {
    try {
      if (!tournamentId) throw new Error("Choose a tournament from the tournament list.");
      var response = await fetch(eventsEndpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
      var payload = await response.json();
      if (!response.ok || payload.success !== true || !Array.isArray(payload.records)) {
        throw new Error(payload.message || "Tournament records are temporarily unavailable.");
      }
      var record = payload.records.find(function (item) {
        return String(item.id) === tournamentId && item.kind === "Tournament";
      });
      if (!record) throw new Error("This tournament is no longer available for registration.");
      showTournament(record);
    } catch (error) {
      console.error("Unable to load tournament registration details.", error);
      document.getElementById("tournament-name").textContent = "Tournament unavailable";
      document.getElementById("summary-category").textContent = "REGISTRATION NOT AVAILABLE";
      document.getElementById("summary-start").textContent = "—";
      document.getElementById("summary-deadline").textContent = "—";
      document.getElementById("summary-venue").textContent = "—";
      disableUnavailableRegistration(error.message || "Tournament details are temporarily unavailable.");
    }
  }

  var authSessionPromise = window.sportshubAuth.session().then(function (session) {
    if (!session.authenticated) {
      window.location.replace("../login/login.html");
      throw new Error("Student sign-in is required.");
    }
    csrfToken = session.csrfToken;
    document.getElementById("full-name").value = session.user.fullName || "";
    document.getElementById("student-id").value = session.user.studentId || "";
    document.getElementById("student-email").value = session.user.email || "";
    return session;
  }).catch(function (error) {
    showFormError(error.message || "The account service is unavailable.");
    return null;
  });

  var idInput = document.getElementById("student-id");
  var emailInput = document.getElementById("student-email");
  form.querySelectorAll("input, select").forEach(function (field) {
    field.addEventListener("input", function () {
      field.setCustomValidity("");
      field.removeAttribute("aria-invalid");
      clearFormError();
    });
    field.addEventListener("change", function () {
      field.setCustomValidity("");
      field.removeAttribute("aria-invalid");
      clearFormError();
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearFormError();
    idInput.setCustomValidity("");
    if (!tournament) {
      showFormError("Registration is unavailable because this tournament could not be found.");
      return;
    }
    if (isDeadlinePassed()) {
      disableUnavailableRegistration("The registration deadline has passed or is not available.");
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
    if (!await authSessionPromise) return;

    submitButton.disabled = true;
    try {
      var response = await fetch(registrationEndpoint, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          tournamentId: tournamentId,
          fullName: fullNameInput.value.trim(),
          studentId: studentId,
          email: emailInput.value.trim()
        })
      });
      var result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Your registration could not be submitted.");
      }
      document.getElementById("success-copy").textContent =
        fullNameInput.value.trim() + ", " + result.message;
      form.hidden = true;
      formPanelHeading.hidden = true;
      successPanel.hidden = false;
      successPanel.focus();
    } catch (error) {
      showFormError(error.message || "Unable to connect to the server.");
    } finally {
      submitButton.disabled = false;
    }
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

  loadTournament();
})();
