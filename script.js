// ─── Language detection ───

function detectLanguage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang') === 'ru') return 'ru';
  const savedLang = localStorage.getItem('lang');
  if (savedLang) return savedLang;
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ru' ? 'ru' : 'en';
}

let currentLang = detectLanguage();

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

// ─── Helpers ───

function setMeta(selector, prop, value) {
  const el = document.querySelector(selector);
  if (el) el[prop] = value;
}

function renderNavItems(items, containerId) {
  const ul = document.getElementById(containerId);
  if (!ul) return;
  const cls = containerId === 'navLinks' ? 'nav-link' : 'mobile-nav-link';
  ul.innerHTML = items.map(item =>
    `<li><a href="#${item.id}" class="${cls}">${item.label}</a></li>`
  ).join('');
}

// ─── Render helpers ───

function renderMeta(d, lang) {
  const baseUrl = 'https://alesiaz19.github.io/alesia-cv';
  const pageUrl = lang === 'ru' ? baseUrl + '/?lang=ru' : baseUrl + '/';

  document.documentElement.lang = lang;
  document.title = d.pageTitle;

  setMeta('meta[property="og:title"]', 'content', d.pageTitle);
  setMeta('meta[name="twitter:title"]', 'content', d.pageTitle);
  setMeta('meta[name="description"]', 'content', d.about.text);
  setMeta('meta[property="og:description"]', 'content', d.about.text);
  setMeta('meta[name="twitter:description"]', 'content', d.about.text);
  setMeta('meta[property="og:locale"]', 'content', lang === 'ru' ? 'ru_RU' : 'en_US');
  setMeta('meta[property="og:url"]', 'content', pageUrl);
  setMeta('link[rel="canonical"]', 'href', pageUrl);

  const ld = document.getElementById('ldJson');
  if (ld) {
    const data = JSON.parse(ld.textContent);
    data.url = pageUrl;
    data.description = d.about.text;
    data.alumniOf = d.education.items.map(e => e.institution);
    data.worksFor = d.experience.items.length > 0
      ? { "@type": "Organization", "name": d.experience.items[0].company }
      : undefined;
    ld.textContent = JSON.stringify(data, null, 2);
  }
}

function renderHero(d) {
  document.getElementById('heroName').textContent = d.name;
  document.getElementById('heroTitle').innerHTML =
    `${d.heroTitle} <span class="hero-sep">&middot;</span> ${d.heroLocation}`;
  const statusDot = document.getElementById('heroStatus');
  statusDot.textContent = d.heroStatus;
  statusDot.className = 'status-dot';
}

function renderAbout(d) {
  document.getElementById('aboutTitle').textContent = d.about.title;
  document.getElementById('aboutText').textContent = d.about.text;
}

function renderAchievements(d) {
  document.getElementById('achievementsTitle').textContent = d.achievements.title;
  document.getElementById('achievementsStats').innerHTML = d.achievements.items.map(item =>
    `<div class="stat-item">
      <div class="stat-number"><span>${item.number}</span></div>
      <div class="stat-label">${item.label}</div>
    </div>`
  ).join('');
}

function renderSkills(d) {
  document.getElementById('skillsTitle').textContent = d.skills.title;
  document.getElementById('skillsGrid').innerHTML = d.skills.items.map(skill =>
    `<div class="glass-card skill-card">${skill}</div>`
  ).join('');
}

function renderExperience(d) {
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
}

function renderEducation(d) {
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
}

function renderCertificates(d) {
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
}

function renderLanguages(d) {
  document.getElementById('languagesTitle').textContent = d.languages.title;
  document.getElementById('languagesList').innerHTML = d.languages.items.map(langItem =>
    `<div class="glass-card lang-card">
      <span class="lang-name">${langItem.name}</span>
      <span class="lang-level">${langItem.level}</span>
    </div>`
  ).join('');
}

function renderContact(d) {
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
}

function updateLangToggle(lang) {
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  const toggle = document.getElementById('langToggle');
  toggle.classList.toggle('ru', lang === 'ru');
}

let scrollObserver = null;

function initScrollAnimations() {
  if (scrollObserver) scrollObserver.disconnect();
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('visible');
    scrollObserver.observe(section);
  });
}

// ─── Main render ───

function renderPage(lang) {
  const d = cvData[lang];

  renderMeta(d, lang);
  document.getElementById('logo').textContent = d.name;
  renderNavItems(d.nav, 'navLinks');
  renderNavItems(d.nav, 'mobileNavLinks');
  renderHero(d);
  renderAbout(d);
  renderAchievements(d);
  renderSkills(d);
  renderExperience(d);
  renderEducation(d);
  renderCertificates(d);
  renderLanguages(d);
  renderContact(d);
  updateLangToggle(lang);
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

// ─── Mobile menu ───

function initMobileMenu() {
  const burger = document.getElementById('burgerMenu');
  const menu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-nav-link')) {
      menu.classList.remove('active');
    }
  });
}

// ─── Header shrink on scroll ───

function initScrollHeader() {
  const header = document.getElementById('header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ─── Scroll-to-top ───

function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
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
initMobileMenu();
initScrollHeader();
initScrollTop();
initLightbox();
