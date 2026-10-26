document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector("#club-search-form");
    const searchInput = document.querySelector("#club-search");
    const clearSearchButton = document.querySelector("#clear-search");
    const categoryButtons = Array.from(document.querySelectorAll("[data-category-filter]"));
    const clubCards = Array.from(document.querySelectorAll(".club-card"));
    const resultsCount = document.querySelector("#results-count");
    const emptyState = document.querySelector("#empty-state");
    const clubDialog = document.querySelector("#club-dialog");
    const dialogCloseButton = document.querySelector("#dialog-close");
    const dialogVisual = document.querySelector("#dialog-visual");
    const dialogCategory = document.querySelector("#dialog-category");
    const dialogTitle = document.querySelector("#dialog-title");
    const dialogDescription = document.querySelector("#dialog-description");
    const currentYear = document.querySelector("#current-year");
    let selectedCategory = "all";

    function updateDirectory() {
        const searchTerm = searchInput.value.trim().toLocaleLowerCase();
        let visibleCount = 0;

        clubCards.forEach(function (card) {
            const matchesName = card.dataset.clubName.toLocaleLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
            const isVisible = matchesName && matchesCategory;

            card.hidden = !isVisible;
            if (isVisible) {
                visibleCount += 1;
            }
        });

        resultsCount.textContent = "Showing " + visibleCount + (visibleCount === 1 ? " club" : " clubs");
        emptyState.hidden = visibleCount !== 0;
        clearSearchButton.hidden = searchInput.value.length === 0;
    }

    function openClubDetails(card) {
        const clubName = card.dataset.clubName;
        const categoryLabel = card.querySelector(".club-card__category").textContent;
        const description = card.querySelector(".club-card__description").textContent;
        const illustration = card.querySelector(".club-image, .club-emblem").cloneNode(true);

        dialogVisual.replaceChildren(illustration);
        dialogCategory.textContent = categoryLabel;
        dialogTitle.textContent = clubName;
        dialogDescription.textContent = description;
        clubDialog.showModal();
    }

    function loadClubIllustrations() {
        clubCards.forEach(function (card) {
            const placeholder = card.querySelector(".club-emblem");
            const image = document.createElement("img");

            image.className = "club-image";
            image.alt = card.dataset.clubName + " sport illustration";
            image.width = 320;
            image.height = 220;
            image.addEventListener("load", function () {
                placeholder.replaceWith(image);
            }, { once: true });
            image.addEventListener("error", function () {
                console.error("Unable to load club illustration: " + image.src);
            }, { once: true });
            image.src = placeholder.dataset.imagePath;
        });
    }

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    searchInput.addEventListener("input", updateDirectory);

    clearSearchButton.addEventListener("click", function () {
        searchInput.value = "";
        updateDirectory();
        searchInput.focus();
    });

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.categoryFilter;
            categoryButtons.forEach(function (categoryButton) {
                const isSelected = categoryButton === button;
                categoryButton.classList.toggle("is-active", isSelected);
                categoryButton.setAttribute("aria-pressed", String(isSelected));
            });
            updateDirectory();
        });
    });

    clubCards.forEach(function (card) {
        const viewButton = card.querySelector(".club-card__action");
        if (viewButton.tagName === "BUTTON") {
            viewButton.setAttribute("aria-label", "View " + card.dataset.clubName + " club details");
            viewButton.addEventListener("click", function () {
                openClubDetails(card);
            });
        }
    });

    loadClubIllustrations();

    dialogCloseButton.addEventListener("click", function () {
        clubDialog.close();
    });

    clubDialog.addEventListener("click", function (event) {
        if (event.target === clubDialog) {
            clubDialog.close();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && clubDialog.open) {
            event.preventDefault();
            clubDialog.close();
        }
    });

    currentYear.textContent = String(new Date().getFullYear());
});