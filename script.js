let currentLang = localStorage.getItem('lang') || 'en';

function renderPage(lang) {
  const d = cvData[lang];

  document.documentElement.lang = lang;
  document.title = d.pageTitle;

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

  // ─── Languages ───
  document.getElementById('languagesTitle').textContent = d.languages.title;
  document.getElementById('languagesList').innerHTML = d.languages.items.map(langItem =>
    `<div class="glass-card experience-card">
      <div class="experience-date">${langItem.name}</div>
      <div>${langItem.level}</div>
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

// ─── Init ───

renderPage(currentLang);
initLangToggle();
initBurgerMenu();
initScrollHeader();
initScrollTop();
