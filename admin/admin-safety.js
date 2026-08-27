/* ============================================================
   ADMIN-SAFETY.JS
   Include this on every /admin/ page, before other scripts.
   Purpose: an uncaught error or unhandled promise rejection
   must NEVER leave the person looking at a blank white page.
   This shows a small, dismissible banner with a reload option
   instead, and always logs the real error to the console.
   ============================================================ */
(function () {
  "use strict";

  var bannerShown = false;

  function showBanner(message) {
    if (bannerShown) return;
    bannerShown = true;

    var bar = document.createElement("div");
    bar.setAttribute("role", "alert");
    bar.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:99999;" +
      "background:#dc2626;color:#fff;padding:14px 18px;" +
      "font:600 14px/1.4 Arial, sans-serif;" +
      "display:flex;align-items:center;justify-content:space-between;gap:16px;" +
      "box-shadow:0 4px 14px rgba(0,0,0,.25);";

    var text = document.createElement("span");
    text.textContent = message || "Something went wrong loading this page. Please try again.";

    var actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;flex-shrink:0;";

    var reloadBtn = document.createElement("button");
    reloadBtn.textContent = "Reload";
    reloadBtn.style.cssText =
      "background:#fff;color:#111827;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:700;";
    reloadBtn.onclick = function () {
      window.location.reload();
    };

    var dismissBtn = document.createElement("button");
    dismissBtn.textContent = "Dismiss";
    dismissBtn.style.cssText =
      "background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5);padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;";
    dismissBtn.onclick = function () {
      bar.remove();
      bannerShown = false;
    };

    actions.appendChild(reloadBtn);
    actions.appendChild(dismissBtn);
    bar.appendChild(text);
    bar.appendChild(actions);
    document.body.appendChild(bar);
  }

  window.addEventListener("error", function (e) {
    console.error("Uncaught error:", e.error || e.message, e);
    showBanner("Something went wrong. Your data is safe — try reloading the page.");
  });

  window.addEventListener("unhandledrejection", function (e) {
    console.error("Unhandled promise rejection:", e.reason);
    showBanner("A background request failed. Try reloading the page.");
  });

  // Expose a manual trigger other admin scripts can call from their own
  // catch blocks if they want the same banner treatment.
  window.adminShowErrorBanner = showBanner;
})();
