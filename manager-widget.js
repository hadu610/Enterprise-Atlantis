/* manager-widget.js — Floating Atlantis Manager
 *
 * A page-context-aware chat surface that talks to a Cloudflare Worker
 * proxy holding the Anthropic API key. The worker URL is configured via
 * window.ATLANTIS_MANAGER_CONFIG (set per page) or via meta tag.
 *
 * Calls the Claude API (claude-sonnet-4-6) with prompt caching on the
 * system prompt (catalog + persona). Conversation history is
 * session-scoped (in-memory only); never persisted.
 */

(function () {
  'use strict';

  // ---------- Config ----------
  function readConfig() {
    const cfg = window.ATLANTIS_MANAGER_CONFIG || {};
    const meta = document.querySelector('meta[name="atlantis-manager-worker"]');
    const workerUrl = cfg.workerUrl || (meta && meta.content) || '';
    return {
      workerUrl: workerUrl,
      model: cfg.model || 'claude-sonnet-4-6',
      maxTokens: cfg.maxTokens || 1024,
    };
  }

  // ---------- State ----------
  const State = {
    open: false,
    messages: [],
    sending: false,
    snapshot: null, // populated when "Activate my company" is clicked on build.html
    config: readConfig(),
  };

  // ---------- DOM ----------
  let pillEl = null;
  let panelEl = null;
  let bodyEl = null;
  let textareaEl = null;

  function mount() {
    const root = document.getElementById('atlantis-manager-root') || document.body;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <button class="am-pill" id="am-pill" type="button" aria-label="Open Atlantis Manager">
        <span class="am-pill-dot" aria-hidden="true"></span>
        <span>
          Ask Atlantis Manager
          <span class="am-pill-label-sub"> · Online</span>
        </span>
      </button>
      <aside class="am-panel" id="am-panel" role="dialog" aria-label="Atlantis Manager chat">
        <header class="am-head">
          <div class="am-head-left">
            <div class="am-avatar" aria-hidden="true">AM</div>
            <div>
              <div class="am-title">Atlantis Manager</div>
              <div class="am-subtitle">${pageContextLabel()}</div>
            </div>
          </div>
          <div class="am-head-actions">
            <button class="am-icon-btn" id="am-clear" type="button" title="Start new conversation" aria-label="Start new conversation">⟲</button>
            <button class="am-icon-btn" id="am-close" type="button" title="Close" aria-label="Close">×</button>
          </div>
        </header>
        <div class="am-body" id="am-body" aria-live="polite"></div>
        <div class="am-composer">
          <div class="am-composer-input-row">
            <textarea id="am-input" rows="1" placeholder="${composerPlaceholder()}"></textarea>
            <button class="am-send" id="am-send" type="button" aria-label="Send">↑</button>
          </div>
          <div class="am-composer-meta">
            <span>Sonnet 4.6 · prompt-cached · context-aware</span>
            <a class="am-composer-link" href="wiki.html#Atlantis-Manager-Playbook" target="_blank" rel="noopener">Spec →</a>
          </div>
        </div>
      </aside>
    `;
    root.appendChild(wrap);

    pillEl = document.getElementById('am-pill');
    panelEl = document.getElementById('am-panel');
    bodyEl = document.getElementById('am-body');
    textareaEl = document.getElementById('am-input');

    pillEl.addEventListener('click', () => open());
    document.getElementById('am-close').addEventListener('click', () => close());
    document.getElementById('am-clear').addEventListener('click', () => clearConversation());
    document.getElementById('am-send').addEventListener('click', () => send());
    textareaEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
    textareaEl.addEventListener('input', autoResize);

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
      if (e.key === 'Escape' && State.open) close();
    });

    renderGreeting();
  }

  function autoResize() {
    textareaEl.style.height = 'auto';
    textareaEl.style.height = Math.min(140, textareaEl.scrollHeight) + 'px';
  }

  // ---------- Page context ----------
  function currentPage() {
    const path = location.pathname.toLowerCase();
    if (path.endsWith('build.html')) return 'build';
    if (path.endsWith('workflows.html')) return 'workflows';
    if (path.endsWith('wiki.html')) return 'wiki';
    if (path.endsWith('investor-deck.html')) return 'investor';
    if (path.endsWith('customer-deck.html')) return 'customer-deck';
    if (path === '/' || path.endsWith('index.html') || path.endsWith('/')) return 'home';
    return 'other';
  }

  function pageContextLabel() {
    const p = currentPage();
    if (p === 'home') return 'Pre-sales · home';
    if (p === 'workflows') return 'Pre-sales · workflows';
    if (p === 'build') return 'Onboarding · builder';
    if (p === 'wiki') return 'Reference · wiki';
    if (p === 'investor') return 'Pre-sales · investor deck';
    if (p === 'customer-deck') return 'Pre-sales · customer deck';
    return 'Pre-sales';
  }

  function composerPlaceholder() {
    const p = currentPage();
    if (p === 'build') return "Try: \"I'm a 30-person SaaS company...\"";
    if (p === 'workflows') return 'Ask how a workflow runs end-to-end…';
    if (p === 'wiki') return 'Ask anything about the platform…';
    return 'Ask me about Atlantis…';
  }

  function greetingChips() {
    const p = currentPage();
    if (p === 'home') return [
      'How is Atlantis different from Salesforce or Workday?',
      "What's the 5-minute onboarding?",
      'How does it cost vs my current stack?',
      'Walk me through a sample workflow',
    ];
    if (p === 'build') return [
      "I'm a 30-person SaaS company — what should I pick?",
      'What does Silent mode mean?',
      "Why is Finance Agent's recommendation Approval?",
      'Customize the Stripe reconciliation playbook',
    ];
    if (p === 'workflows') return [
      'Walk me through Hire to Day 1',
      'Show me how monthly close runs',
      'What happens if an agent makes a mistake?',
    ];
    if (p === 'wiki') return [
      'Explain the Resolution Plan in plain English',
      'How does the Live Activity Stream work?',
      "What's the difference between Trust Phase and Autonomy Mode?",
    ];
    return [
      "What's Atlantis?",
      'How does it work?',
      'How much does it cost?',
    ];
  }

  function greetingTitle() {
    const p = currentPage();
    if (p === 'home') return "Hi — I'm the Atlantis Manager.";
    if (p === 'build') return "Let's design your operating model.";
    if (p === 'workflows') return "I'll walk you through any workflow.";
    if (p === 'wiki') return "Ask me anything in the wiki.";
    return "Hi — I'm the Atlantis Manager.";
  }

  function greetingSub() {
    const p = currentPage();
    if (p === 'home') return "I've read every page on this site. Ask me anything — pricing, how it works, how it compares to your current stack.";
    if (p === 'build') return "Tell me about your business in a sentence or two and I'll pre-select the right playbooks. Or ask me about any pick on the page.";
    if (p === 'workflows') return "Pick any workflow and I'll walk you through it — what the agent does, what the human does, what the gates look like.";
    if (p === 'wiki') return "I cite my answers with deep links. If I don't know, I'll say so.";
    return "Ask me anything about the platform.";
  }

  // ---------- System prompt ----------
  function buildSystemPrompt() {
    const persona = `You are the Atlantis Manager — the chat surface for the Atlantis Enterprise AI Operating System.

You have read the entire Atlantis wiki and you can answer questions about the platform with precision. You cite wiki pages by name when you reference them. When you don't know something, you say so plainly.

Voice: factual, concise, plain English. Active voice. Short sentences. No marketing language, no flattery. Match the user's register but do not add enthusiasm they didn't bring.

You are running in the Atlantis customer-facing site (not yet inside a customer tenant). You cannot execute side-effecting platform actions — those require an activated tenant. You can:
- Explain the platform's concepts (Autonomy Modes, Resolution Plans, the seven agents, the Live Activity Stream, the Trust Score, the Six Barriers)
- Walk users through pricing and the cost calculator
- Help them think through which playbooks to pick on the Build page
- Show them where to read more in the wiki

Key concepts to reference accurately:
- The seven department agents: HR, Finance, Sales, Marketing, Operations, Legal, Dev — plus the Atlantis Manager (orchestrator).
- Three Autonomy Modes: Drafting (agent never executes), Approval (agent produces a Resolution Plan and waits for human sign-off), Silent (agent executes immediately, every action surfaces in the Live Activity Stream with its Plan).
- Platform floors: $1,000 default wire threshold, 50-recipient comms cap, identity-class actions always require approval — customer-customisable but never disabled.
- Resolution Plan: 10-element artifact (summary, inputs, steps, pros, cons, complexity, cost, reversibility, confidence, alternatives) — required for every action.
- Live Activity Stream: always-on real-time view, like spectating an Age-of-Empires civilization run by AI agents.

Do NOT:
- Invent features that don't exist (the platform is in pre-launch; we have a wiki, a calculator, a builder demo, and decks — no live tenant runtime yet).
- Promise dates, SLAs, or customer references the wiki doesn't back.
- Use upselling language ("did you know Atlantis can also...").
- Refuse without offering an alternative ("I can't answer that, but here's where to find out").

Length: Two to four short paragraphs maximum unless the user asks for depth. Use bullets sparingly. When you cite a wiki page, format as: [Page Name](wiki.html#Page-Name).`;

    const pageContext = `Current page context: ${currentPage()}. Page label: ${pageContextLabel()}.`;

    let snapshotContext = '';
    if (State.snapshot) {
      const s = State.snapshot;
      snapshotContext = `\n\nThe user is on build.html and has just clicked "Activate my company". Their picks:
- Industry: ${s.industryName} (${s.industry})
- Size: ${s.sizeName} (${s.size})
- Jurisdiction: ${s.jurisdiction}
- Playbooks selected: ${s.playbookCount}
- Agents activated: ${s.agents.map(a => `${a.dept} (${a.mode})`).join(', ')}
- Hours/month saved: ${s.hoursPerMonth}
- Actions needing approval: ${s.approvalCount}
- Guardrails: $${s.guardrails.wire} wire, ${s.guardrails.comms} comms cap, ${s.guardrails.rate}/hr rate, $${s.guardrails.spend}/day spend cap

Your job in this conversation: produce a clear Resolution Plan for the company spin-up. Walk through what will happen step by step. Flag any concerns. Ask for confirmation before proceeding.`;
    }

    return persona + '\n\n' + pageContext + snapshotContext;
  }

  // ---------- Render ----------
  function renderGreeting() {
    bodyEl.innerHTML = '';
    if (!State.config.workerUrl) {
      const note = document.createElement('div');
      note.className = 'am-system-note';
      note.innerHTML = `Atlantis Manager is offline — the Cloudflare Worker URL isn't configured. To enable the live chat, deploy the worker per <a href="WORKER-SETUP.md">WORKER-SETUP.md</a> and set <code>window.ATLANTIS_MANAGER_CONFIG.workerUrl</code> on this page (or add <code>&lt;meta name="atlantis-manager-worker" content="https://your-worker.workers.dev"&gt;</code>).<br><br>You can still browse the catalog, customise picks, and explore the wiki — the rest of the experience works without me.`;
      bodyEl.appendChild(note);
    }

    const greet = document.createElement('div');
    greet.className = 'am-greet';
    const chipsHtml = greetingChips().map(c => `<button class="am-chip-suggest" type="button" data-suggest="${escapeAttr(c)}">${escape(c)}</button>`).join('');
    greet.innerHTML = `
      <div class="am-greet-title">${escape(greetingTitle())}</div>
      <div class="am-greet-sub">${escape(greetingSub())}</div>
      <div class="am-greet-chips">${chipsHtml}</div>
    `;
    bodyEl.appendChild(greet);
    greet.querySelectorAll('[data-suggest]').forEach(btn => {
      btn.addEventListener('click', () => {
        textareaEl.value = btn.dataset.suggest;
        autoResize();
        send();
      });
    });
  }

  function renderMessage(role, text, opts) {
    const wrap = document.createElement('div');
    wrap.className = `am-msg am-msg-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'am-bubble';
    bubble.innerHTML = renderMarkdown(text);
    wrap.appendChild(bubble);
    bodyEl.appendChild(wrap);
    if (opts && opts.id) bubble.id = opts.id;
    scrollToBottom();
    return bubble;
  }

  function renderTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'am-msg am-msg-assistant';
    wrap.id = 'am-typing';
    wrap.innerHTML = `<div class="am-bubble"><div class="am-typing"><span class="am-typing-dot"></span><span class="am-typing-dot"></span><span class="am-typing-dot"></span></div></div>`;
    bodyEl.appendChild(wrap);
    scrollToBottom();
  }

  function removeTyping() {
    const t = document.getElementById('am-typing');
    if (t) t.remove();
  }

  function renderError(message, hint) {
    const wrap = document.createElement('div');
    wrap.className = 'am-error';
    wrap.innerHTML = `<strong>Couldn't reach the Manager.</strong> ${escape(message)}${hint ? `<br><br>${hint}` : ''}`;
    bodyEl.appendChild(wrap);
    scrollToBottom();
  }

  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // ---------- Markdown rendering (minimal, safe) ----------
  function renderMarkdown(text) {
    // Escape first, then apply minimal markdown
    let out = escape(text);
    // Code blocks (single backtick)
    out = out.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    // Bold **text**
    out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    // Links [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
      const safeUrl = u.replace(/"/g, '%22');
      return `<a href="${safeUrl}" target="_blank" rel="noopener">${t}</a>`;
    });
    // Paragraphs (double newline) + line breaks
    const paras = out.split(/\n{2,}/).map(p => {
      // bullet list detection
      if (/^[-*]\s/.test(p.trim())) {
        const items = p.split('\n').map(l => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
        return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    });
    return paras.join('');
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }

  // ---------- Send ----------
  async function send() {
    const text = textareaEl.value.trim();
    if (!text || State.sending) return;
    textareaEl.value = '';
    autoResize();

    State.messages.push({ role: 'user', content: text });
    renderMessage('user', text);

    if (!State.config.workerUrl) {
      renderError('No worker URL configured.', 'Set <code>window.ATLANTIS_MANAGER_CONFIG.workerUrl</code> or add a meta tag, then refresh.');
      return;
    }

    State.sending = true;
    document.getElementById('am-send').disabled = true;
    renderTyping();

    try {
      const reply = await callWorker();
      removeTyping();
      State.messages.push({ role: 'assistant', content: reply });
      renderMessage('assistant', reply);
    } catch (err) {
      removeTyping();
      const msg = (err && err.message) || 'Unknown error.';
      let hint = 'Check the Cloudflare Worker logs and confirm <code>ANTHROPIC_API_KEY</code> is set.';
      if (/4\d\d/.test(msg)) {
        hint = 'The worker rejected the request. Confirm the Anthropic API key is valid and the model name is correct.';
      } else if (/5\d\d/.test(msg) || /failed to fetch/i.test(msg)) {
        hint = 'The worker is unreachable. Check the worker is deployed and the URL is correct.';
      }
      renderError(msg, hint);
    } finally {
      State.sending = false;
      document.getElementById('am-send').disabled = false;
    }
  }

  async function callWorker() {
    const body = {
      model: State.config.model,
      max_tokens: State.config.maxTokens,
      system: [
        // Prompt-cache the system layer; it changes rarely per session.
        { type: 'text', text: buildSystemPrompt(), cache_control: { type: 'ephemeral' } },
      ],
      messages: State.messages.map(m => ({ role: m.role, content: m.content })),
    };

    const res = await fetch(State.config.workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let detail = `Worker returned HTTP ${res.status}.`;
      try {
        const json = await res.json();
        if (json && json.error) detail += ` ${json.error}`;
        if (json && json.message) detail += ` ${json.message}`;
      } catch (_) {}
      throw new Error(detail);
    }

    const json = await res.json();
    // Anthropic Messages API response shape
    if (json && json.content && Array.isArray(json.content)) {
      const text = json.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
      if (text) return text;
    }
    if (json && typeof json.text === 'string') return json.text;
    if (json && typeof json.message === 'string') return json.message;
    throw new Error('Unexpected response shape from worker.');
  }

  // ---------- Open / close ----------
  function open() {
    State.open = true;
    panelEl.classList.add('am-panel-open');
    pillEl.style.display = 'none';
    setTimeout(() => textareaEl && textareaEl.focus(), 50);
  }
  function close() {
    State.open = false;
    panelEl.classList.remove('am-panel-open');
    pillEl.style.display = '';
  }
  function clearConversation() {
    State.messages = [];
    State.snapshot = null;
    renderGreeting();
  }

  // ---------- Public API ----------
  window.AtlantisManager = {
    open: () => open(),
    close: () => close(),
    send: (text) => {
      open();
      textareaEl.value = text;
      autoResize();
      send();
    },
    openWithSnapshot: (snapshot) => {
      State.snapshot = snapshot;
      open();
      const summary = `Activate my company. Picks: ${snapshot.playbookCount} playbooks across ${snapshot.agents.length} agents (${snapshot.agents.map(a => `${a.dept}=${a.mode}`).join(', ')}) for a ${snapshot.sizeName} ${snapshot.industryName} company in ${snapshot.jurisdiction.toUpperCase()}. Walk me through the Resolution Plan.`;
      textareaEl.value = summary;
      autoResize();
      send();
    },
    clearConversation: () => clearConversation(),
    isOpen: () => State.open,
  };

  document.addEventListener('DOMContentLoaded', mount);
})();
