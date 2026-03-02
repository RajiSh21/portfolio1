/* ============================================================
   PORTFOLIO SCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme Toggle ─────────────────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
  });

  /* ── Navbar Scroll Effect ─────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile Menu ──────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ── Active Nav Highlighting ──────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
      }
    });
  }

  /* ── Back to Top ──────────────────────────────────────────── */
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Typewriter Effect ────────────────────────────────────── */
  const roles = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Open Source Contributor',
    'Cloud Engineer',
  ];
  const dynamicText = document.getElementById('dynamic-text');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 110;

  function type() {
    const current = roles[roleIndex];
    if (isDeleting) {
      dynamicText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 55;
    } else {
      dynamicText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 110;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingDelay = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 400;
    }
    setTimeout(type, typingDelay);
  }
  setTimeout(type, 800);

  /* ── Intersection Observer (scroll animations) ───────────── */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });

  /* ── Project Filters ──────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ── Contact Form ─────────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btnText = form.querySelector('.btn-text');
    const btnSending = form.querySelector('.btn-sending');
    btnText.classList.add('hidden');
    btnSending.classList.remove('hidden');

    // Simulate async send
    setTimeout(() => {
      btnText.classList.remove('hidden');
      btnSending.classList.add('hidden');
      successMsg.classList.remove('hidden');
      form.reset();
      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }, 1500);
  });

  /* ── Smooth scroll for anchor links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Initial call
  onScroll();
})();
