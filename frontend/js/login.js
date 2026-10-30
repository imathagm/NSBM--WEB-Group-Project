
const loginForm = document.getElementById("loginForm");

if (loginForm) {
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    alert("Login form submitted successfully! Backend authentication is not connected yet.");
});
}
