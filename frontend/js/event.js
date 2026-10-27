
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector("#event-search-form");
    const searchInput = document.querySelector("#event-search");
    const clearSearchButton = document.querySelector("#clear-event-search");

    const filterButtons = Array.from(
        document.querySelectorAll("[data-event-filter]")
    );

    const eventCards = Array.from(
        document.querySelectorAll(".event-card")
    );

    const resultsCount = document.querySelector("#event-results-count");
    const emptyState = document.querySelector("#event-empty-state");

    const eventDialog = document.querySelector("#event-dialog");
    const dialogCloseButton = document.querySelector("#event-dialog-close");
    const dialogCategory = document.querySelector("#event-dialog-category");
    const dialogTitle = document.querySelector("#event-dialog-title");
    const dialogDescription = document.querySelector("#event-dialog-description");
    const dialogDate = document.querySelector("#event-dialog-date");
    const dialogVenue = document.querySelector("#event-dialog-venue");

    const announcementSearch = document.querySelector("#announcement-search");
    const announcementCards = Array.from(
        document.querySelectorAll(".announcement-card")
    );

    const currentYear = document.querySelector("#current-year");

    let selectedCategory = "all";

    // Search and filter events
    function updateEvents() {
        const searchText = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        eventCards.forEach(function (card) {
            const eventName = card.dataset.eventName || "";
            const eventDescription = card.dataset.eventDescription || "";
            const eventCategory = card.dataset.category || "";

            const cardText = (
                eventName + " " + eventDescription
            ).toLowerCase();

            const matchesSearch = cardText.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                eventCategory === selectedCategory;

            const isVisible = matchesSearch && matchesCategory;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (resultsCount) {
            resultsCount.textContent =
                visibleCount +
                (visibleCount === 1 ? " event found" : " events found");
        }

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }

        if (clearSearchButton) {
            clearSearchButton.hidden = searchText === "";
        }
    }

    // Open event details
    function openEventDetails(card) {
        if (!eventDialog || typeof eventDialog.showModal !== "function") {
            return;
        }

        const title = card.querySelector("h3");
        const type = card.querySelector(".event-type");
        const description = card.querySelector(".event-details");

        if (dialogTitle) {
            dialogTitle.textContent = title
                ? title.textContent.trim()
                : "Event Details";
        }

        if (dialogCategory) {
            dialogCategory.textContent = type
                ? type.textContent.trim()
                : card.dataset.category || "Event";
        }

        if (dialogDescription) {
            dialogDescription.textContent =
                card.dataset.eventDescription ||
                (description ? description.textContent.trim() : "");
        }

        if (dialogDate) {
            dialogDate.textContent =
                "Date: " + (card.dataset.date || "To be announced");
        }

        if (dialogVenue) {
            dialogVenue.textContent =
                "Venue: " + (card.dataset.venue || "To be announced");
        }

        eventDialog.showModal();
    }

    // Search form
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            updateEvents();
        });

        searchInput.addEventListener("input", updateEvents);
    }

    // Clear search
    if (clearSearchButton && searchInput) {
        clearSearchButton.addEventListener("click", function () {
            searchInput.value = "";
            updateEvents();
            searchInput.focus();
        });
    }

    // Category filters
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.eventFilter || "all";

            filterButtons.forEach(function (filterButton) {
                const isActive = filterButton === button;

                filterButton.classList.toggle("is-active", isActive);
                filterButton.classList.toggle("active", isActive);

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            updateEvents();
        });
    });

    // Event details buttons
    eventCards.forEach(function (card) {
        const detailsButton = card.querySelector(".event-card__action");

        if (detailsButton) {
            detailsButton.addEventListener("click", function () {
                openEventDetails(card);
            });
        }
    });

    // Close dialog using the close button
    if (dialogCloseButton && eventDialog) {
        dialogCloseButton.addEventListener("click", function () {
            eventDialog.close();
        });
    }

    // Close dialog by clicking outside
    if (eventDialog) {
        eventDialog.addEventListener("click", function (event) {
            if (event.target === eventDialog) {
                eventDialog.close();
            }
        });
    }

    // Close dialog using Escape
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            eventDialog &&
            eventDialog.open
        ) {
            eventDialog.close();
        }
    });

    // Search announcements
    if (announcementSearch) {
        announcementSearch.addEventListener("input", function () {
            const searchText = announcementSearch.value
                .trim()
                .toLowerCase();

            announcementCards.forEach(function (card) {
                const cardText = card.textContent.toLowerCase();
                card.hidden = !cardText.includes(searchText);
            });
        });
    }

    // Automatically update the footer year
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }

    // Display all events when the page loads
    updateEvents();
});
