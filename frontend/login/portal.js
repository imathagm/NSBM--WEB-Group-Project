document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    document.querySelectorAll("[data-form-view]").forEach((form) => {
      form.hidden = form.dataset.formView !== view;
    });
    document.querySelectorAll(".view-tab").forEach((tab) => {
      const active = tab.dataset.view === view;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  });
});

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.parentElement.querySelector("input");
    const reveal = input.type === "password";
    input.type = reveal ? "text" : "password";
    button.textContent = reveal ? "Hide" : "Show";
    button.setAttribute("aria-label", `${reveal ? "Hide" : "Show"} password`);
  });
});

document.querySelectorAll('form input[name="confirm_password"]').forEach((confirmation) => {
  confirmation.addEventListener("input", () => {
    const password = confirmation.form.querySelector('input[name="password"]');
    confirmation.setCustomValidity(
      confirmation.value && confirmation.value !== password.value
        ? "The passwords do not match."
        : ""
    );
  });
});
