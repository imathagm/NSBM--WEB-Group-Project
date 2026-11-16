(function () {
  "use strict";

  var scriptUrl = document.currentScript.src;
  var clubApplicationEndpoint = new URL("../../backend/api/club-application.php", scriptUrl);
  var clubListEndpoint = new URL("../../backend/api/public-content.php?entity=clubs", scriptUrl);

  document.addEventListener("DOMContentLoaded", async function () {
    var form = document.getElementById("registration-form");
    var message = document.getElementById("registration-message");
    var submit = form.querySelector('button[type="submit"]');
    var clubs = document.getElementById("club-select");
    var session;

    function showMessage(text, isError) {
      message.textContent = text;
      message.className = "message " + (isError ? "error" : "success");
      message.hidden = false;
    }

    function setSelectValue(select, value) {
      if (!value) return;
      var option = Array.from(select.options).find(function (item) {
        return item.value === value;
      });
      if (!option) {
        select.add(new Option(value, value));
      }
      select.value = value;
    }

    function fillStudent() {
      document.getElementById("full-name").value = session.user.fullName || "";
      document.getElementById("student-id").value = session.user.studentId || "";
      document.getElementById("student-email").value = session.user.email || "";
      setSelectValue(document.getElementById("faculty"), session.user.faculty || "");
      setSelectValue(document.getElementById("study-year"), session.user.academicYear || "");
    }

    document.querySelectorAll(".current-year").forEach(function (element) {
      element.textContent = new Date().getFullYear();
    });

    submit.disabled = true;
    clubs.replaceChildren(new Option("Loading clubs…", ""));
    try {
      session = await window.sportshubAuth.session();
      if (!session.authenticated) {
        window.location.replace("../login/login.html");
        return;
      }
      fillStudent();

      var response = await fetch(clubListEndpoint, {
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });
      var result = await response.json();
      if (!response.ok || result.success !== true || !Array.isArray(result.records)) {
        throw new Error(result.message || "Clubs could not be loaded.");
      }

      clubs.replaceChildren(new Option("Select a club", ""));
      result.records.forEach(function (club) {
        clubs.add(new Option(club.name, club.id));
      });
      var requestedClub = new URLSearchParams(window.location.search).get("club");
      if (result.records.some(function (club) { return club.id === requestedClub; })) {
        clubs.value = requestedClub;
      }
      if (!result.records.length) {
        throw new Error("No active clubs are accepting applications yet.");
      }
      submit.disabled = false;
    } catch (error) {
      showMessage(error.message || "Unable to connect to SportsHub.", true);
    }

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        if (session) fillStudent();
      }, 0);
      message.hidden = true;
    });
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!session || !form.reportValidity()) return;
      submit.disabled = true;
      try {
        var current = await window.sportshubAuth.session();
        if (!current.authenticated) {
          window.location.assign("../login/login.html");
          return;
        }
        var response = await fetch(clubApplicationEndpoint, {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": current.csrfToken
          },
          body: JSON.stringify({
            clubId: clubs.value,
            faculty: document.getElementById("faculty").value,
            academicYear: document.getElementById("study-year").value,
            experience: document.getElementById("experience").value,
            notes: document.getElementById("notes").value.trim()
          })
        });
        var result = await response.json();
        if (!response.ok || result.success !== true) {
          throw new Error(result.message || "Your application could not be saved.");
        }
        form.reset();
        showMessage(result.message, false);
      } catch (error) {
        showMessage(error.message || "Unable to connect to SportsHub.", true);
      } finally {
        submit.disabled = false;
      }
    });
  });
})();
