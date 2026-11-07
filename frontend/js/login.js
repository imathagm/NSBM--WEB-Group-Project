
const forms = {
    login: document.getElementById("studentLogin"),
    register: document.getElementById("studentRegister"),
    admin: document.getElementById("adminLogin"),
    forgot: document.getElementById("forgotPassword")
};

const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const notice = document.getElementById("notice");
const tabs = document.querySelectorAll(".mode-tab");

const descriptions = {
    login: [
        "Student Login",
        "Welcome back! Please enter your details."
    ],
    register: [
        "Student Registration",
        "Create your NSBM Sports Club account."
    ],
    admin: [
        "Administrator Login",
        "Sign in using your authorized admin account."
    ],
    forgot: [
        "Reset Password",
        "Request a link to recover your account."
    ]
};

let currentView = "login";

function showNotice(message, type = "success") {
    notice.textContent = message;
    notice.className = "notice";

    if (type === "error") {
        notice.classList.add("error");
    }

    notice.hidden = false;
}

function hideNotice() {
    notice.hidden = true;
    notice.textContent = "";
    notice.className = "notice";
}

function showView(view) {
    if (!forms[view]) return;

    currentView = view;
    hideNotice();

    Object.entries(forms).forEach(([name, form]) => {
        form.hidden = name !== view;
    });

    pageTitle.textContent = descriptions[view][0];
    pageDescription.textContent = descriptions[view][1];

    tabs.forEach(tab => {
        const active =
            (view === "admin" && tab.dataset.mode === "admin") ||
            (view !== "admin" && tab.dataset.mode === "student");

        tab.classList.toggle("active", active);
    });
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        showView(tab.dataset.mode === "admin" ? "admin" : "login");
    });
});

document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
        showView(button.dataset.view);
    });
});

// Show or hide passwords.
document.querySelectorAll(".show-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";
        button.textContent = isHidden ? "Hide" : "Show";
    });
});

// Student login: frontend interface only.
forms.login.addEventListener("submit", event => {
    event.preventDefault();

    showNotice(
        "The login interface is ready, but account verification is not connected. " +
        "Connect a backend and database before signing in.",
        "error"
    );
});

// Student registration: validate input without storing credentials.
forms.register.addEventListener("submit", event => {
    event.preventDefault();

    const password = document.getElementById("registerPassword").value;
    const confirmation = document.getElementById("confirmPassword").value;
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("registerEmail").value.trim();

    if (!studentId || !email) {
        showNotice("Please enter your student ID and email.", "error");
        return;
    }

    if (password.length < 8) {
        showNotice("Your password must contain at least 8 characters.", "error");
        return;
    }

    if (password !== confirmation) {
        showNotice("The passwords do not match. Please try again.", "error");
        return;
    }

    showNotice(
        "Your form passed the basic checks. Account creation needs a backend " +
        "and database; no account or password has been saved.",
        "error"
    );
});

// Admin login: real authorization must happen on the server.
forms.admin.addEventListener("submit", event => {
    event.preventDefault();

    showNotice(
        "Administrator authentication is not connected. A server must verify " +
        "your credentials and admin role before granting access.",
        "error"
    );
});

// Password recovery: no email is sent by this frontend.
forms.forgot.addEventListener("submit", event => {
    event.preventDefault();

    showNotice(
        "Password recovery is not connected yet. A backend must generate an " +
        "expiring reset token and send a reset link.",
        "error"
    );
});

// Start on the student login page.
showView("login");
