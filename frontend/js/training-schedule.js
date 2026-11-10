
document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. GET HTML ELEMENTS
  // ==========================================

  const sportFilter = document.getElementById("sport-filter");
  const dayFilter = document.getElementById("day-filter");
  const resetButton = document.getElementById("reset-filters");

  const trainingCards = document.querySelectorAll(".training-card");
  const trainingList = document.getElementById("training-list");

  const emptyState = document.getElementById("empty-state");
  const sessionCount = document.getElementById("session-count");

  const totalSessions = document.getElementById("total-sessions");
  const totalHours = document.getElementById("total-hours");
  const totalDays = document.getElementById("total-days");


  // ==========================================
  // 2. UPDATE WEEKLY SUMMARY
  // ==========================================

  function updateSummary() {

    let hours = 0;
    let days = new Set();

    trainingCards.forEach(function (card) {

      const duration = Number(card.dataset.duration);
      const day = card.dataset.day;

      if (!isNaN(duration)) {
        hours = hours + duration;
      }

      if (day) {
        days.add(day);
      }

    });

    if (totalSessions) {
      totalSessions.textContent = trainingCards.length;
    }

    if (totalHours) {
      totalHours.textContent = hours + " hrs";
    }

    if (totalDays) {
      totalDays.textContent = days.size;
    }

  }


  // ==========================================
  // 3. FILTER TRAINING SESSIONS
  // ==========================================

  function filterSessions() {

    if (!sportFilter || !dayFilter) {
      return;
    }

    const selectedSport = sportFilter.value;
    const selectedDay = dayFilter.value;

    let visibleSessions = 0;

    trainingCards.forEach(function (card) {

      const cardSport = card.dataset.sport;
      const cardDay = card.dataset.day;

      const matchesSport =
        selectedSport === "all" || selectedSport === cardSport;

      const matchesDay =
        selectedDay === "all" || selectedDay === cardDay;

      if (matchesSport && matchesDay) {

        card.style.display = "flex";
        visibleSessions++;

      } else {

        card.style.display = "none";

      }

    });


    // Update visible session count
    if (sessionCount) {

      sessionCount.textContent =
        visibleSessions +
        (visibleSessions === 1 ? " SESSION" : " SESSIONS");

    }


    // Display empty state when no sessions match
    if (emptyState && trainingList) {

      if (visibleSessions === 0) {

        emptyState.hidden = false;
        trainingList.style.display = "none";

      } else {

        emptyState.hidden = true;
        trainingList.style.display = "flex";

      }

    }

  }


  // ==========================================
  // 4. FILTER EVENT LISTENERS
  // ==========================================

  if (sportFilter) {
    sportFilter.addEventListener("change", filterSessions);
  }

  if (dayFilter) {
    dayFilter.addEventListener("change", filterSessions);
  }


  // ==========================================
  // 5. RESET FILTERS
  // ==========================================

  if (resetButton) {

    resetButton.addEventListener("click", function () {

      if (sportFilter) {
        sportFilter.value = "all";
      }

      if (dayFilter) {
        dayFilter.value = "all";
      }

      filterSessions();

    });

  }


  // ==========================================
  // 6. LIGHT MODE AND DARK MODE
  // ==========================================

  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  function applyTheme(theme) {

    htmlElement.setAttribute("data-theme", theme);

    if (themeToggle) {

      const icon = themeToggle.querySelector("i");

      if (icon) {

        if (theme === "dark") {
          icon.className = "fa-solid fa-sun";
          themeToggle.setAttribute(
            "aria-label",
            "Switch to light theme"
          );
        } else {
          icon.className = "fa-solid fa-moon";
          themeToggle.setAttribute(
            "aria-label",
            "Switch to dark theme"
          );
        }

      }

    }

    localStorage.setItem("sportsHubTheme", theme);

  }


  // Load previously saved theme
  const savedTheme = localStorage.getItem("sportsHubTheme");

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }


  // Switch theme when button is clicked
  if (themeToggle) {

    themeToggle.addEventListener("click", function () {

      const currentTheme =
        htmlElement.getAttribute("data-theme");

      if (currentTheme === "dark") {
        applyTheme("light");
      } else {
        applyTheme("dark");
      }

    });

  }


  // ==========================================
  // 7. INITIAL PAGE SETUP
  // ==========================================

  updateSummary();
  filterSessions();

});
