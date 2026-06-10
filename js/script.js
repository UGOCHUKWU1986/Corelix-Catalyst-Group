/* ═══════════════════════════════
   CORELIX CATALYST GROUP
   Main JavaScript — All Pages
   ═══════════════════════════════ */

'use strict';

/* ── NAVBAR SCROLL EFFECT ── */
(function() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER / SIDE MENU ── */
(function() {
  const btn     = document.getElementById('hamburgerBtn');
  const menu    = document.getElementById('sideMenu');
  const overlay = document.getElementById('menuOverlay');
  const closeBtn= document.getElementById('menuCloseBtn');
  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    overlay && overlay.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    overlay && overlay.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  overlay && overlay.addEventListener('click', closeMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);

  // Close on ESC key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ── MENU SECTION ACCORDION ── */
window.toggleSection = function(id) {
  const section = document.querySelector('[data-section="' + id + '"]');
  if (!section) return;
  const isOpen = section.classList.contains('expanded');
  document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('expanded'));
  if (!isOpen) section.classList.add('expanded');
};

/* ── AUTO-EXPAND CURRENT PAGE SECTION ── */
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  // Find the menu item that links to this page
  document.querySelectorAll('.menu-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    const linkPage = href.split('#')[0].split('/').pop();
    if (linkPage === currentPage) {
      item.classList.add('active-page');
      // Expand parent section
      const section = item.closest('.menu-section');
      if (section) section.classList.add('expanded');
    }
  });
})();

/* ── HERO SLIDER ── */
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let current = 0;
  let timer;

  window.goToSlide = function(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => window.goToSlide(current + 1), 5500);
  };

  if (slides.length > 1) {
    timer = setInterval(() => window.goToSlide(current + 1), 5500);
  }
})();

/* ── TAB SWITCHER (Leadership) ── */
window.switchTab = function(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'tab-' + tab);
  });
};

/* ── TEAM BIO TOGGLE ── */
window.toggleBio = function(card) {
  const expanded = card.classList.toggle('expanded');
  const btn = card.querySelector('.team-toggle');
  if (btn) btn.textContent = expanded ? 'Close ↑' : 'Read Bio →';
};

/* ── SCROLL REVEAL ANIMATION ── */
(function() {
  const els = document.querySelectorAll('.reveal');
  if (els.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
    .reveal:nth-child(2) { transition-delay: 0.1s; }
    .reveal:nth-child(3) { transition-delay: 0.2s; }
    .reveal:nth-child(4) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);
  els.forEach(el => observer.observe(el));
})();

/* ── CONTACT FORM SUBMIT ── */
(function() {
  const form = document.querySelector('form');
  // Also handle button click in contact page (no real form tag used)
  const submitBtn = document.querySelector('.contact-grid .btn-primary');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const inputs = document.querySelectorAll('.form-group input[required], .form-group textarea[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e05252';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (valid) {
        this.textContent = '✓ Message Sent!';
        this.style.background = '#2a8c4a';
        setTimeout(() => {
          this.textContent = 'Send Message →';
          this.style.background = '';
          inputs.forEach(i => i.value = '');
        }, 3000);
      }
    });
  }
})();

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    // Only handle same-page anchors
    const [pagePart, hash] = href.split('#');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const linkPage = pagePart.split('/').pop();

    if (!pagePart || linkPage === currentPage || pagePart === '') {
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    // If it's a link to another page with a hash, let it navigate normally
  });
});

/* ── COOKIE CONSENT ── */
window.acceptCookies = function() {
  document.getElementById('cookieBar') && document.getElementById('cookieBar').classList.remove('show');
  closeConsentModal();
  try { localStorage.setItem('corelixCookies', 'accepted'); } catch(e) {}
};
window.showConsent = function() {
  // Close the side menu if open
  const menu = document.getElementById('sideMenu');
  if (menu) {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('cookieBar') && document.getElementById('cookieBar').classList.remove('show');
};
function closeConsentModal() {}
window.saveConsent = function() {
  document.getElementById('cookieBar') && document.getElementById('cookieBar').classList.remove('show');
  try { localStorage.setItem('corelixCookies', 'custom'); } catch(e) {}
};

window.addEventListener('load', function() {
  try {
    if (!localStorage.getItem('corelixCookies')) {
      setTimeout(function() {
        const bar = document.getElementById('cookieBar');
        if (bar) bar.classList.add('show');
      }, 2200);
    }
  } catch(e) {}
});

/* ── SEARCH FUNCTIONALITY (basic) ── */
(function() {
  const searchInput = document.querySelector('.nav-search input');
  if (!searchInput) return;
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
      const term = this.value.toLowerCase().trim();
      const pageMap = {
        'refin': 'products.html#refining',
        'petro': 'products.html#petrochemical',
        'catalyst': 'products.html',
        'adsorbent': 'products.html#adsorbents',
        'contact': 'contact.html',
        'about': 'about.html',
        'leader': 'leadership.html',
        'board': 'leadership.html#board',
        'history': 'about.html#history',
        'career': 'careers.html',
        'job': 'careers.html',
        'invest': 'investors.html',
        'sustain': 'sustainability.html',
        'news': 'news.html',
        'supply': 'products.html',
        'export': 'contact.html',
      };
      for (const [key, url] of Object.entries(pageMap)) {
        if (term.includes(key)) {
          window.location.href = url;
          return;
        }
      }
      alert('No results found for "' + this.value + '". Try: products, about, contact, careers, investors, news');
    }
  });
})();

console.log('%cCorelix Catalyst Group', 'color:#c8922a;font-size:18px;font-weight:bold;');
console.log('%cSite built with care. © 2025 Corelix Catalyst Group.', 'color:#0a1628;font-size:12px;');
