(function () {
  "use strict";

  var forms = {
    register: document.getElementById("studentRegister"),
    admin: document.getElementById("adminLogin"),
    forgot: document.getElementById("forgotPassword")
  };
  var message = document.getElementById("message");
  var adminApiBase = new URL("../../backend/api/admin/", document.currentScript.src);
  var adminCsrfToken = "";
  var returnPages = new Set([
    "dashboard.html", "students.html", "clubs.html", "applications.html",
    "training.html", "matches-tournaments.html", "announcements.html",
    "facilities.html", "reports.html"
  ]);
  var params = new URLSearchParams(window.location.search);
  var returnPage = params.get("return");
  if (!returnPage || !returnPages.has(returnPage.split('?')[0])) returnPage = "dashboard.html";

  function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", Boolean(isError));
    message.hidden = false;
  }

 function setView(view) {
    if (!forms[view]) view = "admin";

    Object.keys(forms).forEach(function (name) {
        forms[name].hidden = name !== view;
        forms[name].classList.toggle("hidden", name !== view);
    });

    message.hidden = true;
}

  document.querySelectorAll("[data-view]").forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      setView(control.dataset.view);
    });
  });
  document.querySelectorAll(".toggle-password").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = document.getElementById(button.dataset.target);
      var visible = input.type === "password";
      input.type = visible ? "text" : "password";
      button.textContent = visible ? "Hide" : "Show";
    });
  });




  forms.register.addEventListener("submit", async function (event) {
    event.preventDefault();
    var password = document.getElementById("registerPassword").value;
    if (password !== document.getElementById("confirmPassword").value) {
      showMessage("The passwords do not match.", true);
      return;
    }
    var button = forms.register.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await window.sportshubAuth.post("register", {
        fullName: document.getElementById("fullName").value.trim(),
        studentId: document.getElementById("registerStudentID").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        contactNumber: document.getElementById("contactNumber").value.trim(),
        faculty: document.getElementById("faculty").value.trim(),
        degreeProgram: document.getElementById("degreeProgram").value.trim(),
        academicYear: document.getElementById("academicYear").value.trim(),
        sportOfInterest: document.getElementById("sport").value,
        password: password
      });
      window.location.assign("../student/dashboard.html");
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      button.disabled = false;
    }
  });

  async function adminRequest(path, method, payload) {
    var options = {
      method: method || "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    };
    if (payload) {
      options.headers["Content-Type"] = "application/json";
      options.headers["X-CSRF-Token"] = adminCsrfToken;
      options.body = JSON.stringify(payload);
    }
    var response = await fetch(new URL(path, adminApiBase), options);
    var result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error("The administration service returned an invalid response.");
    }
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || "The administrator request could not be completed.");
    }
    if (typeof result.csrfToken === "string") adminCsrfToken = result.csrfToken;
    return result;
  }

  forms.admin.addEventListener("submit", async function (event) {
    event.preventDefault();
    var button = forms.admin.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      var session = await adminRequest("session.php");
      adminCsrfToken = session.csrfToken;
      await adminRequest("login.php", "POST", {
        email: document.getElementById("adminEmail").value.trim(),
        password: document.getElementById("adminPassword").value
      });
      window.location.assign("../Admin-Portal/" + returnPage);
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      button.disabled = false;
    }
  });

  forms.forgot.addEventListener("submit", async function (event) {
    event.preventDefault();
    var button = forms.forgot.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      var response = await fetch(new URL("../forgot-password.php", adminApiBase), {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: document.getElementById("resetEmail").value.trim() })
      });
      var result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Password recovery is temporarily unavailable.");
      }
      showMessage(result.message, false);
    } catch (error) {
      showMessage(error.message || "Unable to connect to the server.", true);
    } finally {
      button.disabled = false;
    }
  });

 var requestedView = params.get("view") || window.location.hash.slice(1) || "admin";

if (requestedView === "register") {
    setView("register");
} else if (requestedView === "forgot") {
    setView("forgot");
} else {
    setView("admin");
}
})();
