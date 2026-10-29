// NSBM Sports Hub - Events Page

// Sample Sports Events

const events = [

    {
        id: 1,
        title: "NSBM Football Championship",
        category: "Football",
        date: "2026-11-15",
        time: "9:00 AM",
        location: "NSBM Football Ground",
        image: "../assets/images/football.svg",
        description: "Join the inter-university football competition and support your team."
    },

    {
        id: 2,
        title: "Cricket Tournament",
        category: "Cricket",
        date: "2026-11-20",
        time: "10:00 AM",
        location: "NSBM Cricket Ground",
        image: "../assets/images/cricket.svg",
        description: "Show your cricket skills and compete with other university teams."
    },

    {
        id: 3,
        title: "Basketball Challenge",
        category: "Basketball",
        date: "2026-11-25",
        time: "2:00 PM",
        location: "Indoor Sports Complex",
        image: "../assets/images/basketball.svg",
        description: "Experience an exciting basketball competition on the court."
    },

    {
        id: 4,
        title: "Badminton Championship",
        category: "Badminton",
        date: "2026-12-01",
        time: "9:30 AM",
        location: "NSBM Indoor Court",
        image: "../assets/images/badminton.svg",
        description: "Take part in the university badminton championship."
    },

    {
        id: 5,
        title: "Athletics Meet",
        category: "Athletics",
        date: "2026-12-05",
        time: "8:00 AM",
        location: "University Sports Ground",
        image: "../assets/images/athletics.svg",
        description: "Show your speed, strength and athletic abilities."
    },

    {
        id: 6,
        title: "Volleyball Tournament",
        category: "Volleyball",
        date: "2026-12-10",
        time: "1:00 PM",
        location: "NSBM Volleyball Court",
        image: "../assets/images/volleyball.svg",
        description: "Build teamwork and enjoy an exciting volleyball event."
    }

];


// Get HTML Elements

const eventsContainer =
    document.getElementById("eventsContainer");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const noEvents =
    document.getElementById("noEvents");

const modal =
    document.getElementById("registrationModal");

const closeModalButton =
    document.getElementById("closeModal");

const selectedEventText =
    document.getElementById("selectedEvent");

const registrationForm =
    document.getElementById("registrationForm");

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


let selectedCategory = "All";

let currentEvent = null;


// Format Event Date

function formatDate(dateString) {

    const date = new Date(${dateString}T00:00:00);

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// Display Events

function displayEvents(eventList) {

    eventsContainer.innerHTML = "";

    noEvents.hidden = eventList.length !== 0;

    eventList.forEach((event) => {

        const card = document.createElement("article");

        card.className = "event-card";

        card.innerHTML = `

            <img
                src="${event.image}"
                alt="${event.category} event illustration"
            >

            <div class="event-details">

                <span class="event-category">
                    ${event.category}
                </span>

                <h3>
                    ${event.title}
                </h3>

                <div class="event-meta">

                    <span>📅 ${formatDate(event.date)}</span>

                    <span>🕒 ${event.time}</span>

                    <span>📍 ${event.location}</span>

                </div>

                <p>
                    ${event.description}
                </p>

                <button
                    class="register-btn"
                    type="button"
                    data-event-id="${event.id}"
                >
                    Register Now
                </button>

            </div>

        `;

        eventsContainer.appendChild(card);

    });

}


// Search and Filter Events

function filterEvents() {

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const filtered = events.filter((event) => {

        const matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        const searchableText =
            ${event.title} ${event.category} ${event.location}
            .toLowerCase();

        return matchesCategory &&
            searchableText.includes(searchTerm);

    });

    displayEvents(filtered);

}


// Category Filter Buttons

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterEvents();

    });

});


// Search Input

searchInput.addEventListener("input", filterEvents);


// Open Registration Modal

eventsContainer.addEventListener("click", (event) => {

    const button = event.target.closest(".register-btn");

    if (!button) return;

    currentEvent = events.find(
        (item) => item.id === Number(button.dataset.eventId)
    );

    if (!currentEvent) return;

    selectedEventText.textContent =
        Selected event: ${currentEvent.title};

    modal.classList.add("show");

    modal.setAttribute("aria-hidden", "false");

    document.getElementById("studentName").focus();

});


// Close Registration Modal

function closeModal() {

    modal.classList.remove("show");

    modal.setAttribute("aria-hidden", "true");

}

closeModalButton.addEventListener("click", closeModal);


// Close Modal When Clicking Outside

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModal();
    }

});


// Close Modal Using Escape Key

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeModal();
    }

});


// Registration Form

registrationForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("studentName").value.trim();

    const studentId =
        document.getElementById("studentId").value.trim();

    const email =
        document.getElementById("studentEmail").value.trim();


    alert(

        Demo registration submitted!\n\n +

        Event: ${currentEvent.title}\n +

        Name: ${name}\n +

        Student ID: ${studentId}\n +

        Email: ${email}\n\n +

        This form does not save information to a database.

    );


    registrationForm.reset();

    closeModal();

});


// Mobile Navigation Menu

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});


navLinks.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

    });

});


// Display All Events When Page Loads

displayEvents(events);