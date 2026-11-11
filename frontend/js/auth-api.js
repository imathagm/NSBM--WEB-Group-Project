(function () {
  var scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) {
    throw new Error("The SportsHub authentication client must be loaded from a script element.");
  }

  var endpointBase = new URL("../../backend/api/auth/", scriptUrl);
  var csrfToken = "";

  async function parseResponse(response) {
    var payload;
    try {
      payload = await response.json();
    } catch (error) {
      throw new Error("The account service returned an invalid response.");
    }

    if (!response.ok || payload.success !== true) {
      throw new Error(payload.message || "The account request could not be completed.");
    }

    if (typeof payload.csrfToken === "string") {
      csrfToken = payload.csrfToken;
    }
    return payload;
  }

  async function getSession() {
    var response = await fetch(new URL("session.php", endpointBase), {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    return parseResponse(response);
  }

  async function post(action, payload) {
    if (!csrfToken) await getSession();

    var response = await fetch(new URL(action + ".php", endpointBase), {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify(payload || {})
    });
    return parseResponse(response);
  }

  window.sportshubAuth = {
    session: getSession,
    post: post
  };
})();
