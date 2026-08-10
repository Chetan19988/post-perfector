/**
 * Chetan Crane Service — Main Application JavaScript
 * Premium interactions: scroll reveal, animated counters, sticky header,
 * mobile menu, reserve modal, FAQ accordion, floating WhatsApp + back-to-top.
 */
(function () {
  "use strict";

  // Flag JS availability synchronously so CSS can safely gate reveal animations
  // (without this, html.js .reveal never applies and scroll reveals stay inert).
  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initMobileNav();
    initModal();
    initFaq();
    initReveal();
    initCounters();
    initMarquee();
    initBackToTop();
    initFloatingWhatsApp();
    setMinDates();
  });

  /* ---------- Sticky header (shrink + shadow on scroll) ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = document.getElementById("mobileToggle");
    var menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      menu.classList.toggle("active");
      toggle.setAttribute("aria-expanded", menu.classList.contains("active"));
    });

    // Close menu when a link is tapped
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (
        menu.classList.contains("active") &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        menu.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("active")) {
        menu.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reserve modal ---------- */
  function initModal() {
    var overlay = document.getElementById("reserveModal");
    if (!overlay) return;

    var closeBtn = document.getElementById("modalCloseBtn");
    var cancelBtn = document.getElementById("modalCancelBtn");
    var tonSelect = document.getElementById("tonSelect");
    var form = document.getElementById("reserveForm");

    // Global open function used by inline onclick handlers
    window.openReserveModal = function (tonValue) {
      if (tonSelect && tonValue) {
        var matched = false;
        for (var i = 0; i < tonSelect.options.length; i++) {
          if (tonSelect.options[i].value.indexOf(tonValue) !== -1) {
            tonSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) tonSelect.value = tonValue;
      }
      openModal();
    };

    function openModal() {
      overlay.classList.add("open", "active");
      document.body.style.overflow = "hidden";
      var firstInput = overlay.querySelector("input, select, textarea");
      if (firstInput) firstInput.focus({ preventScroll: true });
    }

    function closeModal() {
      overlay.classList.remove("open", "active");
      document.body.style.overflow = "";
    }
    window.closeReserveModal = closeModal;

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });

    // WhatsApp form submission — bilingual message based on page language
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ton = tonSelect ? tonSelect.value : "Forklift";
        var start = document.getElementById("startDate")?.value || "";
        var end = document.getElementById("endDate")?.value || "";
        var phoneInput = document.getElementById("userPhone");
        var phone = phoneInput && phoneInput.value.trim()
          ? phoneInput.value.trim()
          : "Not provided";

        var isHindi = window.location.pathname.indexOf("/hi/") === 0;
        var message = isHindi
          ? "*फोर्कलिफ्ट रिज़र्व – चेतन क्रेन सर्विस*\n" +
            "फोर्कलिफ्ट: " + ton + "\n" +
            "शुरुआत: " + start + "\n" +
            "समाप्ति: " + end + "\n" +
            "फ़ोन: " + phone + "\n" +
            "---\nकृपया उपलब्धता कन्फर्म करें।"
          : "*Forklift Reserve – Chetan Crane Service*\n" +
            "Forklift: " + ton + "\n" +
            "Start: " + start + "\n" +
            "End: " + end + "\n" +
            "Phone: " + phone + "\n" +
            "---\nPlease confirm availability.";

        window.open(
          "https://wa.me/917982773422?text=" + encodeURIComponent(message),
          "_blank"
        );
        closeModal();
      });
    }
  }

  /* ---------- FAQ accordion (chevron rotation handled in CSS via .active) ---------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector(".faq-question");
      if (!question) return;
      question.setAttribute("aria-expanded", "false");
      question.addEventListener("click", function () {
        var isOpen = item.classList.contains("active");
        // Close all, then toggle clicked item
        items.forEach(function (i) {
          i.classList.remove("active");
          var q = i.querySelector(".faq-question");
          if (q) q.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("active");
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      observer.observe(el);
    });
  }

  /* ---------- Animated counters (static HTML holds final values so no-JS is safe) ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      // Start from zero; final value already sits in the markup as fallback
      el.textContent = "0" + suffix;
      if (reduceMotion || target <= 0) {
        el.textContent = Math.round(target).toLocaleString("en-IN") + suffix;
        return;
      }
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // easeOutExpo
        var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target).toLocaleString("en-IN") + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Coverage marquee (duplicate track so the -50% loop is seamless) ---------- */
  function initMarquee() {
    var track = document.getElementById("marqueeTrack");
    if (!track || !track.children.length) return;
    // Clone every item once so translateX(-50%) lands on an identical copy
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".to-top");
    if (!btn) return;
    var onScroll = function () {
      btn.classList.toggle("visible", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  /* ---------- Floating WhatsApp (desktop) ---------- */
  function initFloatingWhatsApp() {
    // Only add when the fixed mobile action bar is hidden (>=769px)
    if (window.matchMedia("(min-width: 769px)").matches && !document.querySelector(".wa-float")) {
      var link = document.createElement("a");
      link.className = "wa-float";
      link.href = "https://wa.me/917982773422?text=" +
        encodeURIComponent("Hello Chetan Crane Service, I need a forklift rental quote.");
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", "Chat on WhatsApp");
      link.innerHTML =
        '<svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>';
      document.body.appendChild(link);
    }
  }

  /* ---------- Default date values (local time, not UTC) ---------- */
  function setMinDates() {
    var start = document.getElementById("startDate");
    var end = document.getElementById("endDate");
    if (!start || !end) return;
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var fmt = function (d) {
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var day = String(d.getDate()).padStart(2, "0");
      return d.getFullYear() + "-" + m + "-" + day;
    };
    start.min = fmt(today);
    end.min = fmt(today);
    if (!start.value) start.value = fmt(today);
    if (!end.value) end.value = fmt(tomorrow);
  }
})();
