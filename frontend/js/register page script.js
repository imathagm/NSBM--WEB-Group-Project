/* NSBM SportsHub - Club Registration (browser-only assignment demo) */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const message = document.getElementById("registration-message");
  const storageKey = "nsbmSportsHubClubRegistrations";

  // Update the copyright year automatically.
  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  if (!form || !message) return;

  const showMessage = (text, type) => {
    message.textContent = text; // textContent prevents injected HTML.
    message.className = `message ${type}`;
    message.hidden = false;
  };

  const clearMessage = () => {
    message.hidden = true;
    message.textContent = "";
    message.className = "message";
  };

  // Clear previous messages when the student edits the form.
  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity("");
    }
    if (!message.hidden) clearMessage();
  });
  form.addEventListener("change", clearMessage);
  form.addEventListener("reset", clearMessage);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const fullNameInput = document.getElementById("full-name");
    const studentIdInput = document.getElementById("student-id");
    const emailInput = document.getElementById("student-email");

    // Prevent whitespace-only required values.
    for (const input of [fullNameInput, studentIdInput, emailInput]) {
      const trimmed = input.value.trim();
      if (!trimmed) {
        input.setCustomValidity("Please complete this field.");
        input.reportValidity();
        return;
      }
      input.value = trimmed;
    }

    if (!form.reportValidity()) return;

    const registration = {
      fullName: fullNameInput.value,
      studentId: studentIdInput.value,
      email: emailInput.value.toLowerCase(),
      faculty: document.getElementById("faculty").value,
      year: document.getElementById("study-year").value,
      club: document.getElementById("club-select").value,
      experience: document.getElementById("experience").value,
      notes: document.getElementById("notes").value.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      const savedData = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const registrations = Array.isArray(savedData) ? savedData : [];

      // Block accidental duplicate applications for the same club.
      const alreadyRegistered = registrations.some((item) =>
        String(item.studentId || "").toLowerCase() === registration.studentId.toLowerCase() &&
        String(item.club || "").toLowerCase() === registration.club.toLowerCase()
      );

      if (alreadyRegistered) {
        showMessage("This student ID already has a demo registration for the selected club.", "error");
        return;
      }

      registrations.push(registration);
      localStorage.setItem(storageKey, JSON.stringify(registrations));

      // Reset only after data has been saved successfully.
      form.reset();
      showMessage(
        `Registration saved! Your demo application for ${registration.club} is stored in this browser only.`,
        "success"
      );
    } catch (error) {
      // Private browsing, storage restrictions, or full storage can block saving.
      console.error("Could not save club registration:", error);
      showMessage("Unable to save the registration in this browser. Check your storage settings and try again.", "error");
    }
  });
});
