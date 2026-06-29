/* =========================================================
   Pioneer Home Health Services — Site interactivity + app layer
   ========================================================= */
(function () {
  "use strict";

  var ROOT = (function () {
    // Path prefix back to site root (handles /compliance/ subfolder)
    return location.pathname.indexOf("/compliance/") !== -1 ? "../" : "";
  })();

  /* ---------- PWA: manifest link + service worker ---------- */
  (function pwa() {
    if (!document.querySelector('link[rel="manifest"]')) {
      var l = document.createElement("link");
      l.rel = "manifest"; l.href = ROOT + "manifest.webmanifest";
      document.head.appendChild(l);
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register(ROOT + "service-worker.js").catch(function () {});
      });
    }
  })();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
  }

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a[href]").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("is-active");
  });

  /* ---------- Scroll progress bar ---------- */
  (function () {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  })();

  /* ---------- Back to top + floating call button ---------- */
  (function () {
    var fab = document.createElement("div");
    fab.className = "fab-stack";
    fab.innerHTML =
      '<a class="fab fab--call" href="tel:+18184855303" aria-label="Call Pioneer Home Health Services">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
        '<span>Call us</span></a>' +
      '<button class="fab fab--top" aria-label="Back to top" hidden>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>';
    document.body.appendChild(fab);
    var topBtn = fab.querySelector(".fab--top");
    topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    window.addEventListener("scroll", function () {
      topBtn.hidden = window.scrollY < 600;
    }, { passive: true });
  })();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq__q").forEach(function (btn, i) {
    var item = btn.closest(".faq__item");
    var ans = item.querySelector(".faq__a");
    if (ans && !ans.id) { ans.id = "faq-panel-" + (i + 1); }
    if (ans) { btn.setAttribute("aria-controls", ans.id); ans.setAttribute("role", "region"); }
    var chev = btn.querySelector(".chev");
    if (chev) chev.setAttribute("aria-hidden", "true");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      ans.style.maxHeight = isOpen ? ans.scrollHeight + "px" : null;
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  (function () {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "", dur = 1100, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var val = Math.floor(p * target);
          el.textContent = val + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Referral pre-fill from Eligibility checker ---------- */
  (function () {
    if (!/referral\.html$/.test(location.pathname)) return;
    if (!location.search) return;
    var q = new URLSearchParams(location.search);
    function setSelect(id, want) {
      var sel = document.getElementById(id);
      if (!sel || !want) return;
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.toLowerCase().indexOf(want.toLowerCase()) !== -1) { sel.selectedIndex = i; break; }
      }
    }
    var roleMap = { patient: "Patient", family: "Family member", provider: "Physician" };
    setSelect("role", roleMap[q.get("role")]);
    var covMap = { "Medicare": "Medicare", "Medi-Cal": "Medi-Cal", "Private insurance": "Private insurance", "Self-pay": "Self-pay" };
    setSelect("insurance", covMap[q.get("coverage")]);
    var need = q.get("need") || "";
    var svcMap = { "Skilled nursing": "Skilled Nursing", "Therapy": "Physical Therapy", "Personal care / aide": "Home Health Aide" };
    if (svcMap[need]) {
      var box = document.querySelector('input[name="services"][value="' + svcMap[need] + '"]');
      if (box) box.checked = true;
    }
  })();

  /* =======================================================
     FORMS — validation + real submission to Supabase
     ======================================================= */
  var _errId = 0;
  function showErr(field, input, on) {
    field.classList.toggle("field--error", on);
    if (!input) return;
    input.setAttribute("aria-invalid", on ? "true" : "false");
    var span = field.querySelector(".field__err");
    if (span) {
      if (!span.id) span.id = "err-" + (++_errId);
      span.setAttribute("role", "alert");
      if (on) input.setAttribute("aria-describedby", span.id);
      else input.removeAttribute("aria-describedby");
    }
  }

  function validateForm(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field, .checkbox");
      var val = (input.value || "").trim();
      var bad = false;
      if (input.type === "checkbox") bad = !input.checked;
      else if (input.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      else if (input.type === "tel") bad = val.replace(/\D/g, "").length < 10;
      else bad = val === "";
      if (field) showErr(field, input, bad);
      if (bad) ok = false;
    });
    return ok;
  }

  function serialize(form) {
    var data = {}, services = [];
    form.querySelectorAll("[name]").forEach(function (el) {
      var n = el.name;
      if (el.type === "checkbox") {
        if (n === "services") { if (el.checked) services.push(el.value); }
        else { data[n] = el.checked; }
      } else {
        var v = (el.value || "").trim();
        data[n] = v === "" ? null : v;
      }
    });
    if (form.querySelector('[name="services"]')) data.services = services;
    return data;
  }

  function submitToSupabase(table, payload) {
    var cfg = window.PIONEER_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) return Promise.reject(new Error("not_configured"));
    return fetch(cfg.SUPABASE_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": cfg.SUPABASE_KEY,
        "Authorization": "Bearer " + cfg.SUPABASE_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error(t || ("HTTP " + res.status)); });
      return true;
    });
  }

  // Email delivery via FormSubmit AJAX (no backend, returns JSON → no popup/redirect).
  function submitEmail(form, payload) {
    var cfg = window.PIONEER_CONFIG || {};
    if (!cfg.NOTIFY_EMAIL) return Promise.reject(new Error("no_email"));
    var kind = form.getAttribute("data-kind") || "Website";
    var fields = {
      _subject: "New " + kind + " — Pioneer Home Health website",
      _template: "table",
      _captcha: "false"
    };
    Object.keys(payload).forEach(function (k) {
      if (k === "hp") return;
      var v = payload[k];
      if (Array.isArray(v)) v = v.join(", ");
      if (v === true) v = "Yes"; else if (v === false) v = "No";
      fields[k] = (v === null || v === undefined || v === "") ? "—" : v;
    });
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(cfg.NOTIFY_EMAIL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(fields)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return true;
    });
  }

  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var table = form.getAttribute("data-table");

    // Inject a honeypot field (spam trap) if not present
    if (table && !form.querySelector('[name="hp"]')) {
      var hp = document.createElement("div");
      hp.setAttribute("aria-hidden", "true");
      hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
      hp.innerHTML = '<label>Leave this field empty<input type="text" name="hp" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(hp);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) status.className = "form-status";

      if (!validateForm(form)) {
        if (status) {
          status.className = "form-status show form-status--err";
          status.textContent = "Please complete the highlighted fields before submitting.";
        }
        var firstErr = form.querySelector(".field--error input, .field--error select, .field--error textarea");
        if (firstErr) firstErr.focus();
        return;
      }

      var btn = form.querySelector("[type=submit]");
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      var payload = serialize(form);

      var done = function (okMsg) {
        form.reset();
        form.querySelectorAll(".field--error").forEach(function (f) { f.classList.remove("field--error"); });
        if (btn) { btn.disabled = false; btn.textContent = label; }
        if (status) {
          status.className = "form-status show form-status--ok";
          status.innerHTML = okMsg;
          status.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
      var fail = function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        if (status) {
          status.className = "form-status show form-status--err";
          status.innerHTML = 'We couldn’t submit your request just now. Please call us at ' +
            '<a href="tel:+18184855303">(818) 485-5303</a> or email ' +
            '<a href="mailto:pioneerhomehealthservices@gmail.com">pioneerhomehealthservices@gmail.com</a>.';
          status.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };

      var successMsg = form.dataset.success ||
        "Thank you — your request has been received. A Pioneer care coordinator will contact you within one business day.";

      // Spam honeypot: a real user never fills the hidden "hp" field. Silently "succeed" without sending.
      if (payload.hp) { done(successMsg); return; }

      // Store in Supabase (best effort) AND email the office. Success if either delivers.
      var storePromise = table ? submitToSupabase(table, payload).catch(function () { return false; })
                                : Promise.resolve(false);
      var emailPromise = submitEmail(form, payload).then(function () { return true; })
                                .catch(function () { return false; });

      Promise.all([emailPromise, storePromise]).then(function (r) {
        if (r[0] || r[1]) done(successMsg); else fail();
      });
    });

    form.querySelectorAll("input,select,textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field, .checkbox");
        if (field) field.classList.remove("field--error");
        input.setAttribute("aria-invalid", "false");
        input.removeAttribute("aria-describedby");
      });
    });
  });
})();
