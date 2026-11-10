
// =================================
// NSBM SportsHub - Shared Messages
// =================================

function showMessage(type, message, duration = 4000) {

    let container = document.querySelector(".message-container");

    // Create message container if it doesn't exist
    if (!container) {
        container = document.createElement("div");
        container.className = "message-container";
        document.body.appendChild(container);
    }

    const titles = {
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Information"
    };

    // Create message element
    const messageBox = document.createElement("div");
    messageBox.className = `system-message ${type}`;

    const title = document.createElement("div");
    title.className = "message-title";
    title.textContent = titles[type] || "Notification";

    const content = document.createElement("span");
    content.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "message-close";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close message");

    closeButton.addEventListener("click", () => {
        messageBox.remove();
    });

    messageBox.appendChild(closeButton);
    messageBox.appendChild(title);
    messageBox.appendChild(content);

    container.appendChild(messageBox);

    // Automatically remove message
    if (duration > 0) {
        setTimeout(() => {
            messageBox.remove();

            if (container.children.length === 0) {
                container.remove();
            }
        }, duration);
    }
}


// Reusable message functions

function showSuccess(message) {
    showMessage("success", message);
}

function showError(message) {
    showMessage("error", message);
}

function showWarning(message) {
    showMessage("warning", message);
}

function showInfo(message) {
    showMessage("info", message);
}
