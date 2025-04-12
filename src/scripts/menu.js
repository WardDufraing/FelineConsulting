const toggle = document.getElementById('hamburger');
const nav = document.getElementById('nav-links');
const navContainer = document.getElementById('nav-container');
const body = document.body;

document.querySelector('.hamburger')?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('expanded');
    navContainer.classList.toggle('expanded');

    if (nav.classList.contains('expanded')) {
        body.style.overflow = 'hidden'; // Lock scroll
      } else {
        body.style.overflow = 'auto'; // Unlock scroll
      }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('expanded');
      navContainer.remove('expanded')
      body.style.overflow = 'auto';
    });
  });
