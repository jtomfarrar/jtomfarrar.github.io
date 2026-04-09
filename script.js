const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sectionNavLinks = navLinks.filter((link) => link.getAttribute('href')?.startsWith('#'));
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = Array.from(document.querySelectorAll('section[id]'));
if (sectionNavLinks.length && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          sectionNavLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-80px 0px -45% 0px',
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// ── Gallery filter ───────────────────────────────────────────
const filterBtns = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length && galleryItems.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.expedition !== filter);
      });
    });
  });
}

// ── Lightbox ────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbDate = document.getElementById('lb-date');
  const lbCredit = document.getElementById('lb-credit');
  const lbExpedition = document.getElementById('lb-expedition');
  const lbClose = document.getElementById('lb-close');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      lbImg.alt = item.dataset.alt || '';
      lbCaption.textContent = item.dataset.caption || '';
      lbDate.textContent = item.dataset.date || '';
      lbCredit.textContent = item.dataset.credit || '';
      lbExpedition.textContent = item.dataset.expeditionLabel || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}
