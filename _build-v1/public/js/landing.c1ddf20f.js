/* BestLocal — interactions & micro-animations
   Resilience rule: visible is the base state. This script adds html.js-anim
   to opt INTO entrance animations, then guarantees release via rect-check
   reveals + watchdog timeouts (no IntersectionObserver dependency). */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function motionOff() {
    return reduced || root.classList.contains("no-motion") || root.classList.contains("anim-frozen");
  }

  /* Opt INTO entrance animations. Base state (no class) is fully visible, so
     any context that ignores this script still shows everything. */
  if (!reduced) {
    root.classList.add("js-anim");
    setTimeout(function () { root.classList.add("words-done"); }, 1700);

    /* Frozen-timeline guard: detect contexts that pause the animation timeline
       and fall back to the fully-visible state. */
    (function frozenGuard() {
      var p = document.createElement("div");
      p.style.cssText = "position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;transition:opacity .05s linear";
      document.body.appendChild(p);
      void p.offsetWidth;
      p.style.opacity = "1";
      setTimeout(function () {
        var op = parseFloat(getComputedStyle(p).opacity) || 0;
        p.remove();
        if (op < 0.5) root.classList.add("anim-frozen");
      }, 220);
    })();
  }

  /* ---------- tiny analytics stub (swap for your tracker) ---------- */
  window.blTrack = function (name, props) {
    try { console.log("[analytics]", name, props || {}); } catch (e) {}
  };

  /* ---------- nav ---------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- scroll reveals (rect-check, no IO) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var countEls = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var pricingEl = document.getElementById("cennik");
  var pricingSeen = false;
  var revealsArmed = false;

  function armReveals() {
    if (revealsArmed) return;
    revealsArmed = true;
    visibleCheck();
  }

  function visibleCheck() {
    if (!revealsArmed) return;
    var vh = window.innerHeight || 700;
    revealEls = revealEls.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > -20) { el.classList.add("in"); return false; }
      return true;
    });
    countEls = countEls.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) { countUp(el); return false; }
      return true;
    });
    if (pricingEl && !pricingSeen) {
      var pr = pricingEl.getBoundingClientRect();
      if (pr.top < vh * 0.7 && pr.bottom > 0) {
        pricingSeen = true;
        window.blTrack("scroll_pricing", {});
      }
    }
  }
  var scrollTick = false;
  window.addEventListener("scroll", function () {
    if (scrollTick) return;
    scrollTick = true;
    setTimeout(function () { scrollTick = false; visibleCheck(); }, 80);
  }, { passive: true });
  window.addEventListener("resize", visibleCheck);
  armReveals();
  var vcTimer = setInterval(function () {
    visibleCheck();
    if (revealsArmed && !revealEls.length && !countEls.length && pricingSeen) clearInterval(vcTimer);
  }, 600);

  /* ---------- hero parallax ---------- */
  var heroPhoto = document.querySelector(".hero-photo img");
  var floatCards = document.querySelectorAll(".float-card");
  function parallax() {
    if (motionOff()) return;
    var y = window.scrollY;
    if (y > 900) return;
    if (heroPhoto) heroPhoto.style.transform = "scale(1.06) translateY(" + y * 0.06 + "px)";
    floatCards.forEach(function (c, i) {
      c.style.translate = "0 " + y * (i ? -0.05 : -0.09) + "px";
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(parallax); }, { passive: true });

  /* ---------- hero "Akceptuję" micro-interaction ---------- */
  var acc = document.querySelector(".fc-accept");
  if (acc) {
    acc.addEventListener("click", function () {
      if (acc.classList.contains("done")) return;
      acc.classList.add("done");
      acc.innerHTML = "Opublikowano <span aria-hidden=\"true\">✓</span>";
      window.blTrack("cta_click", { position: "hero_demo_accept" });
      setTimeout(function () {
        acc.classList.remove("done");
        acc.innerHTML = "Akceptuję";
      }, 2600);
    });
  }

  /* ---------- count-up stats (base state in HTML = final value) ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (motionOff() || !root.classList.contains("js-anim")) {
      el.textContent = target;
      return;
    }
    var dur = 1400;
    var t0 = null;
    setTimeout(function () { el.textContent = target; }, dur + 250);
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = "0";
    requestAnimationFrame(frame);
  }

  /* ---------- feature tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".feature-tab"));
  var mocks = Array.prototype.slice.call(document.querySelectorAll(".mock"));
  var fSection = document.querySelector(".features-section");
  var rotateTimer = null;
  var current = 0;

  function activate(i, fromUser) {
    current = i;
    tabs.forEach(function (t, j) {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      var bar = t.querySelector(".ft-progress i");
      if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    });
    mocks.forEach(function (m, j) {
      m.classList.toggle("active", j === i);
      m.setAttribute("aria-hidden", j === i ? "false" : "true");
    });
    if (fromUser) {
      window.blTrack("feature_tab", { index: i });
      restartRotate();
    }
  }
  function featuresInView() {
    if (!fSection) return false;
    var r = fSection.getBoundingClientRect();
    var vh = window.innerHeight || 700;
    return r.top < vh * 0.85 && r.bottom > vh * 0.15;
  }
  function restartRotate() {
    clearInterval(rotateTimer);
    if (motionOff()) return;
    rotateTimer = setInterval(function () {
      if (!featuresInView() || document.hidden) return;
      activate((current + 1) % tabs.length, false);
    }, 9000);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { activate(i, true); });
    /* keyboard: left/right arrows move between tabs */
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); var n = (i + 1) % tabs.length; tabs[n].focus(); activate(n, true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); var p = (i - 1 + tabs.length) % tabs.length; tabs[p].focus(); activate(p, true); }
    });
  });
  if (tabs.length) {
    activate(0, false);
    restartRotate();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item, i) {
    var btn = item.querySelector(".faq-q");
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) window.blTrack("faq_open", { q: i + 1 });
    });
  });

  /* ---------- magnetic buttons ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn-accent, .btn-dark").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        if (motionOff()) return;
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = "translate(" + dx * 7 + "px," + dy * 6 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ===================================================================
     SIGNUP FORMS → Web3Forms (https://web3forms.com)
     Wklej swój klucz w atrybut value pola name="access_key" w index.html.
     Dopóki klucz to 1c98fbc6-fa65-49b6-bacc-823763d4fef1, działa tryb demo
     (bez wysyłki sieciowej, od razu strona „dziękujemy”).
     =================================================================== */
  var PLACEHOLDER_KEY = "1c98fbc6-fa65-49b6-bacc-823763d4fef1";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function bindForm(form, position) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = form.querySelector(".form-error");
      var email = form.querySelector("input[type=email]");
      var consent = form.querySelector("input[name=consent]");
      var hp = form.querySelector("input[name=website]");
      var botcheck = form.querySelector("input[name=botcheck]");
      var btn = form.querySelector("button[type=submit]");

      function showError(msg) {
        if (err) { err.textContent = msg; err.classList.add("show"); }
        if (email) email.focus();
      }
      if (err) err.classList.remove("show");

      /* honeypots — silently drop bots */
      if ((hp && hp.value) || (botcheck && botcheck.checked)) return;

      var v = (email && email.value || "").trim();
      if (!EMAIL_RE.test(v)) {
        return showError("Podaj poprawny adres e-mail — np. anna@twojafirma.pl");
      }
      if (consent && !consent.checked) {
        return showError("Zaznacz zgodę, żebyśmy mogli do Ciebie napisać.");
      }

      /* keep a local copy so the thank-you page can personalize */
      var industry = form.querySelector("select[name=industry]");
      var city = form.querySelector("input[name=city]");
      try {
        localStorage.setItem("bestlocal_signup", JSON.stringify({
          email: v,
          industry: industry ? industry.value : "",
          city: city ? city.value.trim() : "",
          consent_at: new Date().toISOString()
        }));
      } catch (e2) {}

      window.blTrack("signup_submitted", { source: position });
      if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.innerHTML = "Zapisujemy…"; }

      var keyField = form.querySelector("input[name=access_key]");
      var key = keyField ? keyField.value : "";

      function done() { window.location.href = "/dziekujemy.html"; }
      function fail(msg) {
        if (btn) { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
        showError(msg || "Coś poszło nie tak. Spróbuj ponownie za chwilę.");
      }

      /* demo mode until a real key is set */
      if (!key || key === PLACEHOLDER_KEY) {
        console.warn("[BestLocal] Web3Forms access_key nie jest ustawiony — tryb demo (brak realnej wysyłki).");
        return setTimeout(done, 650);
      }

      var data = new FormData(form);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      }).then(function (r) { return r.json(); })
        .then(function (json) {
          if (json && json.success) { done(); }
          else { fail("Nie udało się zapisać. Sprawdź adres e-mail i spróbuj ponownie."); }
        })
        .catch(function () { fail("Brak połączenia. Spróbuj ponownie za chwilę."); });
    });
  }
  bindForm(document.getElementById("hero-form"), "hero");
  bindForm(document.getElementById("cta-form"), "footer_cta");

  /* hero optional fields disclosure */
  document.querySelectorAll("[data-toggle-extra]").forEach(function (t) {
    t.addEventListener("click", function () {
      var target = document.getElementById(t.getAttribute("data-toggle-extra"));
      if (target) {
        target.hidden = !target.hidden;
        t.textContent = target.hidden ? "+ branża i miasto (opcjonalnie)" : "− ukryj dodatkowe pola";
      }
    });
  });
})();
