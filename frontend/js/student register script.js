// This page demonstrates registration in the browser. It sends and saves no data.
const form = document.getElementById("registration-form");
const fields = Array.from(form.querySelectorAll("input, select"));
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const formMessage = document.getElementById("form-message");
const formContent = document.getElementById("form-content");
const successPanel = document.getElementById("registration-success");
const touchedFields = new Set();
let submitted = false;

// Return a helpful error message, or an empty string for a valid field.
function getError(field) {
  const value = field.value.trim();

  if (field.id === "confirm-details") {
    return field.checked ? "" : "Please confirm that your details are correct.";
  }
  if (field.required && !value) {
    const messages = {
      "full-name": "Please enter your full name.",
      "student-id": "Please enter your student ID.",
      email: "Please enter your email address.",
      faculty: "Please select your faculty.",
      "study-year": "Please select your year of study.",
      password: "Please create a password.",
      "confirm-password": "Please re-enter your password."
    };
    return messages[field.id] || "Please complete this field.";
  }

  switch (field.id) {
    case "full-name":
      return value.length >= 2 ? "" : "Please enter at least 2 characters.";
    case "student-id":
      return /^[a-zA-Z0-9][a-zA-Z0-9 ._/-]{2,29}$/.test(value)
        ? "" : "Use 3–30 letters, numbers, spaces, dots, hyphens, or slashes.";
    case "email":
      return field.validity.typeMismatch ? "Please enter a valid email address." : "";
    case "phone": {
      if (!value) return "";
      const digits = value.replace(/\D/g, "");
      return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
        ? "" : "Enter a valid phone number with 7–15 digits.";
    }
    case "password":
      return field.value.length >= 8 ? "" : "Use at least 8 characters for your password.";
    case "confirm-password":
      return field.value === password.value ? "" : "Your passwords do not match.";
    default:
      return "";
  }
}

function validateField(field) {
  const error = getError(field);
  document.getElementById(field.id + "-error").textContent = error;
  field.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}

function updatePasswordStrength() {
  const value = password.value;
  let score = 0;
  if (value.length) {
    score = 1;
    if (value.length >= 8) score++;
    if (value.length >= 10 && /[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (value.length >= 12 && /\d/.test(value) && /[^a-zA-Z0-9\s]/.test(value)) score++;
  }
  document.querySelector(".strength-meter").dataset.score = String(score);
  const hints = ["Use at least 8 characters.", "Keep going · use at least 8 characters.", "Good start · a longer password is stronger.", "Good · try adding a number or symbol.", "Strong · keep your password private."];
  document.getElementById("password-hint").textContent = hints[score];
}

fields.forEach(function (field) {
  field.addEventListener("blur", function () {
    touchedFields.add(field.id);
    validateField(field);
  });
  const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
  field.addEventListener(eventName, function () {
    if (submitted || touchedFields.has(field.id)) validateField(field);
    if (field.id === "password") {
      updatePasswordStrength();
      if (submitted || touchedFields.has("confirm-password")) validateField(confirmPassword);
    }
    if (submitted) {
      formMessage.textContent = fields.some(function (item) { return Boolean(getError(item)); })
        ? "Please check the highlighted fields." : "";
    }
  });
});

document.querySelectorAll(".password-toggle").forEach(function (button) {
  button.addEventListener("click", function () {
    const input = document.getElementById(button.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.setAttribute("aria-pressed", String(show));
    const label = input.id === "password" ? "password" : "confirm password";
    button.setAttribute("aria-label", (show ? "Hide " : "Show ") + label);
  });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  submitted = true;
  // Check every field before focusing the first error.
  const invalidFields = fields.filter(function (field) { return !validateField(field); });
  if (invalidFields.length) {
    formMessage.textContent = "Please check the highlighted fields.";
    invalidFields[0].focus();
    return;
  }

  document.getElementById("registered-name").textContent = document.getElementById("full-name").value.trim();
  document.getElementById("registered-id").textContent = document.getElementById("student-id").value.trim();
  // Clear the password fields immediately. Do not store them or send them anywhere.
  password.value = "";
  confirmPassword.value = "";
  formContent.hidden = true;
  successPanel.hidden = false;
  document.getElementById("success-title").focus();
});

document.getElementById("register-another").addEventListener("click", function () {
  form.reset();
  submitted = false;
  touchedFields.clear();
  fields.forEach(function (field) {
    field.removeAttribute("aria-invalid");
    document.getElementById(field.id + "-error").textContent = "";
  });
  document.querySelectorAll(".password-toggle").forEach(function (button) {
    const input = document.getElementById(button.dataset.target);
    input.type = "password";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", input.id === "password" ? "Show password" : "Show confirm password");
  });
  document.getElementById("registered-name").textContent = "";
  document.getElementById("registered-id").textContent = "";
  formMessage.textContent = "";
  updatePasswordStrength();
  successPanel.hidden = true;
  formContent.hidden = false;
  document.getElementById("full-name").focus();
});

// Enable submission only after the JavaScript handler is ready.
// Without JavaScript, the disabled button also prevents implicit Enter submission.
form.querySelector('button[type="submit"]').disabled = false;
