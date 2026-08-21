/**
 * Social Jukebox. App Store click tracking via Vercel Web Analytics.
 * Requires window.va queue (see each page <head>) + /_vercel/insights/script.js
 *
 * Event: app_store_click
 * Data:  page (pathname), placement (data-track-placement or "unknown")
 */
(function () {
  function trackAppStoreClick(anchor) {
    if (typeof window.va !== "function") return;

    var placement =
      (anchor.getAttribute("data-track-placement") || "").trim() || "unknown";
    var page = window.location.pathname || "/";

    window.va("event", {
      name: "app_store_click",
      data: {
        page: page,
        placement: placement,
      },
    });
  }

  document.addEventListener(
    "click",
    function (event) {
      var el = event.target;
      if (!el || !el.closest) return;

      var anchor = el.closest('a[href*="apps.apple.com"]');
      if (!anchor) return;

      trackAppStoreClick(anchor);
    },
    true
  );
})();
