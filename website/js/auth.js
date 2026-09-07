(function () {
  var form = document.getElementById("vg-auth-form");
  if (!form) return;

  var errorEl = document.getElementById("vg-auth-error");
  var googleBtn = document.getElementById("vg-google-btn");
  var mode = form.getAttribute("data-mode") || "login";
  var params = new URLSearchParams(window.location.search);
  var plan = params.get("plan");
  var hasCheckoutPlan = plan === "annual" || plan === "pro_weekly";
  var redirect = params.get("redirect") || "/app/face-beauty-analysis";

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  }

  function apiUrl() {
    var url = window.VG_API_URL;
    if (!url || url.indexOf("__") >= 0) {
      throw new Error("Auth is not configured on this build.");
    }
    return url;
  }

  function saveToken(token) {
    try {
      localStorage.setItem("vg_auth_token", token);
    } catch (_) {}
  }

  function postAuthDestination() {
    if (hasCheckoutPlan) {
      return "/pricing?plan=" + encodeURIComponent(plan);
    }
    return redirect;
  }

  function goAfterAuth(payload) {
    var dest = postAuthDestination();
    if (hasCheckoutPlan) {
      try {
        sessionStorage.setItem("vg_resume_checkout", plan);
      } catch (_) {}
    }

    // This static page and the Flutter app (/app/*) are separate bundles
    // with no shared storage — a token saved to this page's localStorage
    // is invisible to Flutter's own session storage. Hand the session off
    // via URL params instead; main_web.dart picks these up on boot and
    // establishes the real Flutter-side session, then strips them from
    // the address bar. Static destinations (e.g. /pricing) don't need
    // this — checkout.js already reads the same localStorage this page writes.
    if (dest.indexOf("/app/") === 0 && payload && payload.user) {
      var sep = dest.indexOf("?") >= 0 ? "&" : "?";
      dest +=
        sep +
        "vg_token=" + encodeURIComponent(payload.token) +
        "&vg_uid=" + encodeURIComponent(payload.user.id) +
        "&vg_email=" + encodeURIComponent(payload.user.email || "");
    }

    window.location.href = dest;
  }

  async function submitEmailAuth(path, email, password) {
    var res = await fetch(apiUrl() + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password, name: email.split("@")[0] }),
    });
    var payload = await res.json().catch(function () {
      return {};
    });
    if (!res.ok) {
      throw new Error(payload.message || payload.error || "Sign in failed.");
    }
    return payload;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showError("");
    var email = form.email.value.trim();
    var password = form.password.value;
    var submit = form.querySelector(".auth-submit");
    if (submit) submit.disabled = true;

    var path = mode === "login" ? "/api/auth/sign-in/email" : "/api/auth/sign-up/email";

    submitEmailAuth(path, email, password)
      .then(function (payload) {
        if (!payload.token) {
          throw new Error("Sign in did not return a session.");
        }
        saveToken(payload.token);
        goAfterAuth(payload);
      })
      .catch(function (err) {
        showError(err.message || "Sign in failed.");
      })
      .finally(function () {
        if (submit) submit.disabled = false;
      });
  });

  if (googleBtn) {
    googleBtn.addEventListener("click", function () {
      showError("");
      showError("Google sign-in on the website isn't available yet — please use email and password.");
    });
  }
})();
