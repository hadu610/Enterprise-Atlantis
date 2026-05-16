// Atlantis — pitch site interactions
(() => {
  // Subtle nav shadow on scroll
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.04), 0 12px 30px -16px rgba(0,0,0,0.6)';
    else nav.style.boxShadow = 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll (very light, no dependencies)
  const targets = document.querySelectorAll(
    '.barrier, .solution, .layer, .pillar, .phase, .rm-step, .why, .stat, .journey, .jf-item, .shared-card'
  );
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = (i % 6) * 40;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        io.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach(el => io.observe(el));

  // Active nav link highlight
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          const active = a.getAttribute('href') === '#' + id;
          a.style.color = active ? 'var(--text)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));
})();
