/* =========================================================
   Atlantis — Stack cost calculator
   Estimates current SaaS spend vs. Atlantis pricing.
   Pricing data is published list prices as of 2026-05;
   Vendr / Spendhound / G2 buyer benchmarks used where vendors
   are quote-only (Workday, ServiceNow, NetSuite, Ironclad, etc.).
   ========================================================= */

(function () {
  'use strict';

  /**
   * Each tool produces a (low, high) range expressed as $/employee/year.
   * "Coverage" notes explain how the per-emp number was derived from per-
   * seat list price (e.g. CRM seats are ~20% of headcount).
   *
   * defaultsByTier marks which presets enable this tool by default.
   *   sb = startup, md = medium, en = enterprise
   */
  const TOOLS = [
    // ===== CRM =====
    { id: 'sf',     cat: 'CRM',           name: 'Salesforce Sales Cloud',     vendor: 'salesforce.com',         low: 60,  high: 840,  note: '$25–350/seat/mo · ~20% staff have seats',     defaultsByTier: { md: true, en: true } },
    { id: 'hub',    cat: 'CRM',           name: 'HubSpot Sales Hub',          vendor: 'hubspot.com',            low: 36,  high: 360,  note: '$15–150/seat/mo · ~20% seat coverage',        defaultsByTier: { sb: true } },
    { id: 'zcrm',   cat: 'CRM',           name: 'Zoho CRM',                   vendor: 'zoho.com',               low: 34,  high: 96,   note: '$14–40/seat/mo · SMB pick',                   defaultsByTier: {} },
    { id: 'pd',     cat: 'CRM',           name: 'Pipedrive',                  vendor: 'pipedrive.com',          low: 34,  high: 120,  note: '$14–50/seat/mo · sales-team focused',         defaultsByTier: {} },

    // ===== HRIS =====
    { id: 'wd',     cat: 'HRIS',          name: 'Workday HCM',                vendor: 'workday.com',            low: 420, high: 1200, note: '$35–100/employee/mo · all employees',         defaultsByTier: { en: true } },
    { id: 'bh',     cat: 'HRIS',          name: 'BambooHR / Rippling',        vendor: 'bamboohr.com',           low: 96,  high: 300,  note: '$8–25/employee/mo · all employees',           defaultsByTier: { sb: true, md: true } },

    // ===== Payroll =====
    { id: 'gst',    cat: 'Payroll',       name: 'Gusto / Justworks',          vendor: 'gusto.com',              low: 84,  high: 276,  note: '$49 base + $6–22/employee/mo',                defaultsByTier: { sb: true, md: true } },
    { id: 'adp',    cat: 'Payroll',       name: 'ADP Workforce Now',          vendor: 'adp.com',                low: 276, high: 660,  note: '$23–55/employee/mo · enterprise payroll',     defaultsByTier: { en: true } },

    // ===== Finance / ERP =====
    { id: 'qb',     cat: 'Finance / ERP', name: 'QuickBooks Online',          vendor: 'quickbooks.intuit.com',  low: 12,  high: 80,   note: '$38–275/mo flat · SMB accounting',            defaultsByTier: { sb: true } },
    { id: 'xero',   cat: 'Finance / ERP', name: 'Xero',                       vendor: 'xero.com',               low: 8,   high: 60,   note: '$29–69/mo flat · global SMB',                 defaultsByTier: {} },
    { id: 'ns',     cat: 'Finance / ERP', name: 'NetSuite',                   vendor: 'netsuite.com',           low: 144, high: 360,  note: '$999 base + $99–199/user/mo · ~10% seats',    defaultsByTier: { md: true, en: true } },
    { id: 'sage',   cat: 'Finance / ERP', name: 'Sage Intacct',               vendor: 'sage.com',               low: 90,  high: 250,  note: '$9–75K/yr · scales with users',               defaultsByTier: {} },

    // ===== Ticketing / Project Management =====
    { id: 'jira',   cat: 'Ticketing / PM', name: 'Jira + Confluence',         vendor: 'atlassian.com',          low: 84,  high: 156,  note: '$14–26/user/mo · ~50% coverage',              defaultsByTier: { sb: true, md: true, en: true } },
    { id: 'sn',     cat: 'Ticketing / PM', name: 'ServiceNow ITSM',           vendor: 'servicenow.com',         low: 120, high: 300,  note: '$100–200/fulfiller/mo · ~10% fulfillers',     defaultsByTier: { en: true } },
    { id: 'lin',    cat: 'Ticketing / PM', name: 'Linear / Asana',            vendor: 'linear.app',             low: 36,  high: 120,  note: '$8–45/user/mo · project teams',               defaultsByTier: { sb: true, md: true } },
    { id: 'clk',    cat: 'Ticketing / PM', name: 'ClickUp',                   vendor: 'clickup.com',            low: 28,  high: 76,   note: '$7–19/user/mo · ~40% coverage',               defaultsByTier: {} },
    { id: 'notion', cat: 'Ticketing / PM', name: 'Notion (docs + projects)',  vendor: 'notion.so',              low: 60,  high: 130,  note: '$10–18/user/mo · ~50% coverage',              defaultsByTier: {} },

    // ===== Customer Support =====
    { id: 'zd',     cat: 'Customer Support', name: 'Zendesk Suite',           vendor: 'zendesk.com',            low: 33,  high: 120,  note: '$55–169/agent/mo · ~5% agents',               defaultsByTier: { md: true, en: true } },
    { id: 'ic',     cat: 'Customer Support', name: 'Intercom',                vendor: 'intercom.com',           low: 30,  high: 110,  note: '$29–132/seat/mo · ~5% seats',                 defaultsByTier: { sb: true } },
    { id: 'fd',     cat: 'Customer Support', name: 'Freshdesk',               vendor: 'freshworks.com',         low: 9,   high: 30,   note: '$15–49/agent/mo · ~5% agents',                defaultsByTier: {} },
    { id: 'hs',     cat: 'Customer Support', name: 'Help Scout',              vendor: 'helpscout.com',          low: 13,  high: 26,   note: '$22–44/user/mo · ~5% agents',                 defaultsByTier: {} },

    // ===== Marketing =====
    { id: 'hubm',   cat: 'Marketing',     name: 'HubSpot Marketing Hub',      vendor: 'hubspot.com',            low: 60,  high: 360,  note: 'Starter to Enterprise flat tiers',            defaultsByTier: { md: true } },
    { id: 'mkto',   cat: 'Marketing',     name: 'Marketo Engage',             vendor: 'business.adobe.com',     low: 240, high: 1200, note: '$1.5K–50K/mo · scales by DB size',            defaultsByTier: { en: true } },
    { id: 'mc',     cat: 'Marketing',     name: 'Mailchimp',                  vendor: 'mailchimp.com',          low: 6,   high: 60,   note: '$13–350/mo flat · by list size',              defaultsByTier: { sb: true } },
    { id: 'brevo',  cat: 'Marketing',     name: 'Brevo (Sendinblue)',         vendor: 'brevo.com',              low: 5,   high: 40,   note: '$9–69/mo flat · by send volume',              defaultsByTier: {} },

    // ===== Productivity / Communication =====
    { id: 'm365',   cat: 'Productivity',  name: 'Microsoft 365 / Google Workspace', vendor: 'microsoft.com',    low: 96,  high: 360,  note: '$8–30/user/mo · all employees',               defaultsByTier: { sb: true, md: true, en: true } },
    { id: 'slk',    cat: 'Productivity',  name: 'Slack / Teams',              vendor: 'slack.com',              low: 87,  high: 336,  note: '$7.25–28/user/mo · all employees',            defaultsByTier: { sb: true, md: true, en: true } },
    { id: 'zwk',    cat: 'Productivity',  name: 'Zoho Workplace',             vendor: 'zoho.com',               low: 36,  high: 108,  note: '$3–9/user/mo · SMB office suite',             defaultsByTier: {} },

    // ===== Legal / E-sign =====
    { id: 'ds',     cat: 'Legal',         name: 'DocuSign',                   vendor: 'docusign.com',           low: 36,  high: 144,  note: '$10–40/user/mo · ~30% coverage',              defaultsByTier: { md: true, en: true } },
    { id: 'pd2',    cat: 'Legal',         name: 'PandaDoc',                   vendor: 'pandadoc.com',           low: 68,  high: 176,  note: '$19–49/user/mo · ~30% coverage',              defaultsByTier: {} },
    { id: 'dsign',  cat: 'Legal',         name: 'Dropbox Sign',               vendor: 'sign.dropbox.com',       low: 54,  high: 90,   note: '$15–25/user/mo · ~30% coverage',              defaultsByTier: { sb: true } },
    { id: 'iron',   cat: 'Legal',         name: 'Ironclad CLM',               vendor: 'ironclad.com',           low: 60,  high: 400,  note: '$80–400K/yr enterprise CLM',                  defaultsByTier: { en: true } },

    // ===== Recruiting =====
    { id: 'gh',     cat: 'Recruiting',    name: 'Greenhouse / Lever',         vendor: 'greenhouse.io',          low: 30,  high: 200,  note: '$6.5K–144K/yr · scales with hires',           defaultsByTier: { md: true, en: true } },
    { id: 'wkbl',   cat: 'Recruiting',    name: 'Workable',                   vendor: 'workable.com',           low: 20,  high: 80,   note: '$149–599/mo flat · SMB ATS',                  defaultsByTier: { sb: true } },

    // ===== Data / Integration =====
    { id: 'snow',   cat: 'Data / Integration', name: 'Snowflake / BigQuery + ETL', vendor: 'snowflake.com',     low: 120, high: 500,  note: '$24K–700K/yr consumption',                    defaultsByTier: { en: true } },
    { id: 'ipaas',  cat: 'Data / Integration', name: 'Workato / MuleSoft (iPaaS)', vendor: 'workato.com',       low: 60,  high: 500,  note: '$15K–200K/yr · enterprise integration',       defaultsByTier: { md: true, en: true } },
    { id: 'zap',    cat: 'Data / Integration', name: 'Zapier / Make.com',     vendor: 'zapier.com',             low: 5,   high: 24,   note: '$20–69/mo flat · SMB automation',             defaultsByTier: { sb: true } },

    // ===== Hidden costs =====
    { id: 'consult', cat: 'Hidden costs', name: 'Implementation consultants',  vendor: '',                      low: 80,  high: 300,  note: 'One-time + ongoing config / training',        defaultsByTier: { md: true, en: true } },
    { id: 'admin',   cat: 'Hidden costs', name: 'Internal SaaS admin / IT',    vendor: '',                      low: 120, high: 400,  note: 'Salary load for tool ownership',              defaultsByTier: { md: true, en: true } },
  ];

  // Atlantis published pricing tiers (USD / year)
  function atlantisPriceK(emp) {
    if (emp < 50) return 30;
    if (emp < 250) return 90;
    if (emp < 1000) return 250;
    return 400;
  }
  function atlantisTierName(emp) {
    if (emp < 50) return 'Starter';
    if (emp < 250) return 'Growth';
    if (emp < 1000) return 'Enterprise';
    return 'Enterprise (Regulated)';
  }

  /**
   * Departments covered by Atlantis. Each:
   *   - emoji: visual cue in the row
   *   - loadedSalary: blended US fully-loaded comp ($1.3× base on average)
   *                   reflecting realistic mid-level mix per dept.
   *                   Engineering and Legal trend higher; HR/Finance lower.
   *   - shareByTier: typical % of total headcount per company size,
   *                  from B2B SaaS benchmarks (ICONIQ, OpenView, SHRM,
   *                  BLS OEWS, ACC 2024 Legal Benchmarking, APQC Finance).
   *                  Used to seed defaults; user can edit each row.
   */
  const DEPARTMENTS = [
    { id: 'hr',     name: 'HR / People',           emoji: '👥', loadedSalary: 156000, shareByTier: { sb: 0.04, md: 0.020, en: 0.010 } },
    { id: 'fin',    name: 'Finance / Accounting',  emoji: '💼', loadedSalary: 137000, shareByTier: { sb: 0.04, md: 0.020, en: 0.010 } },
    { id: 'sales',  name: 'Sales',                 emoji: '💰', loadedSalary: 169000, shareByTier: { sb: 0.20, md: 0.300, en: 0.250 } },
    { id: 'mkt',    name: 'Marketing',             emoji: '📣', loadedSalary: 169000, shareByTier: { sb: 0.08, md: 0.050, en: 0.040 } },
    { id: 'legal',  name: 'Legal',                 emoji: '⚖️', loadedSalary: 286000, shareByTier: { sb: 0.00, md: 0.005, en: 0.005 } },
    { id: 'ops',    name: 'Operations / Support',  emoji: '⚙️', loadedSalary: 150000, shareByTier: { sb: 0.16, md: 0.200, en: 0.200 } },
    { id: 'eng',    name: 'Engineering / Dev',     emoji: '💻', loadedSalary: 260000, shareByTier: { sb: 0.40, md: 0.250, en: 0.250 } },
  ];

  function tierFromEmployees(emp) {
    if (emp < 50) return 'sb';
    if (emp < 500) return 'md';
    return 'en';
  }
  function defaultHeadcount(deptId, emp) {
    const dept = DEPARTMENTS.find((d) => d.id === deptId);
    if (!dept) return 0;
    const tier = tierFromEmployees(emp);
    return Math.max(0, Math.round(emp * dept.shareByTier[tier]));
  }

  // ----- State -----
  const state = {
    employees: 200,
    enabled: new Set(),
    teamHeadcount: {},        // { deptId: count } — null means user hasn't overridden
    teamOverridden: {},       // { deptId: true } if user has manually edited
    productivityGain: 0.15,   // 15% default — McKinsey/Gartner consensus for AI-augmented teams
  };

  // ----- Format -----
  function fmtK(n) {
    // n is in $K. Compact: $30K, $1.2M, $16M etc.
    if (n >= 1000) return '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'M';
    return '$' + Math.round(n) + 'K';
  }

  // ----- Compute -----
  function headcountFor(deptId) {
    if (state.teamOverridden[deptId] && state.teamHeadcount[deptId] != null) {
      return state.teamHeadcount[deptId];
    }
    return defaultHeadcount(deptId, state.employees);
  }

  function compute() {
    // === SaaS stack ===
    let saasLow = 0, saasHigh = 0;
    const breakdown = {};
    TOOLS.forEach((t) => {
      if (!state.enabled.has(t.id)) return;
      const l = t.low * state.employees;
      const h = t.high * state.employees;
      saasLow += l;
      saasHigh += h;
      breakdown[t.cat] = (breakdown[t.cat] || 0) + (l + h) / 2;
    });

    // === Team payroll ===
    let payroll = 0;
    const teamBreakdown = {};
    let totalHeadcount = 0;
    DEPARTMENTS.forEach((d) => {
      const hc = headcountFor(d.id);
      const cost = hc * d.loadedSalary;
      payroll += cost;
      teamBreakdown[d.name] = cost;
      totalHeadcount += hc;
    });

    // === Atlantis ===
    const atlantis = atlantisPriceK(state.employees) * 1000;
    const leanerPayroll = payroll * (1 - state.productivityGain);

    // === Run rates ===
    // Today: SaaS (mid-point of range) + payroll
    // With Atlantis: Atlantis fee + leaner payroll
    // (Treats Atlantis as a swap-in for the SaaS bill — same framing as before.
    //  Footnote acknowledges customers keep systems of record in practice.)
    const todayLow = saasLow + payroll;
    const todayHigh = saasHigh + payroll;
    const atlantisTotal = atlantis + leanerPayroll;
    const valueLow = Math.max(0, todayLow - atlantisTotal);
    const valueHigh = Math.max(0, todayHigh - atlantisTotal);

    return {
      saasLow, saasHigh, atlantis,
      payroll, leanerPayroll, totalHeadcount,
      todayLow, todayHigh, atlantisTotal,
      valueLow, valueHigh,
      breakdown, teamBreakdown,
    };
  }

  // ----- DOM -----
  function el(sel, root) { return (root || document).querySelector(sel); }
  function els(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function renderTools() {
    const root = el('#calc-tools');
    if (!root) return;
    // Group by category
    const byCat = {};
    TOOLS.forEach((t) => { (byCat[t.cat] = byCat[t.cat] || []).push(t); });

    const html = Object.keys(byCat).map((cat) => `
      <div class="calc-cat">
        <div class="calc-cat-label">${cat}</div>
        <div class="calc-cat-tools">
          ${byCat[cat].map((t) => `
            <label class="calc-tool" data-id="${t.id}">
              <input type="checkbox" data-id="${t.id}" ${state.enabled.has(t.id) ? 'checked' : ''} />
              <div class="calc-tool-body">
                <div class="calc-tool-name">${t.name}</div>
                <div class="calc-tool-note">${t.note}</div>
              </div>
              <div class="calc-tool-cost">$${t.low}–${t.high}<span>/emp/yr</span></div>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
    root.innerHTML = html;

    // Wire checkbox toggles
    els('input[type="checkbox"][data-id]', root).forEach((cb) => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-id');
        if (cb.checked) state.enabled.add(id);
        else state.enabled.delete(id);
        cb.closest('.calc-tool').classList.toggle('on', cb.checked);
        renderOutput();
      });
      cb.closest('.calc-tool').classList.toggle('on', cb.checked);
    });
  }

  function renderTeam() {
    const root = el('#calc-team');
    if (!root) return;
    const html = DEPARTMENTS.map((d) => {
      const hc = headcountFor(d.id);
      const cost = hc * d.loadedSalary;
      return `
        <div class="calc-dept" data-id="${d.id}">
          <div class="calc-dept-name">
            <span class="calc-dept-emoji">${d.emoji}</span>
            <span>${d.name}</span>
          </div>
          <div class="calc-dept-count">
            <input type="number" class="calc-dept-input" data-id="${d.id}" min="0" max="2000" step="1" value="${hc}" />
            <span class="calc-dept-suffix">people</span>
          </div>
          <div class="calc-dept-salary">$${(d.loadedSalary / 1000).toFixed(0)}K<span>/yr · fully-loaded</span></div>
          <div class="calc-dept-cost" data-cost-for="${d.id}">${fmtK(cost / 1000)}<span>/yr</span></div>
        </div>
      `;
    }).join('');
    root.innerHTML = html;

    els('.calc-dept-input', root).forEach((input) => {
      input.addEventListener('input', (e) => {
        const id = e.target.getAttribute('data-id');
        const v = parseInt(e.target.value, 10);
        if (Number.isNaN(v)) return;
        state.teamHeadcount[id] = Math.max(0, Math.min(2000, v));
        state.teamOverridden[id] = true;
        const dept = DEPARTMENTS.find((d) => d.id === id);
        const cost = state.teamHeadcount[id] * dept.loadedSalary;
        const cell = root.querySelector(`[data-cost-for="${id}"]`);
        if (cell) cell.innerHTML = `${fmtK(cost / 1000)}<span>/yr</span>`;
        renderOutput();
      });
    });
  }

  function clearTeamOverrides() {
    state.teamHeadcount = {};
    state.teamOverridden = {};
  }

  function renderOutput() {
    const r = compute();

    // ===== SaaS-only comparison (Card row 1) =====
    el('#calc-current-amount').textContent =
      `${fmtK(r.saasLow / 1000)} – ${fmtK(r.saasHigh / 1000)}`;
    el('#calc-atlantis-amount').textContent =
      `${fmtK(r.atlantis / 1000)}`;
    el('#calc-atlantis-tier').textContent = atlantisTierName(state.employees);
    el('#calc-savings-amount').textContent =
      `${fmtK(Math.max(0, r.saasLow - r.atlantis) / 1000)} – ${fmtK(Math.max(0, r.saasHigh - r.atlantis) / 1000)}`;

    // Breakdown
    const bk = el('#calc-breakdown');
    if (bk) {
      const cats = Object.keys(r.breakdown);
      if (cats.length === 0) {
        bk.innerHTML = '<span class="calc-breakdown-empty">No tools selected. Pick at least one to see your stack.</span>';
      } else {
        cats.sort((a, b) => r.breakdown[b] - r.breakdown[a]);
        bk.innerHTML = cats.map((c) =>
          `<span class="calc-breakdown-chip">${c} <strong>${fmtK(r.breakdown[c] / 1000)}</strong></span>`
        ).join('');
      }
    }

    // ===== Total run rate (Card row 2 — SaaS + Payroll) =====
    setText('#calc-rr-today',     `${fmtK(r.todayLow / 1000)} – ${fmtK(r.todayHigh / 1000)}`);
    setText('#calc-rr-today-saas',    `${fmtK(r.saasLow / 1000)} – ${fmtK(r.saasHigh / 1000)}`);
    setText('#calc-rr-today-pay',     `${fmtK(r.payroll / 1000)}`);

    setText('#calc-rr-atlantis', `${fmtK(r.atlantisTotal / 1000)}`);
    setText('#calc-rr-at-atlantis',   `${fmtK(r.atlantis / 1000)}`);
    setText('#calc-rr-at-pay',        `${fmtK(r.leanerPayroll / 1000)}`);

    setText('#calc-rr-value',    `${fmtK(r.valueLow / 1000)} – ${fmtK(r.valueHigh / 1000)}`);
    setText('#calc-rr-headcount', `${r.totalHeadcount.toLocaleString()} people across the 7 departments`);
    setText('#calc-rr-leaner',   `${Math.round(state.productivityGain * 100)}% leaner team`);
    setText('#calc-prod-value',  `${Math.round(state.productivityGain * 100)}%`);
  }

  function setText(sel, value) {
    const node = el(sel);
    if (node) node.textContent = value;
  }

  function applyPreset(tier) {
    state.enabled.clear();
    TOOLS.forEach((t) => {
      if (t.defaultsByTier && t.defaultsByTier[tier]) state.enabled.add(t.id);
    });
    clearTeamOverrides();
    if (tier === 'sb') setEmployees(25, /*skipReset*/ true);
    if (tier === 'md') setEmployees(200, true);
    if (tier === 'en') setEmployees(2000, true);
    renderTools();
    renderTeam();
    renderOutput();

    els('.calc-preset').forEach((b) => b.classList.toggle('active', b.getAttribute('data-tier') === tier));
  }

  function setEmployees(n, skipReset) {
    state.employees = Math.max(5, Math.min(2000, Math.round(n)));
    // Sliding the employee count blows away team overrides so defaults rescale
    if (!skipReset) clearTeamOverrides();
    const slider = el('#calc-emp-slider');
    const out = el('#calc-emp-value');
    const input = el('#calc-emp-input');
    if (slider) slider.value = state.employees;
    if (out) out.textContent = `${state.employees.toLocaleString()} people`;
    if (input && document.activeElement !== input) input.value = state.employees;
    renderTeam();
    renderOutput();

    // Auto-deactivate preset buttons if the slider drifts off
    els('.calc-preset').forEach((b) => {
      const target = parseInt(b.getAttribute('data-employees'), 10);
      b.classList.toggle('active', target === state.employees);
    });
  }

  function setProductivityGain(pct) {
    state.productivityGain = Math.max(0, Math.min(0.5, pct / 100));
    const slider = el('#calc-prod-slider');
    if (slider && parseInt(slider.value, 10) !== Math.round(state.productivityGain * 100)) {
      slider.value = Math.round(state.productivityGain * 100);
    }
    renderOutput();
  }

  function wire() {
    const slider = el('#calc-emp-slider');
    const input = el('#calc-emp-input');
    if (slider) slider.addEventListener('input', (e) => setEmployees(parseInt(e.target.value, 10)));
    if (input) input.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      if (!Number.isNaN(v)) setEmployees(v);
    });
    els('.calc-preset').forEach((b) =>
      b.addEventListener('click', () => applyPreset(b.getAttribute('data-tier')))
    );
    const prodSlider = el('#calc-prod-slider');
    if (prodSlider) {
      prodSlider.addEventListener('input', (e) => setProductivityGain(parseInt(e.target.value, 10)));
    }
    const resetTeam = el('#calc-team-reset');
    if (resetTeam) {
      resetTeam.addEventListener('click', (e) => {
        e.preventDefault();
        clearTeamOverrides();
        renderTeam();
        renderOutput();
      });
    }
  }

  function init() {
    const root = el('#calc');
    if (!root) return;
    wire();
    // Default preset: Medium (200 employees)
    applyPreset('md');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
