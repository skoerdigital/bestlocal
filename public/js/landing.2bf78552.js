/* BestLocal v2 — interactions (vanilla, no framework).
   Visible-first: content is painted by default (html has no .anim); this script
   opts into entrance animations only when motion is allowed, and never hides
   content that is already on screen. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- analytics stub ---------- */
  window.blTrack = function (n, p) { try { console.log("[analytics]", n, p || {}); } catch (e) {} };

  /* ---------- scroll reveals ---------- */
  var rvEls = Array.prototype.slice.call(document.querySelectorAll(".rv"));
  function inViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 700;
    return r.top < vh * 0.92 && r.bottom > 0;
  }
  if (!reduced && rvEls.length) {
    // pre-mark everything currently on screen as revealed BEFORE arming the
    // hidden base state — prevents any flash for above-the-fold content.
    rvEls.forEach(function (el) { if (inViewport(el)) el.classList.add("in"); });
    root.classList.add("anim");
    var pending = rvEls.filter(function (el) { return !el.classList.contains("in"); });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
      pending.forEach(function (el) { io.observe(el); });
    } else {
      pending.forEach(function (el) { el.classList.add("in"); });
    }
    // watchdog: if anything is still hidden after 2.5s, force it visible
    setTimeout(function () {
      document.querySelectorAll(".rv:not(.in)").forEach(function (el) {
        if (inViewport(el)) el.classList.add("in");
      });
    }, 2500);
  }

  /* ---------- header shadow on scroll ---------- */
  var header = document.querySelector(".header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq");
      if (!item) return;
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) window.blTrack("faq_open", { q: i + 1 });
    });
  });

  /* ---------- price count-up ---------- */
  function countUp(el, target) {
    if (reduced) { el.textContent = target; return; }
    var dur = 1100, t0 = null;
    setTimeout(function () { el.textContent = target; }, dur + 250);
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = "0";
    requestAnimationFrame(frame);
  }
  var priceNums = Array.prototype.slice.call(document.querySelectorAll(".plan-price")).map(function (pp) {
    var span = pp.querySelector("span:not(.per)");
    if (span && /^\d+$/.test(span.textContent.trim())) return { el: span, to: parseInt(span.textContent, 10) };
    return null;
  }).filter(Boolean);
  if (priceNums.length && "IntersectionObserver" in window && !reduced) {
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var hit = priceNums.filter(function (p) { return p.el === e.target; })[0];
          if (hit) countUp(hit.el, hit.to);
          pio.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    priceNums.forEach(function (p) { pio.observe(p.el); });
  }

  /* ---------- magnetic buttons (pointer devices) ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn-accent, .btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = "translate(" + dx * 6 + "px," + dy * 5 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ===================================================================
     SIGNUP FORMS → Web3Forms. Wklej klucz w index.template.html
     (name="access_key"). Dopóki klucz to YOUR_WEB3FORMS_ACCESS_KEY,
     działa tryb demo (bez wysyłki, od razu strona „dziękujemy").
     =================================================================== */
  var PLACEHOLDER_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function bindForm(form, position) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = form.querySelector(".err");
      var email = form.querySelector("input[type=email]");
      var consent = form.querySelector("input[name=consent]");
      var hp = form.querySelector("input[name=website]");
      var botcheck = form.querySelector("input[name=botcheck]");
      var btn = form.querySelector("button[type=submit]");

      function showError(msg) { if (err) { err.textContent = msg; err.hidden = false; } if (email) email.focus(); }
      if (err) err.hidden = true;
      if ((hp && hp.value) || (botcheck && botcheck.checked)) return; // honeypots

      var v = (email && email.value || "").trim();
      if (!EMAIL_RE.test(v)) return showError("Podaj poprawny adres e-mail — np. anna@twojafirma.pl");
      if (consent && !consent.checked) return showError("Zaznacz zgodę, żebyśmy mogli legalnie do Ciebie napisać.");

      var industry = form.querySelector("select[name=industry]");
      var city = form.querySelector("input[name=city]");
      try {
        localStorage.setItem("bestlocal_signup", JSON.stringify({
          email: v, industry: industry ? industry.value : "", city: city ? city.value.trim() : "",
          consent_at: new Date().toISOString()
        }));
      } catch (e2) {}

      window.blTrack("signup_submitted", { source: position });
      if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.innerHTML = "Zapisujemy…"; }

      var keyField = form.querySelector("input[name=access_key]");
      var key = keyField ? keyField.value : "";
      function done() { window.location.href = "/dziekujemy.html"; }
      function fail(msg) { if (btn) { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; } showError(msg || "Coś poszło nie tak. Spróbuj ponownie."); }

      if (!key || key === PLACEHOLDER_KEY) {
        console.warn("[BestLocal] Web3Forms access_key nie ustawiony — tryb demo.");
        return setTimeout(done, 650);
      }
      fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.success) done(); else fail("Nie udało się zapisać. Sprawdź e-mail i spróbuj ponownie."); })
        .catch(function () { fail("Brak połączenia. Spróbuj ponownie za chwilę."); });
    });
  }
  bindForm(document.getElementById("hero-form"), "hero");
  bindForm(document.getElementById("final-form"), "footer_cta");
})();
