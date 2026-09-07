(function () {
  var VALID_PLANS = { annual: true, pro_weekly: true };

  function apiUrl() {
    var url = window.VG_API_URL;
    if (!url || url.indexOf("__") >= 0) return null;
    return url;
  }

  function getToken() {
    try {
      return localStorage.getItem("vg_auth_token");
    } catch (_) {
      return null;
    }
  }

  function clearToken() {
    try {
      localStorage.removeItem("vg_auth_token");
    } catch (_) {}
  }

  async function apiFetch(path, options) {
    var base = apiUrl();
    var token = getToken();
    if (!base || !token) return null;

    options = options || {};
    var headers = Object.assign({}, options.headers, { Authorization: "Bearer " + token });
    if (options.body) headers["Content-Type"] = "application/json";

    var res = await fetch(base + path, {
      method: options.method || "GET",
      headers: headers,
      body: options.body,
    });
    if (res.status === 401) {
      clearToken();
      return null;
    }
    var payload = await res.json().catch(function () {
      return {};
    });
    return { ok: res.ok, status: res.status, payload: payload };
  }

  function planFromButton(btn) {
    return btn.getAttribute("data-plan") || "annual";
  }

  function publicCheckoutUrl(plan) {
    if (plan === "annual" && window.VG_POLAR_CHECKOUT_LINK_ANNUAL) {
      return window.VG_POLAR_CHECKOUT_LINK_ANNUAL;
    }
    if (plan === "pro_weekly" && window.VG_POLAR_CHECKOUT_LINK_PRO_WEEKLY) {
      return window.VG_POLAR_CHECKOUT_LINK_PRO_WEEKLY;
    }
    return null;
  }

  function showToast(message) {
    var el = document.createElement("div");
    el.className = "vg-checkout-toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.classList.add("is-visible");
    }, 10);
    setTimeout(function () {
      el.classList.remove("is-visible");
      setTimeout(function () {
        el.remove();
      }, 300);
    }, 4500);
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function stripCheckoutParam() {
    var params = new URLSearchParams(window.location.search);
    if (!params.has("checkout")) return;
    params.delete("checkout");
    var query = params.toString();
    var next = window.location.pathname + (query ? "?" + query : "");
    window.history.replaceState({}, "", next);
  }

  async function fetchProfile() {
    var res = await apiFetch("/api/profiles/me");
    if (!res || !res.ok) return null;
    return res.payload;
  }

  async function fetchProfileIsPro() {
    var profile = await fetchProfile();
    return profile && profile.is_pro === true;
  }

  async function pollProfileIsPro(maxAttempts, delayMs) {
    for (var i = 0; i < maxAttempts; i++) {
      if (await fetchProfileIsPro()) return true;
      await delay(delayMs);
    }
    return false;
  }

  async function startCheckout(plan) {
    var token = getToken();

    if (!token) {
      var guestUrl = publicCheckoutUrl(plan);
      if (guestUrl) {
        window.location.href = guestUrl;
        return;
      }
      window.location.href = "/login?redirect=" + encodeURIComponent("/pricing?plan=" + plan);
      return;
    }

    var res = await apiFetch("/api/polar/checkout", {
      method: "POST",
      body: JSON.stringify({ planId: plan }),
    });

    if (!res || !res.ok || !res.payload.checkoutUrl) {
      showToast("Could not start checkout. Try again.");
      return;
    }

    window.location.href = res.payload.checkoutUrl;
  }

  async function openCustomerPortal() {
    if (!getToken()) {
      window.location.href = "/login?redirect=" + encodeURIComponent("/pricing");
      return;
    }

    var res = await apiFetch("/api/polar/portal", { method: "POST", body: "{}" });
    if (!res || !res.ok || !res.payload.portalUrl) {
      showToast("Could not open billing portal. Try again from your profile.");
      return;
    }

    window.open(res.payload.portalUrl, "_blank", "noopener,noreferrer");
  }

  async function updateManageBillingUi() {
    var section = document.getElementById("vg-pricing-manage");
    if (!section) return;

    if (!getToken()) {
      section.hidden = true;
      return;
    }

    var profile = await fetchProfile();
    var isPro = profile && profile.is_pro === true;
    section.hidden = !isPro;

    var balanceEl = document.getElementById("vg-pricing-credits-balance");
    if (balanceEl && isPro) {
      var balance = profile.credits_balance != null ? profile.credits_balance : 0;
      balanceEl.textContent = String(balance);
      balanceEl.hidden = false;
    } else if (balanceEl) {
      balanceEl.hidden = true;
    }
  }

  async function handleCheckoutSuccess() {
    if (!getToken()) {
      window.location.href = "/app/face-beauty-analysis?checkout=success";
      return;
    }

    showToast("Processing your subscription…");
    var ready = await pollProfileIsPro(15, 2000);
    stripCheckoutParam();

    if (ready) {
      showToast("Welcome to Pro! Redirecting to your dashboard…");
      window.location.href = "/app/face-beauty-analysis";
      return;
    }

    showToast("Payment processing — refresh in a moment.");
  }

  function handleCheckoutQueryParams() {
    var params = new URLSearchParams(window.location.search);
    var checkout = params.get("checkout");
    if (checkout === "cancelled") {
      showToast("Checkout cancelled. Choose a plan when you are ready.");
      stripCheckoutParam();
      return;
    }
    if (checkout === "pending") {
      showToast("Payment processing — refresh in a moment.");
      stripCheckoutParam();
      return;
    }
    if (checkout === "success") {
      handleCheckoutSuccess();
    }
  }

  async function maybeResumeCheckout() {
    var params = new URLSearchParams(window.location.search);
    var plan = params.get("plan");
    if (!VALID_PLANS[plan]) return;
    if (params.get("checkout") === "success") return;
    if (params.get("checkout") === "cancelled") return;
    if (params.get("checkout") === "pending") return;

    var resumePlan = null;
    try {
      resumePlan = sessionStorage.getItem("vg_resume_checkout");
    } catch (_) {}

    if (resumePlan !== plan) return;
    if (!getToken()) return;

    try {
      sessionStorage.removeItem("vg_resume_checkout");
    } catch (_) {}

    await startCheckout(plan);
  }

  document.querySelectorAll(".vg-checkout-btn[data-plan]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      startCheckout(planFromButton(btn));
    });
  });

  var manageBtn = document.getElementById("vg-manage-billing-btn");
  if (manageBtn) {
    manageBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openCustomerPortal();
    });
  }

  handleCheckoutQueryParams();
  updateManageBillingUi();
  maybeResumeCheckout();
})();
