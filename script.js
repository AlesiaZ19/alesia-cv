// Detect language based on URL query, localStorage, then browser language
function detectLanguage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang') === 'ru') {
    return 'ru';
  }
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    return savedLang;
  }
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ru' ? 'ru' : 'en';
}

let currentLang = detectLanguage();

// Sync URL query with language on first load
(function initUrl() {
  const url = new URL(window.location);
  if (currentLang === 'ru' && url.searchParams.get('lang') !== 'ru') {
    url.searchParams.set('lang', 'ru');
    history.replaceState(null, '', url);
  } else if (currentLang === 'en' && url.searchParams.get('lang') === 'ru') {
    url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }
})();

function renderPage(lang) {
  const d = cvData[lang];

  document.documentElement.lang = lang;
  document.title = d.pageTitle;

  // Update OG / Twitter meta tags for current language
  document.querySelector('meta[property="og:title"]').content = d.pageTitle;
  document.querySelector('meta[name="twitter:title"]').content = d.pageTitle;
  document.querySelector('meta[name="description"]').content = d.about.text;
  document.querySelector('meta[property="og:description"]').content = d.about.text;
  document.querySelector('meta[name="twitter:description"]').content = d.about.text;
  document.querySelector('meta[property="og:locale"]').content = lang === 'ru' ? 'ru_RU' : 'en_US';
  const baseUrl = 'https://alesiaz19.github.io/alesia-cv';
  const pageUrl = lang === 'ru' ? baseUrl + '/?lang=ru' : baseUrl + '/';
  document.querySelector('meta[property="og:url"]').content = pageUrl;
  document.querySelector('link[rel="canonical"]').href = pageUrl;

  // ─── Logo ───
  document.getElementById('logo').textContent = d.name;

  // ─── Nav ───
  function renderNavItems(items, containerId) {
    const ul = document.getElementById(containerId);
    ul.innerHTML = items.map(item =>
      `<li><a href="#${item.id}" class="${containerId === 'navLinks' ? 'nav-link' : 'mobile-nav-link'}">${item.label}</a></li>`
    ).join('');
  }
  renderNavItems(d.nav, 'navLinks');
  renderNavItems(d.nav, 'mobileNavLinks');

  // ─── Hero ───
  document.getElementById('heroName').textContent = d.name;
  document.getElementById('heroTitle').textContent = d.heroTitle;
  document.getElementById('heroLocation').textContent = d.heroLocation;
  document.getElementById('heroContacts').innerHTML = `
    <div class="hero-contacts-line">
      <a href="mailto:${d.heroContacts.email}" class="hero-link"><i class="fas fa-envelope"></i> ${d.heroContacts.email}</a>
      <span class="hero-link-sep">|</span>
      <a href="tel:${d.heroContacts.phone}" class="hero-link"><i class="fas fa-phone"></i> ${d.heroContacts.phone}</a>
    </div>
    <div class="hero-contacts-line">
      <a href="${d.heroContacts.linkedin}" class="hero-link" target="_blank"><i class="fab fa-linkedin"></i> alesiaromasko</a>
      <span class="hero-link-sep">|</span>
      <a href="${d.heroContacts.telegram}" class="hero-link" target="_blank"><i class="fab fa-telegram-plane"></i> @lesiaRomashko</a>
    </div>
  `;

  // ─── About ───
  document.getElementById('aboutTitle').textContent = d.about.title;
  document.getElementById('aboutText').textContent = d.about.text;

  // ─── Achievements ───
  document.getElementById('achievementsTitle').textContent = d.achievements.title;
  document.getElementById('achievementsStats').innerHTML = d.achievements.items.map(item =>
    `<div class="stat-item">
      <div class="stat-number"><span>${item.number}</span></div>
      <div class="stat-label">${item.label}</div>
    </div>`
  ).join('');

  // ─── Skills ───
  document.getElementById('skillsTitle').textContent = d.skills.title;
  document.getElementById('skillsGrid').innerHTML = d.skills.items.map(skill =>
    `<div class="glass-card skill-card">${skill}</div>`
  ).join('');

  // ─── Experience ───
  document.getElementById('experienceTitle').textContent = d.experience.title;
  document.getElementById('experienceList').innerHTML = d.experience.items.map(exp =>
    `<div class="glass-card experience-card">
      <div class="experience-date">${exp.period}</div>
      <div>
        <strong class="company-name">${exp.company}</strong>
        <p class="position-title">${exp.position}</p>
        ${exp.paragraphs.map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>`
  ).join('');

  // ─── Education ───
  document.getElementById('educationTitle').textContent = d.education.title;
  document.getElementById('educationList').innerHTML = d.education.items.map(edu =>
    `<div class="glass-card experience-card">
      <div class="experience-date">${edu.period}</div>
      <div>
        <strong class="company-name">${edu.institution}</strong>
        <p>${edu.degree}</p>
      </div>
    </div>`
  ).join('');

  // ─── Certificates ───
  document.getElementById('certificatesTitle').textContent = d.certificates.title;
  document.getElementById('certificatesList').innerHTML = d.certificates.items.map(cert =>
    `<div class="cert-card glass-card">
      <img src="img/${cert.file}" alt="${cert.name}" class="cert-img" loading="lazy">
      <div class="cert-body">
        <strong class="cert-name">${cert.name}</strong>
        <span class="cert-date">${cert.date}</span>
        <span class="cert-issuer">${cert.issuer}</span>
      </div>
    </div>`
  ).join('');

  // ─── Languages ───
  document.getElementById('languagesTitle').textContent = d.languages.title;
  document.getElementById('languagesList').innerHTML = d.languages.items.map(langItem =>
    `<div class="glass-card lang-card">
      <span class="lang-name">${langItem.name}</span>
      <span class="lang-level">${langItem.level}</span>
    </div>`
  ).join('');

  // ─── Contact ───
  document.getElementById('contactTitle').textContent = d.contact.title;
  document.getElementById('contactList').innerHTML = `
    <div class="glass-card contact-item">
      <span class="contact-icon"><i class="fas fa-map-marker-alt"></i></span>
      <span>${d.contact.location}</span>
    </div>
    <div class="glass-card contact-item">
      <span class="contact-icon"><i class="fas fa-envelope"></i></span>
      <a href="mailto:${d.contact.email}" class="nav-link">${d.contact.email}</a>
    </div>
    <div class="glass-card contact-item">
      <span class="contact-icon"><i class="fas fa-phone"></i></span>
      <a href="tel:${d.contact.phone}" class="nav-link">${d.contact.phone}</a>
    </div>
    <div class="glass-card contact-item">
      <span class="contact-icon"><i class="fab fa-linkedin"></i></span>
      <a href="${d.contact.linkedin}" class="nav-link">${d.contact.linkedin}</a>
    </div>
    <div class="glass-card contact-item">
      <span class="contact-icon"><i class="fab fa-telegram-plane"></i></span>
      <a href="${d.contact.telegram}" class="nav-link">${d.contact.telegram}</a>
    </div>`;
  document.getElementById('downloadLabel').textContent = d.contact.downloadLabel;
  document.getElementById('downloadBtn').href = d.contact.cvFile;

  // ─── Lang toggle visual ───
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  const toggle = document.getElementById('langToggle');
  toggle.classList.toggle('ru', lang === 'ru');
  toggle.classList.toggle('en', lang === 'en');

  // ─── Re-bind mobile nav click-to-close ───
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.remove('active');
    });
  });

  // ─── Re-observe sections for scroll animations ───
  initScrollAnimations();
}

// ─── Language toggle ───

function initLangToggle() {
  const toggle = document.getElementById('langToggle');
  toggle.querySelectorAll('.lang-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      if (lang !== currentLang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        const url = new URL(window.location);
        if (lang === 'ru') {
          url.searchParams.set('lang', 'ru');
        } else {
          url.searchParams.delete('lang');
        }
        history.replaceState(null, '', url);
        renderPage(lang);
      }
    });
  });
}

// ─── Scroll animations ───

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('visible');
    observer.observe(section);
  });
}

// ─── Burger menu ───

function initBurgerMenu() {
  const burger = document.getElementById('burgerMenu');
  const menu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

// ─── Header shrink on scroll ───

function initScrollHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ─── Scroll-to-top button ───

function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Lightbox ───

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.getElementById('certificatesList').addEventListener('click', (e) => {
    const card = e.target.closest('.cert-card');
    if (!card) return;
    const img = card.querySelector('.cert-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
  });
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
}

// ─── Init ───

renderPage(currentLang);
initLangToggle();
initBurgerMenu();
initScrollHeader();
initScrollTop();
initLightbox();
