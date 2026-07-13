/* ==========================================================================
   MD JABED IQBAL NAQUIB — Portfolio interactions
   Vanilla JS, modular, no build step required.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------- Footer year ----------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------- Loader -------------------------------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    const line = $("#loaderLine");
    const messages = ["compiling modules...", "bundling assets...", "optimizing images...", "ready ✓"];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (line && messages[i]) line.textContent = messages[i];
      if (i >= messages.length - 1) clearInterval(interval);
    }, 350);
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
    }, 1500);
  });
  // Safety: never block the page longer than 3s even if load event is slow
  setTimeout(() => { const l = $("#loader"); if (l) l.classList.add("hidden"); }, 3000);

  /* ------------------------------ Custom cursor ---------------------------- */
  const cursorDot = $("#cursorDot");
  const cursorRing = $("#cursorRing");
  if (cursorDot && cursorRing && matchMedia("(hover: hover)").matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + "px";
      cursorDot.style.top = my + "px";
    });
    (function raf() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + "px";
      cursorRing.style.top = ry + "px";
      requestAnimationFrame(raf);
    })();
    $$("a, button, .project-card, .service-card, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  }

  /* -------------------------------- Ripple --------------------------------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* -------------------------------- Theme ---------------------------------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");
  const savedTheme = (() => {
    try { return localStorage.getItem("jabed-theme"); } catch (e) { return null; }
  })();
  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (themeIcon) themeIcon.className = "fa-solid fa-sun";
    } else {
      root.removeAttribute("data-theme");
      if (themeIcon) themeIcon.className = "fa-solid fa-moon";
    }
  }
  applyTheme(savedTheme === "light" ? "light" : "dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      applyTheme(isLight ? "dark" : "light");
      try { localStorage.setItem("jabed-theme", isLight ? "dark" : "light"); } catch (e) {}
    });
  }

  /* ------------------------------ Mobile nav -------------------------------- */
  const burger = $("#navBurger");
  const drawer = $("#mobileDrawer");
  if (burger && drawer) {
    burger.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.classList.toggle("open", open);
    });
    $$("#mobileDrawer a").forEach((a) => a.addEventListener("click", () => {
      drawer.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  /* --------------------------- Scrollspy for nav tabs ------------------------ */
  const navLinks = $$(".nav-tabs a");
  const sections = navLinks.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  function onScrollSpy() {
    const y = window.scrollY + 120;
    let currentId = sections[0] && sections[0].id;
    sections.forEach((sec) => { if (sec.offsetTop <= y) currentId = sec.id; });
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + currentId));
  }
  window.addEventListener("scroll", onScrollSpy, { passive: true });
  onScrollSpy();

  /* Navbar background intensifies on scroll + back-to-top visibility */
  const backToTop = $("#backToTop");
  window.addEventListener("scroll", () => {
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 480);
  }, { passive: true });
  if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* -------------------------------- AOS init -------------------------------- */
  if (window.AOS) {
    AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60, disable: reduceMotion });
  }
  // Fallback reveal (in case AOS CDN fails) using IntersectionObserver on [data-reveal]
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach((el) => io.observe(el));
  } else {
    $$("[data-reveal]").forEach((el) => el.classList.add("revealed"));
  }

  /* ------------------------------ Typing effect ------------------------------ */
  const typedTarget = $("#typedRole");
  if (typedTarget) {
    if (window.Typed && !reduceMotion) {
      new Typed("#typedRole", {
        strings: ["Full Stack Web Developer", "MERN Stack Developer", "Frontend Developer", "Backend Developer", "Problem Solver"],
        typeSpeed: 46,
        backSpeed: 28,
        backDelay: 1400,
        loop: true,
        smartBackspace: true,
      });
    } else {
      typedTarget.textContent = "Full Stack Web Developer";
    }
  }

  /* ------------------------------ Particles (hero) ---------------------------- */
  if (window.particlesJS && !reduceMotion && $("#particles-hero")) {
    try {
      particlesJS("particles-hero", {
        particles: {
          number: { value: 34, density: { enable: true, value_area: 900 } },
          color: { value: "#F5A524" },
          shape: { type: "circle" },
          opacity: { value: 0.25, random: true },
          size: { value: 2.4, random: true },
          line_linked: { enable: true, distance: 140, color: "#F5A524", opacity: 0.12, width: 1 },
          move: { enable: true, speed: 0.7, out_mode: "out" },
        },
        interactivity: {
          events: { onhover: { enable: true, mode: "grab" }, resize: true },
          modes: { grab: { distance: 130, line_linked: { opacity: 0.3 } } },
        },
        retina_detect: true,
      });
    } catch (e) { /* particles.js optional — fail silently */ }
  }

  /* ------------------------------ Skills tabs -------------------------------- */
  const skillTabs = $$(".skills-tab");
  const skillPanels = $$(".skills-panel");
  function fillBars(panel) {
    $$(".skill-fill", panel).forEach((bar) => {
      const pct = bar.getAttribute("data-fill");
      requestAnimationFrame(() => { bar.style.width = pct + "%"; });
    });
  }
  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      skillPanels.forEach((p) => {
        const active = p.id === target;
        p.classList.toggle("active", active);
        if (active) fillBars(p);
      });
    });
  });
  // Animate bars when scrolled into view (first panel + education progress)
  if ("IntersectionObserver" in window) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBars(entry.target);
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    $$(".skills-panel.active, .edu-progress").forEach((el) => barIO.observe(el));
  }

  /* ------------------------------ Project filter ------------------------------ */
  const filterBtns = $$(".filter-btn");
  const projectCards = $$(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const tags = card.getAttribute("data-tags") || "";
        const show = filter === "all" || tags.includes(filter);
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ------------------------------ Animated counters ---------------------------- */
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    const plusSpan = el.querySelector(".plus");
    const suffix = plusSpan ? plusSpan.outerHTML : "";
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * target);
      el.innerHTML = val + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.innerHTML = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); countIO.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    $$("[data-count]").forEach((el) => countIO.observe(el));
  }

  /* ------------------------------ Timeline in-view -------------------------- */
  if ("IntersectionObserver" in window) {
    const tlIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("in-view", entry.isIntersecting));
    }, { threshold: 0.5 });
    $$(".timeline-item").forEach((el) => tlIO.observe(el));
  }

  /* ------------------------------ Contribution graph (placeholder data) ------ */
  const contribGraph = $("#contribGraph");
  if (contribGraph) {
    const levels = ["", "l1", "l2", "l3", "l4"];
    let html = "";
    for (let i = 0; i < 130; i++) {
      const lvl = levels[Math.floor(Math.random() * levels.length)];
      html += `<i class="${lvl}" title="placeholder"></i>`;
    }
    contribGraph.innerHTML = html;
  }

  /* ------------------------------ Testimonials slider ------------------------ */
  const testiTrack = $("#testiTrack");
  const testiDotsWrap = $("#testiDots");
  if (testiTrack && testiDotsWrap) {
    const slides = $$(".testi-slide", testiTrack);
    let current = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      testiDotsWrap.appendChild(dot);
    });
    const dots = $$("button", testiDotsWrap);
    function goTo(i) {
      current = (i + slides.length) % slides.length;
      testiTrack.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
    }
    let autoplay = setInterval(() => goTo(current + 1), 5500);
    testiTrack.closest(".testi-slider").addEventListener("mouseenter", () => clearInterval(autoplay));
    testiTrack.closest(".testi-slider").addEventListener("mouseleave", () => { autoplay = setInterval(() => goTo(current + 1), 5500); });
  }

  /* -------------------------------- FAQ accordion ------------------------------ */
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-q", item);
    const a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item").forEach((other) => {
        other.classList.remove("open");
        $(".faq-a", other).style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* -------------------------------- Vanilla Tilt -------------------------------- */
  if (window.VanillaTilt) {
    VanillaTilt.init($$(".project-card, .service-card, .achieve-card"), {
      max: 6, speed: 400, glare: true, "max-glare": 0.08, scale: 1.01,
    });
  }

  /* -------------------------------- Contact form (client-side demo) ------------ */
  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#cf-name").value.trim();
      const email = $("#cf-email").value.trim();
      const message = $("#cf-message").value.trim();
      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in your name, email, and message.";
        formStatus.className = "form-status err";
        return;
      }
      // No backend wired up yet — this is a client-side placeholder.
      // Replace with a fetch() call to your form endpoint (e.g. Formspree, EmailJS) to go live.
      formStatus.textContent = `Thanks, ${name.split(" ")[0]} — this form isn't wired to a server yet, but your message was captured locally. Email naquibjabed@gmail.com directly for now.`;
      formStatus.className = "form-status ok";
      contactForm.reset();
    });
  }

  /* -------------------------------- Newsletter form (client-side demo) --------- */
  const newsletterForm = $("#newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#newsletterEmail").value.trim();
      if (!email) return;
      const btn = $("button", newsletterForm);
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed';
      newsletterForm.reset();
      setTimeout(() => { btn.innerHTML = original; }, 2500);
    });
  }

  /* -------------------------------- Smooth in-page scroll ----------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 56;
        window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  });

})();
