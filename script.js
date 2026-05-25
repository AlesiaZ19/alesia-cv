// ─── Language detection ───

function detectLanguage() {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  if (langParam && langParam.startsWith('ru')) return 'ru';
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

// ─── Constants ───

const BASE_URL = 'https://alesiaz19.github.io/alesia-cv';
const IMG_PATH = 'img/';

// ─── Helpers ───

function setMeta(selector, prop, value) {
  const el = document.querySelector(selector);
  if (el) el[prop] = value;
}

function onScrollRaf(callback) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  });
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
  const pageUrl = lang === 'ru' ? BASE_URL + '/?lang=ru' : BASE_URL + '/';

  document.documentElement.lang = lang;
  document.title = d.pageTitle;

  const titleSelectors = [
    ['meta[property="og:title"]', 'content'],
    ['meta[name="twitter:title"]', 'content'],
  ];
  titleSelectors.forEach(([sel, prop]) => setMeta(sel, prop, d.pageTitle));

  const descSelectors = [
    ['meta[name="description"]', 'content'],
    ['meta[property="og:description"]', 'content'],
    ['meta[name="twitter:description"]', 'content'],
  ];
  descSelectors.forEach(([sel, prop]) => setMeta(sel, prop, d.about.text));

  setMeta('meta[property="og:locale"]', 'content', lang === 'ru' ? 'ru_RU' : 'en_US');
  setMeta('meta[property="og:url"]', 'content', pageUrl);
  setMeta('link[rel="canonical"]', 'href', pageUrl);

  const ld = document.getElementById('ldJson');
  if (ld) {
    const data = JSON.parse(ld.textContent);
    data.url = pageUrl;
    data.description = d.about.text;
    data.jobTitle = d.heroTitle;
    data.knowsAbout = d.skills.items;
    data.alumniOf = d.education.items.map(e => e.institution);
    data.worksFor = d.experience.items[0]?.company
      ? { "@type": "Organization", "name": d.experience.items[0].company }
      : undefined;
    ld.textContent = JSON.stringify(data, null, 2);
  }
}

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3-$4-$5');
}

function shortUrl(url) {
  if (url.includes('linkedin.com')) return url.split('/in/')[1]?.split('/')[0] || url;
  if (url.includes('t.me')) return '@' + (url.split('t.me/')[1]?.split('/')[0] || url);
  return url;
}

function renderHero(d) {
  document.getElementById('heroName').textContent = d.name;
  document.getElementById('heroTitle').textContent = d.heroTitle;
  document.getElementById('heroLocation').textContent = d.heroLocation;
  const statusDot = document.getElementById('heroStatus');
  statusDot.textContent = d.heroStatus;
  statusDot.className = 'status-dot';
  statusDot.setAttribute('aria-label', d.heroStatus);
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
      <img src="${IMG_PATH}${cert.file}" alt="${cert.name}" class="cert-img" loading="lazy">
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
  const c = d.contact;
  document.getElementById('contactTitle').textContent = c.title;

  const items = [
    { icon: 'fa-map-marker-alt', tag: 'span', content: c.location },
    { icon: 'fa-envelope', tag: 'a', href: `mailto:${c.email}`, content: c.email, cls: 'nav-link' },
    { icon: 'fa-phone', tag: 'a', href: `tel:${c.phone}`, content: formatPhone(c.phone), cls: 'nav-link' },
    { icon: 'fab fa-linkedin', tag: 'a', href: c.linkedin, content: shortUrl(c.linkedin), cls: 'nav-link', ext: true },
    { icon: 'fab fa-telegram-plane', tag: 'a', href: c.telegram, content: shortUrl(c.telegram), cls: 'nav-link', ext: true },
  ];

  document.getElementById('contactList').innerHTML = items.map(item => {
    const icon = `<span class="contact-icon"><i class="fas ${item.icon}"></i></span>`;
    const extra = item.ext ? ' target="_blank"' : '';
    if (item.tag === 'a') {
      return `<div class="glass-card contact-item">${icon}<a href="${item.href}" class="${item.cls}"${extra}>${item.content}</a></div>`;
    }
    return `<div class="glass-card contact-item">${icon}<span>${item.content}</span></div>`;
  }).join('');

  document.getElementById('downloadLabel').textContent = c.downloadLabel;
  document.getElementById('downloadBtn').href = c.cvFile;
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
  onScrollRaf(() => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ─── Scroll-to-top ───

function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  onScrollRaf(() => {
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
initMobileMenu();
initScrollHeader();
initScrollTop();
initLightbox();
