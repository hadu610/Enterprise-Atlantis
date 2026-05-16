// Shared top-nav behaviour (hamburger toggle) for every page.
// Loaded by index.html, wiki.html, and workflows.html.
(() => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!nav || !toggle || !links) return;

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));

  // Close when a link inside the drawer is clicked
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });

  // Close if viewport grows past mobile breakpoint (handles rotation)
  const mq = window.matchMedia('(min-width: 901px)');
  mq.addEventListener('change', (e) => { if (e.matches) setOpen(false); });
})();
