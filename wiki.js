// Atlantis Wiki viewer
// Renders the same markdown files agents read from /wiki/.
// Single source of truth: humans see what AI sees.

(() => {
  const WIKI_DIR = './wiki/';
  const HOME_PAGE = 'Home';

  // Configure marked.js
  marked.use({ gfm: true, breaks: false });

  // -------- Utilities --------

  function slugify(text) {
    return String(text || '').toLowerCase()
      .replace(/[ \s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function fetchPage(name) {
    const res = await fetch(`${WIKI_DIR}${encodeURIComponent(name)}.md`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Page not found: ${name}`);
    return res.text();
  }

  function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    if (!raw) return { page: HOME_PAGE, section: '' };
    const [page, section] = raw.split('#');
    return { page: page || HOME_PAGE, section: section || '' };
  }

  // -------- HTML transforms --------

  function addHeadingIds(root) {
    root.querySelectorAll('h2, h3, h4').forEach(h => {
      if (!h.id) h.id = slugify(h.textContent);
      // Anchor link
      const a = document.createElement('a');
      a.href = `#${parseHash().page}#${h.id}`;
      a.className = 'heading-anchor';
      a.setAttribute('aria-label', 'Link to section');
      a.textContent = '#';
      h.appendChild(a);
    });
  }

  function rewriteLinks(root) {
    root.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('http://') || href.startsWith('https://')) {
        a.target = '_blank';
        a.rel = 'noopener';
        return;
      }
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('#')) return; // already in-page

      // Internal wiki link, possibly with fragment
      const [page, section] = href.split('#');
      const target = (page || HOME_PAGE).replace(/^\/+/, '');
      a.setAttribute('href', `#${target}${section ? '#' + section : ''}`);
    });
  }

  function markMetadataBlock(root) {
    // The first blockquote immediately after the H1 is the page metadata block
    const h1 = root.querySelector('h1');
    if (!h1) return;
    let el = h1.nextElementSibling;
    while (el && el.tagName !== 'BLOCKQUOTE' && el.tagName !== 'H2') el = el.nextElementSibling;
    if (el && el.tagName === 'BLOCKQUOTE') el.classList.add('page-meta');
  }

  // -------- TOC --------

  function buildToc(contentEl) {
    const tocEl = document.getElementById('toc');
    if (!tocEl) return;
    tocEl.innerHTML = '';

    const headings = contentEl.querySelectorAll('h2, h3');
    if (headings.length < 2) { tocEl.parentElement.style.visibility = 'hidden'; return; }
    tocEl.parentElement.style.visibility = '';

    headings.forEach(h => {
      const a = document.createElement('a');
      const id = h.id || slugify(h.textContent);
      const { page } = parseHash();
      a.href = `#${page}#${id}`;
      a.textContent = h.textContent.replace(/#$/, '').trim();
      a.dataset.target = id;
      if (h.tagName === 'H3') a.classList.add('toc-h3');
      tocEl.appendChild(a);
    });

    // Scroll spy
    const links = tocEl.querySelectorAll('a');
    const map = new Map();
    headings.forEach((h, i) => map.set(h, links[i]));
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            const link = map.get(entry.target);
            if (link) link.classList.add('active');
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
      headings.forEach(h => obs.observe(h));
    }
  }

  // -------- Sidebar --------

  function highlightSidebar(pageName) {
    document.querySelectorAll('#sidebar a').forEach(a => {
      a.classList.remove('active');
      const href = (a.getAttribute('href') || '').replace(/^#\/?/, '');
      const target = href.split('#')[0];
      if (target === pageName) a.classList.add('active');
    });
  }

  async function loadSidebar() {
    const container = document.getElementById('sidebar-content');
    try {
      const md = await fetchPage('_Sidebar');
      container.innerHTML = marked.parse(md);
      rewriteLinks(container);
    } catch {
      container.innerHTML = '<div class="loading">Sidebar unavailable.</div>';
    }
  }

  // -------- Page rendering --------

  async function renderPage(pageName, sectionId) {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading">Loading page…</div>';
    document.getElementById('toc').innerHTML = '';

    try {
      const md = await fetchPage(pageName);
      const html = marked.parse(md);
      content.innerHTML = html;
      addHeadingIds(content);
      rewriteLinks(content);
      markMetadataBlock(content);
      buildToc(content);

      const title = pageName.replace(/-/g, ' ');
      document.title = `${title} · Atlantis Wiki`;
      highlightSidebar(pageName);

      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 30);
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } catch (e) {
      content.innerHTML = `
        <div class="page-error">
          <h1>Page not found</h1>
          <p>No Wiki page found at <code>${pageName}.md</code>.</p>
          <p><a href="#${HOME_PAGE}">← Back to Home</a></p>
          <p style="margin-top:24px;font-size:13px;color:var(--text-mute)">
            If you opened this file directly from disk (<code>file://</code>), most browsers block local
            <code>fetch()</code>. Run a small local server instead — from the project root:
            <code>python3 -m http.server 8080</code> and visit
            <code>http://localhost:8080/wiki.html</code>.
          </p>
        </div>
      `;
      document.title = 'Not found · Atlantis Wiki';
    }
  }

  // -------- Mobile sidebar toggle --------

  function setupMobileToggle() {
    const toggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Auto-close on link click
    sidebar.addEventListener('click', e => {
      if (e.target.tagName === 'A') sidebar.classList.remove('open');
    });
  }

  // -------- Route --------

  async function route() {
    const { page, section } = parseHash();
    await renderPage(page, section);
  }

  async function init() {
    setupMobileToggle();
    await loadSidebar();
    await route();
    window.addEventListener('hashchange', route);
  }

  init();
})();
