/* Progressive enhancement only. The page works fully without this file. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Theme toggle
     --------------------------------------------------------------------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return media.matches ? "dark" : "light";
  }

  function updateToggleLabel() {
    if (!toggle) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    toggle.setAttribute("title", "Switch to " + next + " theme");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable: theme still applies for this page view */
      }
      updateToggleLabel();
    });
    media.addEventListener("change", updateToggleLabel);
    updateToggleLabel();
  }

  /* ---------------------------------------------------------------------
     Highlight the section currently in view in the navigation
     --------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a[href^='#']"));
  var sections = navLinks
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Map();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        var bestId = null;
        var bestRatio = 0;
        sections.forEach(function (section) {
          var ratio = visible.get(section.id) || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        });
        navLinks.forEach(function (a) {
          var active = bestId !== null && a.getAttribute("href") === "#" + bestId;
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ---------------------------------------------------------------------
     Copy BibTeX
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var source = document.getElementById(button.getAttribute("data-copy"));
      if (!source) return;
      var text = source.textContent;
      var original = button.textContent;

      function done(ok) {
        button.textContent = ok ? "Copied" : "Copy failed";
        if (ok) button.setAttribute("data-copied", "");
        setTimeout(function () {
          button.textContent = original;
          button.removeAttribute("data-copied");
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(false); }
        );
      } else {
        /* Fallback: reveal the BibTeX so it can be selected by hand. */
        source.hidden = false;
        done(true);
      }
    });
  });

  /* ---------------------------------------------------------------------
     Contact form: submit in place, fall back to a normal POST on failure
     --------------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status && window.fetch) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      status.removeAttribute("data-state");
      status.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          form.reset();
          status.setAttribute("data-state", "success");
          status.textContent = "Thanks, your message has been sent.";
        })
        .catch(function () {
          status.setAttribute("data-state", "error");
          status.textContent = "Something went wrong. Please email me directly instead.";
        })
        .then(function () {
          button.disabled = false;
        });
    });
  }
})();
