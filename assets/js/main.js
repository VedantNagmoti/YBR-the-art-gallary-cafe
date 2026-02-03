document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initScrollReveal();
  initRipples();
  initLightbox();
  initSmoothAnchors();
});

function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('[data-nav]');
  links.forEach((link) => {
    const target = link.getAttribute('href');
    if (target === current || (current === '' && target === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initRipples() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

function initLightbox() {
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  if (!galleryItems.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `
    <figure>
      <button class="close-btn" aria-label="Close">×</button>
      <img src="" alt="Gallery item" />
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);
  const imgEl = overlay.querySelector('img');
  const captionEl = overlay.querySelector('figcaption');
  const closeBtn = overlay.querySelector('.close-btn');

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => {
      imgEl.src = '';
      captionEl.textContent = '';
    }, 200);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.src;
      const caption = item.getAttribute('data-caption') || item.alt || 'Gallery image';
      imgEl.src = src;
      captionEl.textContent = caption;
      overlay.classList.add('active');
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
