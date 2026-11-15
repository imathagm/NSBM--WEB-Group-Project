(function () {
  var scriptUrl = document.currentScript.src;
  var registrationEndpoint = new URL("../../backend/api/tournament-registration.php", scriptUrl);
  var eventsEndpoint = new URL("../../backend/api/public-content.php?entity=events", scriptUrl);
  var registrationParams = new URLSearchParams(window.location.search);
  var eventId = registrationParams.get("match") || registrationParams.get("tournament");
  var eventKind = registrationParams.has("match") ? "Match" : "Tournament";
  var event = null;
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
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }

  function isDeadlinePassed() {
    return !event || !event.registrationDeadline || todayAsISO() > event.registrationDeadline;
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

  function showEvent(record) {
    event = record;
    document.title = "Register — " + record.title + " | NSBM Student Portal";
    document.getElementById("tournament-name").textContent = record.title;
    document.getElementById("summary-category").textContent =
      (record.sport || "SPORT") + " · " + record.kind.toUpperCase();
    document.getElementById("summary-start").textContent = formatDate(record.date);
    document.getElementById("summary-deadline").textContent = formatDate(record.registrationDeadline);
    document.getElementById("summary-venue").textContent = record.venue || "Not published";
    document.getElementById("summary-sport-icon").hidden = true;
    document.getElementById("summary-art").dataset.sport =
      String(record.sport || "sport").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (isDeadlinePassed()) {
      disableUnavailableRegistration(record.registrationDeadline
        ? "The registration deadline for this event has passed."
        : "Registration is unavailable because this event has no deadline.");
    }
  }

  async function loadEvent() {
    try {
      if (!eventId) throw new Error("Choose a match or tournament from the event list.");
      var response = await fetch(eventsEndpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
      var payload = await response.json();
      if (!response.ok || payload.success !== true || !Array.isArray(payload.records)) {
        throw new Error(payload.message || "Event records are temporarily unavailable.");
      }
      var record = payload.records.find(function (item) {
        return String(item.id) === eventId && item.kind === eventKind;
      });
      if (!record) throw new Error("This event is no longer available for registration.");
      showEvent(record);
    } catch (error) {
      console.error("Unable to load event registration details.", error);
      document.getElementById("tournament-name").textContent = "Event unavailable";
      document.getElementById("summary-category").textContent = "REGISTRATION NOT AVAILABLE";
      document.getElementById("summary-start").textContent = "—";
      document.getElementById("summary-deadline").textContent = "—";
      document.getElementById("summary-venue").textContent = "—";
      disableUnavailableRegistration(error.message || "Event details are temporarily unavailable.");
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
    document.getElementById("faculty").value = session.user.faculty || "";
    document.getElementById("batch").value = session.user.academicYear || "";
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

  form.addEventListener("submit", async function (submitEvent) {
    submitEvent.preventDefault();
    clearFormError();
    if (!window.sportshubAuth) {
      showFormError("The account service is unavailable.");
      return;
    }
    if (!eventId) {
      showFormError("Choose a match or tournament from the event list.");
      return;
    }
    if (isDeadlinePassed()) {
      disableUnavailableRegistration("The registration deadline has passed or is not available.");
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

        body: JSON.stringify({ fixtureId: eventId })

        body: JSON.stringify({
          tournamentId: tournamentId,
          fullName: fullNameInput.value.trim(),
          studentId: studentId,
          email: emailInput.value.trim(),
          faculty: document.getElementById('faculty').value,
          yearOfStudy: document.getElementById('batch').value
        })

      });
      var result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Your registration could not be submitted.");
      }
      document.getElementById("success-copy").textContent =
        result.message + " Current status: " + result.status + ".";
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

  loadEvent();
})();
