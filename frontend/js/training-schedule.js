document.addEventListener("DOMContentLoaded", function () {
  const endpoint = new URL("../../backend/api/public-content.php?entity=training", window.location.href);
  const sportFilter = document.getElementById("sport-filter");
  const dayFilter = document.getElementById("day-filter");
  const resetButton = document.getElementById("reset-filters");
  const trainingList = document.getElementById("training-list");
  const emptyState = document.getElementById("empty-state");
  const sessionCount = document.getElementById("session-count");
  const totalSessions = document.getElementById("total-sessions");
  const totalClubs = document.getElementById("total-clubs");
  const totalDays = document.getElementById("total-days");
  let sessions = [];

  function slug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function formatDate(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(undefined, {
      weekday: "long", day: "numeric", month: "short", year: "numeric"
    });
  }

  function formatTime(value) {
    if (!value) return "Time not set";
    const parts = value.split(":").map(Number);
    return new Date(2000, 0, 1, parts[0], parts[1]).toLocaleTimeString(undefined, {
      hour: "numeric", minute: "2-digit"
    });
  }

  function populateFilters() {
    const sports = Array.from(new Set(sessions.map(function (item) { return item.sport || item.club; }).filter(Boolean))).sort();
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const days = Array.from(new Set(sessions.map(function (item) {
      return new Date(item.date + "T00:00:00").toLocaleDateString("en", { weekday: "long" });
    }))).sort(function (left, right) { return daysOfWeek.indexOf(left) - daysOfWeek.indexOf(right); });
    sports.forEach(function (sport) {
      const option = document.createElement("option");
      option.value = slug(sport);
      option.textContent = sport;
      sportFilter.appendChild(option);
    });
    days.forEach(function (day) {
      const option = document.createElement("option");
      option.value = day.toLowerCase();
      option.textContent = day;
      dayFilter.appendChild(option);
    });
  }

  function render() {
    const selectedSport = sportFilter.value;
    const selectedDay = dayFilter.value;
    const visible = sessions.filter(function (session) {
      const sport = session.sport || session.club;
      const day = new Date(session.date + "T00:00:00").toLocaleDateString("en", { weekday: "long" }).toLowerCase();
      return (selectedSport === "all" || slug(sport) === selectedSport) && (selectedDay === "all" || day === selectedDay);
    });
    trainingList.innerHTML = visible.map(function (session) {
      const sport = session.sport || session.club;
      const day = new Date(session.date + "T00:00:00").toLocaleDateString("en", { weekday: "long" }).toLowerCase();
      return '<article class="training-card" data-sport="' + escapeHtml(slug(sport)) + '" data-day="' + escapeHtml(day) + '">' +
        '<div class="training-card__main"><p class="training-card__sport">' + escapeHtml(sport) + '</p><h3>' + escapeHtml(session.title) + '</h3>' +
        '<p><i class="fa-regular fa-calendar" aria-hidden="true"></i> ' + escapeHtml(formatDate(session.date)) + '</p>' +
        '<p><i class="fa-regular fa-clock" aria-hidden="true"></i> ' + escapeHtml(formatTime(session.time)) + '</p>' +
        '<p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ' + escapeHtml(session.venue || "Venue not set") + '</p>' +
        (session.coach ? '<p><i class="fa-solid fa-user" aria-hidden="true"></i> ' + escapeHtml(session.coach) + '</p>' : '') +
        '</div></article>';
    }).join("");
    sessionCount.textContent = visible.length + (visible.length === 1 ? " SESSION" : " SESSIONS");
    emptyState.hidden = visible.length !== 0;
    trainingList.hidden = visible.length === 0;
  }

  async function loadSessions() {
    try {
      const response = await fetch(endpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || payload.success !== true || !Array.isArray(payload.records)) {
        throw new Error(payload.message || "The training request could not be completed.");
      }
      sessions = payload.records;
      populateFilters();
      totalSessions.textContent = String(sessions.length);
      totalClubs.textContent = String(new Set(sessions.map(function (item) { return item.club; })).size);
      totalDays.textContent = String(new Set(sessions.map(function (item) {
        return new Date(item.date + "T00:00:00").toLocaleDateString("en", { weekday: "long" });
      })).size);
      render();
    } catch (error) {
      console.error("Unable to load training sessions from the database.", error);
      sessionCount.textContent = "Training unavailable";
      emptyState.textContent = "Training sessions are temporarily unavailable.";
      emptyState.hidden = false;
      trainingList.hidden = true;
    }
  }

  sportFilter.addEventListener("change", render);
  dayFilter.addEventListener("change", render);
  resetButton.addEventListener("click", function () {
    sportFilter.value = "all";
    dayFilter.value = "all";
    render();
  });

  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  function applyTheme(theme) {
    htmlElement.setAttribute("data-theme", theme);
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try {
      localStorage.setItem("sportsHubTheme", theme);
    } catch (error) {
      console.warn("Could not save the selected theme.", error);
    }
  }
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("sportsHubTheme");
  } catch (error) {
    console.warn("Could not read the saved theme.", error);
  }
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(htmlElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  loadSessions();
});
