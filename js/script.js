// MEMBER 3: all JavaScript interactivity
document.addEventListener("DOMContentLoaded", () => {
  initTypingEffect();
  initMobileMenu();
  initDarkMode();
  initActiveLink();
  initFormValidation();
});

/* ---------- 1. Typing effect ---------- */
function initTypingEffect() {
  const el = document.querySelector(".typing-effect");
  if (!el) return;

  const words = ["clean code", "great teamwork", "Git & GitHub", "real projects"];
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseAfterWord = 1500;
  const pauseBeforeNext = 400;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];

    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    el.textContent = word.substring(0, charIndex);

    let delay = deleting ? deleteSpeed : typeSpeed;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = pauseAfterWord;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = pauseBeforeNext;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ---------- 2. Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setMenu(false);
  });
}

/* ---------- 3. Dark-mode toggle ---------- */
function initDarkMode() {
  const btn = document.getElementById("theme-toggle");
  const body = document.body;

  function apply(isDark) {
    body.classList.toggle("dark-mode", isDark);
    if (btn) {
      btn.textContent = isDark ? "☀️" : "🌙";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(saved ? saved === "dark" : prefersDark);

  if (!btn) return;
  btn.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark-mode");
    apply(isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
  });
}

/* ---------- 4. Active-link highlight ---------- */
function initActiveLink() {
  const links = document.querySelectorAll('nav a[href^="#"]');
  if (!links.length) return;

  const sections = [];
  links.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    const section = id ? document.getElementById(id) : null;
    if (section) sections.push(section);
  });

  function setActive(id) {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 5. Form validation ---------- */
function initFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.noValidate = true;

  const fields = {
    name: {
      input: document.getElementById("name"),
      validate: (v) => {
        if (!v) return "Please enter your name.";
        if (v.length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      input: document.getElementById("email"),
      validate: (v) => {
        if (!v) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
        return "";
      },
    },
    message: {
      input: document.getElementById("message"),
      validate: (v) => {
        if (!v) return "Please write a message.";
        if (v.length < 10) return "Message must be at least 10 characters.";
        return "";
      },
    },
  };

  Object.entries(fields).forEach(([key, field]) => {
    if (!field.input) return;
    const error = document.createElement("small");
    error.className = "error-message";
    error.id = key + "-error";
    error.setAttribute("role", "alert");
    field.input.insertAdjacentElement("afterend", error);
    field.input.setAttribute("aria-describedby", error.id);
    field.error = error;
  });

  const success = document.createElement("p");
  success.className = "success-message";
  success.setAttribute("role", "status");
  success.hidden = true;
  form.appendChild(success);

  function checkField(field) {
    if (!field.input) return true;
    const message = field.validate(field.input.value.trim());
    field.error.textContent = message;
    field.input.classList.toggle("invalid", Boolean(message));
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  Object.values(fields).forEach((field) => {
    if (!field.input) return;
    field.input.addEventListener("blur", () => checkField(field));
    field.input.addEventListener("input", () => {
      success.hidden = true;
      if (field.input.classList.contains("invalid")) checkField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = Object.values(fields).map(checkField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      success.hidden = true;
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    success.textContent = "Thanks! Your message has been sent.";
    success.hidden = false;
    form.reset();
  });
}