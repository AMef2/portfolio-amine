/* ============================================================
   LANGUAGE TOGGLE
   Default: English ('en')
   ============================================================ */
(function () {
  'use strict';

  const LANG_KEY  = 'am_lang';
  const LABELS    = { en: 'FR', fr: 'EN' };
  const ARIA      = { en: 'Switch to French', fr: 'Switch to English' };

  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  const toggle = document.getElementById('lang-toggle');

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-en][data-fr]').forEach(el => {
      el.textContent = el.dataset[lang];
    });

    if (toggle) {
      toggle.textContent   = LABELS[lang];
      toggle.setAttribute('aria-label', ARIA[lang]);
    }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = currentLang === 'en' ? 'fr' : 'en';
      applyLang(next);
    });
  }

  applyLang(currentLang);
})();


/* ============================================================
   HEADER — compact style on scroll
   ============================================================ */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   ACTIVE NAV LINK — highlight based on section in view
   ============================================================ */
(function () {
  const sections  = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks  = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!sections.length || !navLinks.length) return;

  const HEADER_OFFSET = 70;

  function getActiveId() {
    let active = sections[0].id;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top;
      if (top <= HEADER_OFFSET + 10) active = sec.id;
    }
    return active;
  }

  function markActive() {
    const id = getActiveId();
    navLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { markActive(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  markActive();
})();


/* ============================================================
   LIGHTBOX — click project images to enlarge
   ============================================================ */
(function () {
  'use strict';

  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-image-row img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
