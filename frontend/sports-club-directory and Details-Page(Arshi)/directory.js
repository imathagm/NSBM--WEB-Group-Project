document.addEventListener("DOMContentLoaded", function () {
    const endpoint = new URL("../../backend/api/public-content.php?entity=clubs", window.location.href);
    const searchForm = document.querySelector("#club-search-form");
    const searchInput = document.querySelector("#club-search");
    const clearSearchButton = document.querySelector("#clear-search");
    const filterContainer = document.querySelector("#club-filters");
    const grid = document.querySelector("#club-grid");
    const resultsCount = document.querySelector("#results-count");
    const emptyState = document.querySelector("#empty-state");
    const clubDialog = document.querySelector("#club-dialog");
    const dialogCloseButton = document.querySelector("#dialog-close");
    const dialogCategory = document.querySelector("#dialog-category");
    const dialogTitle = document.querySelector("#dialog-title");
    const dialogDescription = document.querySelector("#dialog-description");
    const currentYear = document.querySelector("#current-year");
    let clubs = [];
    let selectedSport = "all";

    function escapeHtml(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    function slug(value) {
        return String(value || "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    function renderFilters() {
        const sports = Array.from(new Set(clubs.map(function (club) { return club.sport; }))).sort();
        filterContainer.replaceChildren();
        [["all", "All Clubs"]].concat(sports.map(function (sport) { return [sport, sport]; }))
            .forEach(function (item, index) {
                const button = document.createElement("button");
                button.className = "filter-button" + (index === 0 ? " is-active" : "");
                button.type = "button";
                button.dataset.categoryFilter = item[0];
                button.setAttribute("aria-pressed", String(index === 0));
                button.textContent = item[1];
                filterContainer.appendChild(button);
            });
    }

    function updateDirectory() {
        const searchTerm = searchInput.value.trim().toLocaleLowerCase();
        const visible = clubs.filter(function (club) {
            const matchesSearch = (club.name + " " + club.sport + " " + (club.description || "")).toLocaleLowerCase().includes(searchTerm);
            return matchesSearch && (selectedSport === "all" || club.sport === selectedSport);
        });
        grid.innerHTML = visible.map(function (club, index) {
            const initials = club.name.split(/\s+/).slice(0, 2).map(function (part) { return part.charAt(0); }).join("");
            return '<article class="club-card" data-club-id="' + escapeHtml(club.id) + '" data-club-name="' + escapeHtml(club.name) + '" data-category="' + escapeHtml(club.sport) + '">' +
                '<div class="club-card__visual"><div class="club-emblem" role="img" aria-label="' + escapeHtml(club.name) + '"><span>' + escapeHtml(initials) + '</span><i aria-hidden="true"></i></div><span class="club-card__index">' + String(index + 1).padStart(2, "0") + '</span></div>' +
                '<div class="club-card__body"><p class="club-card__category">' + escapeHtml(club.sport) + '</p><h3 class="club-card__title">' + escapeHtml(club.name) + '</h3><p class="club-card__description">' + escapeHtml(club.description || "") + '</p><button class="club-card__action" type="button" aria-label="View ' + escapeHtml(club.name) + ' club details">View Club <span aria-hidden="true">↗</span></button></div>' +
                '</article>';
        }).join("");
        resultsCount.textContent = "Showing " + visible.length + (visible.length === 1 ? " club" : " clubs");
        emptyState.textContent = clubs.length ? "No clubs match that search. Try another sport or clear your filters." : "No active clubs have been added yet.";
        emptyState.hidden = visible.length !== 0;
        clearSearchButton.hidden = searchInput.value.length === 0;
    }

    searchForm.addEventListener("submit", function (event) { event.preventDefault(); });
    searchInput.addEventListener("input", updateDirectory);
    clearSearchButton.addEventListener("click", function () {
        searchInput.value = "";
        updateDirectory();
        searchInput.focus();
    });
    filterContainer.addEventListener("click", function (event) {
        const button = event.target.closest("[data-category-filter]");
        if (!button) return;
        selectedSport = button.dataset.categoryFilter;
        filterContainer.querySelectorAll("[data-category-filter]").forEach(function (item) {
            const active = item === button;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-pressed", String(active));
        });
        updateDirectory();
    });
    grid.addEventListener("click", function (event) {
        if (!event.target.closest(".club-card__action")) return;
        const card = event.target.closest("[data-club-id]");
        const club = clubs.find(function (item) { return String(item.id) === card.dataset.clubId; });
        if (!club) return;
        dialogCategory.textContent = club.sport;
        dialogTitle.textContent = club.name;
        dialogDescription.textContent = [club.description, club.coach && "Coach: " + club.coach, club.venue && "Venue: " + club.venue]
            .filter(Boolean).join(" ");
        clubDialog.showModal();
    });
    dialogCloseButton.addEventListener("click", function () { clubDialog.close(); });
    clubDialog.addEventListener("click", function (event) {
        if (event.target === clubDialog) clubDialog.close();
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && clubDialog.open) {
            event.preventDefault();
            clubDialog.close();
        }
    });
    currentYear.textContent = String(new Date().getFullYear());

    async function loadClubs() {
        try {
            if (!endpoint) throw new Error("The clubs service could not be located.");
            const response = await fetch(endpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
            const payload = await response.json();
            if (!response.ok || payload.success !== true || !Array.isArray(payload.records)) {
                throw new Error(payload.message || "The clubs request could not be completed.");
            }
            clubs = payload.records;
            renderFilters();
        } catch (error) {
            console.error("Unable to load clubs from the database.", error);
            emptyState.textContent = "Club records are temporarily unavailable.";
            emptyState.hidden = false;
            resultsCount.textContent = "Clubs unavailable";
            return;
        }
        updateDirectory();
    }

    loadClubs();
});
