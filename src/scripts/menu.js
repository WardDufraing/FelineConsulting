const toggle = document.getElementById('hamburger');
const nav = document.getElementById('nav-links');
const container = document.getElementById('nav-container');
function setOpen(open) {
  toggle?.classList.toggle('open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  nav?.classList.toggle('expanded', open);
  container?.classList.toggle('expanded', open);
}
toggle?.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    toggle.focus();
  }
});
matchMedia('(min-width: 850px)').addEventListener('change', () => setOpen(false));
