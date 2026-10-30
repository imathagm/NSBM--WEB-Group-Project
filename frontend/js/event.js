
document.addEventListener("DOMContentLoaded", function () {
    // ========================================
    // STORY VIEWER
    // ========================================

    const storyItems = Array.from(document.querySelectorAll(".story-item"));
    const storyViewer = document.getElementById("storyViewer");
    const viewerTitle = document.getElementById("viewerTitle");
    const viewerCategory = document.getElementById("viewerCategory");
    const viewerText = document.getElementById("viewerText");
    const viewerTime = document.getElementById("viewerTime");
    const viewerIcon = document.getElementById("viewerIcon");
    const viewerCounter = document.getElementById("viewerCounter");
    const viewerArt = document.getElementById("viewerArt");
    const progressTrack = document.getElementById("storyProgressTrack");

    const closeStoryViewer = document.getElementById("closeStoryViewer");
    const storyBackdrop = document.getElementById("storyBackdrop");
    const storyPrevious = document.getElementById("storyPrevious");
    const storyNext = document.getElementById("storyNext");

    let currentStoryIndex = 0;
    let storyProgressTimer = null;

    const storyIcons = {
        trophy: "fa-trophy",
        team: "fa-people-group",
        football: "fa-futbol",
        run: "fa-person-running",
        bell: "fa-bell",
        medal: "fa-medal"
    };

    function createStoryProgress() {
        if (!progressTrack) return;

        progressTrack.innerHTML = "";

        storyItems.forEach(function () {
            const segment = document.createElement("span");
            segment.className = "story-progress-segment";

            const fill = document.createElement("span");
            fill.className = "story-progress-fill";

            segment.appendChild(fill);
            progressTrack.appendChild(segment);
        });
    }

    function updateStoryProgress() {
        if (!progressTrack) return;

        const fills = progressTrack.querySelectorAll(".story-progress-fill");

        fills.forEach(function (fill, index) {
            fill.style.width = index < currentStoryIndex ? "100%" : "0%";
        });
    }

    function openStory(index) {
        if (!storyItems.length || !storyViewer) return;

        currentStoryIndex = (index + storyItems.length) % storyItems.length;

        const story = storyItems[currentStoryIndex];

        const title = story.dataset.storyTitle || "Campus update";
        const category = story.dataset.storyCategory || "SPORTSHUB UPDATE";
        const description = story.dataset.storyText || "";
        const type = story.dataset.storyType || "trophy";
        const time = story.dataset.storyTime || "LATEST UPDATE";

        if (viewerTitle) viewerTitle.textContent = title;
        if (viewerCategory) viewerCategory.textContent = category;
        if (viewerText) viewerText.textContent = description;
        if (viewerTime) viewerTime.textContent = time;

        if (viewerCounter) {
            viewerCounter.textContent =
                String(currentStoryIndex + 1).padStart(2, "0") +
                " / " +
                String(storyItems.length).padStart(2, "0");
        }

        if (viewerIcon) {
            viewerIcon.className = "fa-solid " + (storyIcons[type] || "fa-trophy");
        }

        if (viewerArt) {
            viewerArt.dataset.storyType = type;
        }

        updateStoryProgress();

        storyViewer.classList.add("is-active");
        storyViewer.setAttribute("aria-hidden", "false");
        document.body.classList.add("story-open");

        if (closeStoryViewer) closeStoryViewer.focus();
    }

    function closeStories() {
        if (!storyViewer) return;

        storyViewer.classList.remove("is-active");
        storyViewer.setAttribute("aria-hidden", "true");
        document.body.classList.remove("story-open");

        if (storyProgressTimer) {
            clearTimeout(storyProgressTimer);
            storyProgressTimer = null;
        }
    }

    storyItems.forEach(function (story, index) {
        story.addEventListener("click", function () {
            openStory(index);
        });
    });

    if (closeStoryViewer) {
        closeStoryViewer.addEventListener("click", closeStories);
    }

    if (storyBackdrop) {
        storyBackdrop.addEventListener("click", closeStories);
    }

    if (storyPrevious) {
        storyPrevious.addEventListener("click", function () {
            openStory(currentStoryIndex - 1);
        });
    }

    if (storyNext) {
        storyNext.addEventListener("click", function () {
            openStory(currentStoryIndex + 1);
        });
    }

    document.addEventListener("keydown", function (event) {
        if (!storyViewer || !storyViewer.classList.contains("is-active")) return;

        if (event.key === "Escape") {
            closeStories();
        } else if (event.key === "ArrowRight") {
            openStory(currentStoryIndex + 1);
        } else if (event.key === "ArrowLeft") {
            openStory(currentStoryIndex - 1);
        }
    });

    createStoryProgress();

    // ========================================
    // EVENT SEARCH AND CATEGORY FILTERS
    // ========================================

    const eventSearch = document.getElementById("eventSearch");
    const clearSearch = document.getElementById("clearSearch");
    const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
    const eventCards = Array.from(document.querySelectorAll(".event-tile"));
    const resultsLabel = document.getElementById("resultsLabel");
    const noEvents = document.getElementById("noEvents");
    const resetFilters = document.getElementById("resetFilters");

    let selectedCategory = "all";

    function filterEvents() {
        const searchText = eventSearch
            ? eventSearch.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        eventCards.forEach(function (card) {
            const category = (card.dataset.category || "").toLowerCase();
            const searchableText = card.textContent.toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesSearch = searchableText.includes(searchText);
            const shouldShow = matchesCategory && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) visibleCount++;
        });

        if (resultsLabel) {
            resultsLabel.textContent =
                "Showing " + visibleCount +
                (visibleCount === 1 ? " event" : " events");
        }

        if (noEvents) {
            noEvents.hidden = visibleCount !== 0;
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.filter || "all";

            filterButtons.forEach(function (item) {
                const isActive = item === button;

                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            filterEvents();
        });
    });

    if (eventSearch) {
        eventSearch.addEventListener("input", filterEvents);
    }

    if (clearSearch && eventSearch) {
        clearSearch.addEventListener("click", function () {
            eventSearch.value = "";
            filterEvents();
            eventSearch.focus();
        });
    }

    function resetEventFilters() {
        selectedCategory = "all";

        if (eventSearch) {
            eventSearch.value = "";
        }

        filterButtons.forEach(function (button) {
            const isAll = button.dataset.filter === "all";

            button.classList.toggle("active", isAll);
            button.setAttribute("aria-pressed", String(isAll));
        });

        filterEvents();
    }

    if (resetFilters) {
        resetFilters.addEventListener("click", resetEventFilters);
    }

    filterEvents();

    // ========================================
    // EVENT DETAILS DIALOG
    // ========================================

    const eventDialog = document.getElementById("eventDialog");
    const closeDialog = document.getElementById("closeDialog");

    const dialogTitle = document.getElementById("dialogTitle");
    const dialogCategory = document.getElementById("dialogCategory");
    const dialogDescription = document.getElementById("dialogDescription");
    const dialogDate = document.getElementById("dialogDate");
    const dialogLocation = document.getElementById("dialogLocation");

    const detailButtons = document.querySelectorAll("[data-event-details]");

    function openEventDetails(button) {
        if (!eventDialog) return;

        if (dialogTitle) {
            dialogTitle.textContent =
                button.dataset.title || "Event details";
        }

        if (dialogCategory) {
            dialogCategory.textContent =
                button.dataset.category || "EVENT DETAILS";
        }

        if (dialogDescription) {
            dialogDescription.textContent =
                button.dataset.description || "More information will be announced soon.";
        }

        if (dialogDate) {
            dialogDate.textContent =
                button.dataset.date || "To be announced";
        }

        if (dialogLocation) {
            dialogLocation.textContent =
                button.dataset.location || "To be confirmed";
        }

        if (typeof eventDialog.showModal === "function") {
            if (!eventDialog.open) eventDialog.showModal();
        } else {
            eventDialog.setAttribute("open", "");
        }
    }

    detailButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            openEventDetails(button);
        });
    });

    function closeEventDetails() {
        if (!eventDialog) return;

        if (typeof eventDialog.close === "function" && eventDialog.open) {
            eventDialog.close();
        } else {
            eventDialog.removeAttribute("open");
        }
    }

    if (closeDialog) {
        closeDialog.addEventListener("click", closeEventDetails);
    }

    if (eventDialog) {
        eventDialog.addEventListener("click", function (event) {
            if (event.target === eventDialog) {
                closeEventDetails();
            }
        });
    }

    // ========================================
    // THEME SWITCH BUTTONS
    // ========================================
    // The shared theme.js should manage the actual theme.
    // This section only supports the buttons if that file
    // does not already handle them.

    const themeButtons = document.querySelectorAll("[data-theme-choice]");

    themeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const theme = button.dataset.themeChoice;

            if (theme !== "light" && theme !== "dark") return;

            document.documentElement.setAttribute("data-theme", theme);
        });
    });
});
