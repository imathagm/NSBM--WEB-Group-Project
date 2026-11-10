
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

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.mode === (view === "admin" ? "admin" : "student")
        );
    });

    message.style.color = "";
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


// Student accounts are verified by the PHP session API.
studentLogin.addEventListener("submit", async event => {
    event.preventDefault();
    const button = studentLogin.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = "";
    try {
        await window.sportshubAuth.post("login", {
            identifier: document.getElementById("studentEmail").value.trim(),
            password: document.getElementById("studentPassword").value,
            remember: document.getElementById("rememberMe").checked
        });
        window.location.assign("../student/dashboard.html");
    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});

studentRegister.addEventListener("submit", async event => {
    event.preventDefault();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.style.color = "red";
        return;
    }

    const button = studentRegister.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = "";
    try {
        await window.sportshubAuth.post("register", {
            fullName: document.getElementById("fullName").value.trim(),
            studentId: document.getElementById("registerStudentID").value.trim(),
            email: document.getElementById("registerEmail").value.trim(),
            contactNumber: document.getElementById("contactNumber").value.trim(),
            sportOfInterest: document.getElementById("sport").value,
            password: password
        });
        window.location.assign("../student/dashboard.html");
    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});


// ADMIN LOGIN

adminLogin.addEventListener("submit", event => {

    event.preventDefault();

    message.textContent =
        "Administrator sign-in is not connected yet. Use a student account or contact the project administrator.";
    message.style.color = "red";

});


// FORGOT PASSWORD

forgotPassword.addEventListener("submit", async event => {
    event.preventDefault();
    const button = forgotPassword.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = "";

    try {
        const response = await fetch("../../backend/api/forgot-password.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("resetEmail").value.trim()
            })
        });
        const data = await response.json();
        message.textContent = data.message || "Password recovery request failed.";
        if (!response.ok) message.style.color = "red";
    } catch (error) {
        message.style.color = "red";
        message.textContent = "Unable to connect to the password recovery service.";
    } finally {
        button.disabled = false;
    }
});

const initialView = window.location.hash.slice(1);
if (["login", "register", "admin", "forgot"].includes(initialView)) {
    showForm(initialView);
}

window.sportshubAuth.session().then(function (session) {
    if (session.authenticated) window.location.replace("../student/dashboard.html");
}).catch(function (error) {
    console.error("Unable to check the existing student session.", error);
});
