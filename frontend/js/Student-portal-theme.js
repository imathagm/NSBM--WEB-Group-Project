(function () {
  var root = document.documentElement;
  var savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem("sportshub-theme");
    if (!savedTheme) savedTheme = window.localStorage.getItem("nsbm-student-portal-theme");
  } catch (error) {
    console.warn("Unable to load the student portal theme preference.", error);
  }

  var initialTheme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", initialTheme);

  document.addEventListener("DOMContentLoaded", function () {
    var themeToggle = document.getElementById("theme-toggle");
    var themeIcon = themeToggle.querySelector("i");
    var themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme, savePreference) {
      var isDark = theme === "dark";
      root.setAttribute("data-theme", theme);
      themeIcon.classList.toggle("fa-sun", isDark);
      themeIcon.classList.toggle("fa-moon", !isDark);
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeMeta.setAttribute("content", isDark ? "#0c1511" : "#f1f6f3");

      if (savePreference) {
        try {
          window.localStorage.setItem("sportshub-theme", theme);
        } catch (error) {
          console.warn("Unable to save the student portal theme preference.", error);
        }
      }
    }

    applyTheme(initialTheme, false);
    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });

    window.addEventListener("storage", function (event) {
      if (event.key === "sportshub-theme" && (event.newValue === "light" || event.newValue === "dark")) {
        applyTheme(event.newValue, false);
      }
    });
  });
})();
