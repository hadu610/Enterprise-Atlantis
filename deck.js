// Atlantis — presentation deck behaviour
// Vanilla; no external libs. Keyboard / touch / hash deep-link navigation.

(() => {
  const deck = document.querySelector('.deck');
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll('.slide'));
  const total = slides.length;

  const counter   = document.getElementById('deck-counter');
  const progress  = document.getElementById('deck-progress');
  const btnPrev   = document.getElementById('deck-prev');
  const btnNext   = document.getElementById('deck-next');
  const btnNotes  = document.getElementById('deck-notes');
  const btnFull   = document.getElementById('deck-full');

  let current = 0;

  function indexFromHash() {
    const m = location.hash.match(/^#(?:slide-)?(\d+)$/i);
    if (m) {
      const n = Math.max(1, Math.min(total, parseInt(m[1], 10)));
      return n - 1;
    }
    return 0;
  }

  function go(n, push = true) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === current && document.querySelector('.slide.active')) return;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('leaving', i === current && i !== n);
    });
    current = n;
    updateChrome();
    if (push) {
      const id = '#slide-' + (n + 1);
      if (location.hash !== id) history.replaceState(null, '', id);
    }
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function updateChrome() {
    if (counter) counter.innerHTML = `<strong>${current + 1}</strong> / ${total}`;
    if (progress) progress.style.width = `${((current + 1) / total) * 100}%`;
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === total - 1;
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); go(0); break;
      case 'End':
        e.preventDefault(); go(total - 1); break;
      case 'f':
      case 'F':
        toggleFullscreen(); break;
      case 'n':
      case 'N':
        toggleNotes(); break;
      case 'Escape':
        if (document.fullscreenElement) document.exitFullscreen();
        break;
    }
  });

  // Touch swipe
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    if (dx < 0) next();
    else prev();
  }, { passive: true });

  // Buttons
  btnPrev && btnPrev.addEventListener('click', prev);
  btnNext && btnNext.addEventListener('click', next);

  function toggleNotes() {
    deck.classList.toggle('show-notes');
    if (btnNotes) btnNotes.classList.toggle('active', deck.classList.contains('show-notes'));
  }
  btnNotes && btnNotes.addEventListener('click', toggleNotes);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }
  btnFull && btnFull.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    if (btnFull) btnFull.classList.toggle('active', !!document.fullscreenElement);
  });

  // Hash routing (deep-link)
  window.addEventListener('hashchange', () => go(indexFromHash(), false));

  // ?notes=1 query — start with notes visible (presenter view)
  if (/[?&]notes=1\b/.test(location.search)) {
    deck.classList.add('show-notes');
    if (btnNotes) btnNotes.classList.add('active');
  }

  // Click anywhere on the slide (not on links/buttons) to advance
  deck.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .slide-notes, .deck-top, .deck-bottom')) return;
    next();
  });

  // Init
  go(indexFromHash(), false);
})();
