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
