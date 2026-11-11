(function () {
  var root = document.documentElement;
  var loginUrl = "../login/login.html";

  function showServiceError(error) {
    console.error("Unable to verify the student session.", error);
    var notice = document.createElement("p");
    notice.className = "auth-gate-notice";
    notice.setAttribute("role", "alert");
    notice.textContent = "The account service is unavailable. Start the PHP server and try again.";
    document.body.prepend(notice);
  }

  function wireLogout() {
    document.querySelectorAll(".sidebar-logout").forEach(function (link) {
      link.addEventListener("click", async function (event) {
        event.preventDefault();
        link.setAttribute("aria-disabled", "true");
        try {
          await window.sportshubAuth.post("logout", {});
          window.location.assign(loginUrl);
        } catch (error) {
          link.removeAttribute("aria-disabled");
          console.error("Student sign-out failed.", error);
          var notice = document.createElement("p");
          notice.className = "auth-gate-notice";
          notice.setAttribute("role", "alert");
          notice.textContent = error.message;
          document.body.prepend(notice);
        }
      });
    });
  }

  window.sportshubAuth.session().then(function (session) {
    if (!session.authenticated) {
      window.location.replace(loginUrl);
      return;
    }

    root.setAttribute("data-auth-state", "ready");
    if (session.user && session.user.fullName) {
      var greeting = document.querySelector(".page-head p");
      if (greeting && document.querySelector("#dashboard")) {
        greeting.textContent = "Welcome back, " + session.user.fullName + "! Here’s your sports overview.";
      }

      var profile = document.querySelector("#profile .panel p");
      if (profile) {
        var details = [session.user.studentId, session.user.email, session.user.contactNumber, session.user.sportOfInterest]
          .filter(Boolean);
        profile.textContent = session.user.fullName + (details.length ? " · " + details.join(" · ") : "");
      }
    }
    wireLogout();
  }).catch(showServiceError);
})();
