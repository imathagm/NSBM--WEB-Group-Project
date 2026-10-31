
const tabs = document.querySelectorAll(".tab");

const studentLogin = document.getElementById("studentLogin");
const studentRegister = document.getElementById("studentRegister");
const adminLogin = document.getElementById("adminLogin");
const forgotPassword = document.getElementById("forgotPassword");

const message = document.getElementById("message");

function hideAllForms() {
    studentLogin.classList.add("hidden");
    studentRegister.classList.add("hidden");
    adminLogin.classList.add("hidden");
    forgotPassword.classList.add("hidden");

    message.textContent = "";
}

function showForm(view) {

    hideAllForms();

    if (view === "login") {
        studentLogin.classList.remove("hidden");
    }

    else if (view === "register") {
        studentRegister.classList.remove("hidden");
    }

    else if (view === "admin") {
        adminLogin.classList.remove("hidden");
    }

    else if (view === "forgot") {
        forgotPassword.classList.remove("hidden");
    }
}


// STUDENT / ADMIN TABS

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(item => item.classList.remove("active"));

        tab.classList.add("active");

        const mode = tab.dataset.mode;

        showForm(mode === "admin" ? "admin" : "login");

    });

});


// SWITCH BETWEEN FORMS

document.querySelectorAll("[data-view]").forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        const view = link.dataset.view;

        showForm(view);

        // Keep the Student tab active when changing student views
        if (view === "register" || view === "forgot" || view === "login") {

            tabs.forEach(tab => {
                tab.classList.toggle("active", tab.dataset.mode === "student");
            });

        }

    });

});


// SHOW / HIDE PASSWORD

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
        }

        else {
            input.type = "password";
            button.textContent = "Show";
        }

    });

});


// STUDENT LOGIN

studentLogin.addEventListener("submit", event => {

    event.preventDefault();

    message.textContent =
        "Student login form submitted. Connect this form to your PHP authentication system.";

});


// STUDENT REGISTRATION

studentRegister.addEventListener("submit", event => {

    event.preventDefault();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        message.textContent = "Passwords do not match!";
        message.style.color = "red";

        return;
    }

    message.style.color = "#176b43";

    message.textContent =
        "Registration form submitted. Connect this form to your PHP registration system.";

});


// ADMIN LOGIN

adminLogin.addEventListener("submit", event => {

    event.preventDefault();

    message.style.color = "#176b43";

    message.textContent =
        "Admin login form submitted. Connect this form to server-side admin authentication.";

});


// FORGOT PASSWORD

forgotPassword.addEventListener("submit", event => {

    event.preventDefault();

    message.style.color = "#176b43";

    message.textContent =
        "Password reset request submitted. Connect this form to your PHP password recovery system.";

});
