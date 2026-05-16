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
    { id: 'sf',   cat: 'CRM',           name: 'Salesforce Sales Cloud',     vendor: 'salesforce.com', low: 60,  high: 840, note: '$25–350/seat/mo · ~20% of staff have seats', defaultsByTier: { md: true, en: true } },
    { id: 'hub',  cat: 'CRM',           name: 'HubSpot Sales Hub',          vendor: 'hubspot.com',    low: 36,  high: 360, note: '$15–150/seat/mo · ~20% seat coverage',       defaultsByTier: { sb: true } },

    // ===== HRIS =====
    { id: 'wd',   cat: 'HRIS',          name: 'Workday HCM',                vendor: 'workday.com',    low: 420, high: 1200, note: '$35–100/employee/mo · all employees',        defaultsByTier: { en: true } },
    { id: 'bh',   cat: 'HRIS',          name: 'BambooHR / Rippling',        vendor: 'bamboohr.com',   low: 96,  high: 300, note: '$8–25/employee/mo · all employees',          defaultsByTier: { sb: true, md: true } },

    // ===== Payroll =====
    { id: 'gst',  cat: 'Payroll',       name: 'Gusto / Justworks',          vendor: 'gusto.com',      low: 84,  high: 276, note: '$49 base + $6–22/employee/mo',               defaultsByTier: { sb: true, md: true } },
    { id: 'adp',  cat: 'Payroll',       name: 'ADP Workforce Now',          vendor: 'adp.com',        low: 276, high: 660, note: '$23–55/employee/mo · enterprise payroll',    defaultsByTier: { en: true } },

    // ===== Finance / ERP =====
    { id: 'qb',   cat: 'Finance / ERP', name: 'QuickBooks Online',          vendor: 'quickbooks.intuit.com', low: 12,  high: 80,  note: '$38–275/mo flat · diminishes per emp',  defaultsByTier: { sb: true } },
    { id: 'ns',   cat: 'Finance / ERP', name: 'NetSuite',                   vendor: 'netsuite.com',   low: 144, high: 360, note: '$999 base + $99–199/user/mo · ~10% seats',   defaultsByTier: { md: true, en: true } },
    { id: 'sage', cat: 'Finance / ERP', name: 'Sage Intacct',               vendor: 'sage.com',       low: 90,  high: 250, note: '$9–75K/yr · scales with users',              defaultsByTier: {} },

    // ===== Ticketing / Project Management =====
    { id: 'jira', cat: 'Ticketing / PM', name: 'Jira + Confluence',         vendor: 'atlassian.com',  low: 84,  high: 156, note: '$14–26/user/mo · ~50% coverage',             defaultsByTier: { sb: true, md: true, en: true } },
    { id: 'sn',   cat: 'Ticketing / PM', name: 'ServiceNow ITSM',           vendor: 'servicenow.com', low: 120, high: 300, note: '$100–200/fulfiller/mo · ~10% fulfillers',    defaultsByTier: { en: true } },
    { id: 'lin',  cat: 'Ticketing / PM', name: 'Linear / Asana',            vendor: 'linear.app',     low: 36,  high: 120, note: '$8–45/user/mo · project teams',              defaultsByTier: { sb: true, md: true } },

    // ===== Customer Support =====
    { id: 'zd',   cat: 'Customer Support', name: 'Zendesk Suite',           vendor: 'zendesk.com',    low: 33,  high: 120, note: '$55–169/agent/mo · ~5% agents',              defaultsByTier: { md: true, en: true } },
    { id: 'ic',   cat: 'Customer Support', name: 'Intercom',                vendor: 'intercom.com',   low: 30,  high: 110, note: '$29–132/seat/mo · ~5% seats',                defaultsByTier: { sb: true } },

    // ===== Marketing =====
    { id: 'hubm', cat: 'Marketing',     name: 'HubSpot Marketing Hub',      vendor: 'hubspot.com',    low: 60,  high: 360, note: 'Starter to Enterprise flat tiers',           defaultsByTier: { sb: true, md: true } },
    { id: 'mkto', cat: 'Marketing',     name: 'Marketo Engage',             vendor: 'business.adobe.com', low: 240, high: 1200, note: '$1.5K–50K/mo · scales by DB size',        defaultsByTier: { en: true } },

    // ===== Productivity / Communication =====
    { id: 'm365', cat: 'Productivity',  name: 'Microsoft 365 / Workspace',  vendor: 'microsoft.com',  low: 96,  high: 360, note: '$8–30/user/mo · all employees',              defaultsByTier: { sb: true, md: true, en: true } },
    { id: 'slk',  cat: 'Productivity',  name: 'Slack / Teams',              vendor: 'slack.com',      low: 87,  high: 336, note: '$7.25–28/user/mo · all employees',           defaultsByTier: { sb: true, md: true, en: true } },

    // ===== Legal / Contract =====
    { id: 'ds',   cat: 'Legal',         name: 'DocuSign',                   vendor: 'docusign.com',   low: 36,  high: 144, note: '$10–40/user/mo · ~30% coverage',             defaultsByTier: { md: true, en: true } },
    { id: 'iron', cat: 'Legal',         name: 'Ironclad CLM',               vendor: 'ironclad.com',   low: 60,  high: 400, note: '$80–400K/yr enterprise quote',               defaultsByTier: { en: true } },

    // ===== Recruiting =====
    { id: 'gh',   cat: 'Recruiting',    name: 'Greenhouse / Lever',         vendor: 'greenhouse.io', low: 30,  high: 200, note: '$6.5K–144K/yr · scales by headcount',         defaultsByTier: { md: true, en: true } },

    // ===== Data / Integration =====
    { id: 'snow', cat: 'Data',          name: 'Snowflake / BigQuery + ETL', vendor: 'snowflake.com',  low: 120, high: 500, note: '$24K–700K/yr consumption',                   defaultsByTier: { en: true } },
    { id: 'ipaas', cat: 'Data',         name: 'Workato / MuleSoft (iPaaS)', vendor: 'workato.com',    low: 60,  high: 500, note: '$15K–200K/yr · integration tax',             defaultsByTier: { md: true, en: true } },

    // ===== Hidden costs =====
    { id: 'consult', cat: 'Hidden costs', name: 'Implementation consultants', vendor: '',             low: 80,  high: 300, note: 'One-time + ongoing config / training',       defaultsByTier: { md: true, en: true } },
    { id: 'admin',   cat: 'Hidden costs', name: 'Internal SaaS admin / IT',  vendor: '',              low: 120, high: 400, note: 'Salary load for tool ownership',             defaultsByTier: { md: true, en: true } },
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

  // ----- State -----
  const state = {
    employees: 200,
    enabled: new Set(),
  };

  // ----- Format -----
  function fmtK(n) {
    // Compact: $30K, $1.2M, $1.6M etc.
    if (n >= 1000) return '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'M';
    return '$' + Math.round(n) + 'K';
  }

  // ----- Compute -----
  function compute() {
    let lowAnnual = 0, highAnnual = 0;
    const breakdown = {};
    TOOLS.forEach((t) => {
      if (!state.enabled.has(t.id)) return;
      const l = t.low * state.employees;
      const h = t.high * state.employees;
      lowAnnual += l;
      highAnnual += h;
      breakdown[t.cat] = (breakdown[t.cat] || 0) + (l + h) / 2;
    });
    const atlantis = atlantisPriceK(state.employees) * 1000;
    return {
      lowAnnual,
      highAnnual,
      atlantisAnnual: atlantis,
      savingsLow: Math.max(0, lowAnnual - atlantis),
      savingsHigh: Math.max(0, highAnnual - atlantis),
      breakdown,
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

  function renderOutput() {
    const r = compute();
    el('#calc-current-amount').textContent =
      `${fmtK(r.lowAnnual / 1000)} – ${fmtK(r.highAnnual / 1000)}`;
    el('#calc-atlantis-amount').textContent =
      `${fmtK(r.atlantisAnnual / 1000)}`;
    el('#calc-atlantis-tier').textContent = atlantisTierName(state.employees);
    el('#calc-savings-amount').textContent =
      `${fmtK(r.savingsLow / 1000)} – ${fmtK(r.savingsHigh / 1000)}`;

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
  }

  function applyPreset(tier) {
    state.enabled.clear();
    TOOLS.forEach((t) => {
      if (t.defaultsByTier && t.defaultsByTier[tier]) state.enabled.add(t.id);
    });
    if (tier === 'sb') setEmployees(25);
    if (tier === 'md') setEmployees(200);
    if (tier === 'en') setEmployees(2000);
    renderTools();
    renderOutput();

    els('.calc-preset').forEach((b) => b.classList.toggle('active', b.getAttribute('data-tier') === tier));
  }

  function setEmployees(n) {
    state.employees = Math.max(5, Math.min(10000, Math.round(n)));
    const slider = el('#calc-emp-slider');
    const out = el('#calc-emp-value');
    const input = el('#calc-emp-input');
    if (slider) slider.value = state.employees;
    if (out) out.textContent = `${state.employees.toLocaleString()} people`;
    if (input && document.activeElement !== input) input.value = state.employees;
    renderOutput();

    // Auto-deactivate preset buttons if the slider drifts off
    els('.calc-preset').forEach((b) => {
      const target = parseInt(b.getAttribute('data-employees'), 10);
      b.classList.toggle('active', target === state.employees);
    });
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
