/* ==========================================================================
   Vishwa Vijaysheel — Portfolio
   ========================================================================== */

/* ── Theme toggle (persisted, shared across pages) ───────────────────── */
(function () {
  function syncToggles(dark) {
    document.querySelectorAll('.theme-checkbox').forEach(cb => { cb.checked = dark; });
  }
  const saved = localStorage.getItem('theme');
  const dark = saved === 'dark';
  if (dark) document.body.classList.add('dark');
  syncToggles(dark);
  document.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('theme-checkbox')) {
      const isDark = e.target.checked;
      document.body.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      syncToggles(isDark);
    }
  });
})();

/* ── Mobile nav ────────────────────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── Scroll-reveal (generic) ──────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.timeline-item, .dash-card, .post-row, .post-featured');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach((el, i) => { el.style.transitionDelay = (i % 6) * 0.05 + 's'; io.observe(el); });
})();

/* ── Hero terminal: types out a single SQL "self-query" once ─────────── */
(function () {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const script = [
    { type: 'line', prompt: '~', text: 'run --profile vishwa' },
    { type: 'out', text: 'connecting to career_history…' },
    { type: 'line', prompt: 'sql', kw: 'SELECT', rest: ' clarity' },
    { type: 'line', prompt: '', kw: 'FROM', rest: ' chaos' },
    { type: 'line', prompt: '', kw: 'WHERE', rest: ' signal > noise' },
    { type: 'line', prompt: '', kw: 'ORDER BY', rest: ' impact DESC;' },
    { type: 'out', text: '5 rows in 0.09s — see below ↓' },
  ];

  let cursorHost;

  function typeText(el, text, speed, done) {
    let i = 0;
    (function step() {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(step, speed);
      } else if (done) done();
    })();
  }

  function runScript(idx) {
    if (idx >= script.length) {
      if (cursorHost) {
        const c = document.createElement('span');
        c.className = 'cursor';
        cursorHost.appendChild(c);
      }
      return;
    }
    const item = script[idx];
    const row = document.createElement('div');

    if (item.type === 'out') {
      row.className = 'terminal-out';
      body.appendChild(row);
      typeText(row, item.text, 14, () => setTimeout(() => runScript(idx + 1), 220));
      return;
    }

    row.className = 'terminal-line';
    const promptEl = document.createElement('span');
    promptEl.className = 'prompt';
    promptEl.textContent = item.prompt || ' ';
    const codeEl = document.createElement('span');
    row.appendChild(promptEl);
    row.appendChild(codeEl);
    body.appendChild(row);
    cursorHost = row;

    if (item.kw) {
      const kwSpan = document.createElement('span');
      kwSpan.className = 'code-kw';
      codeEl.appendChild(kwSpan);
      const restSpan = document.createElement('span');
      restSpan.className = 'code-str';
      codeEl.appendChild(restSpan);
      typeText(kwSpan, item.kw, 26, () => {
        typeText(restSpan, item.rest, 20, () => setTimeout(() => runScript(idx + 1), 160));
      });
    } else {
      typeText(codeEl, item.text || '', 20, () => setTimeout(() => runScript(idx + 1), 160));
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { runScript(0); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(body);
})();

/* ── Hero role cycler ──────────────────────────────────────────────── */
(function () {
  const roles = document.querySelectorAll('.hero-role');
  if (!roles.length) return;
  let idx = 0;
  setInterval(() => {
    roles[idx].classList.remove('active');
    idx = (idx + 1) % roles.length;
    roles[idx].classList.add('active');
  }, 2400);
})();

/* ── Skills matrix ─────────────────────────────────────────────────── */
const SKILLS = [
  { name: 'SQL', pct: 92, cat: 'lang' },
  { name: 'Python', pct: 78, cat: 'lang' },
  { name: 'DAX', pct: 88, cat: 'lang' },
  { name: 'M Query', pct: 82, cat: 'lang' },
  { name: 'R', pct: 75, cat: 'lang' },
  { name: 'Power BI', pct: 95, cat: 'viz' },
  { name: 'Tableau', pct: 80, cat: 'viz' },
  { name: 'Excel', pct: 93, cat: 'viz' },
  { name: 'R Shiny', pct: 70, cat: 'viz' },
  { name: 'MS Fabric', pct: 85, cat: 'platform' },
  { name: 'SharePoint', pct: 80, cat: 'platform' },
  { name: 'SAP Ariba', pct: 72, cat: 'platform' },
  { name: 'Azure', pct: 68, cat: 'platform' },
  { name: 'Data Modelling', pct: 90, cat: 'method' },
  { name: 'ETL Pipelines', pct: 85, cat: 'method' },
  { name: 'Statistical Analysis', pct: 78, cat: 'method' },
  { name: 'Process Automation', pct: 82, cat: 'method' },
];

const SKILL_CATEGORY_LABELS = { lang: 'Languages', viz: 'Visualisation', platform: 'Platforms', method: 'Methods' };
const SKILL_CATEGORY_ORDER = ['lang', 'viz', 'platform', 'method'];

function injectSkillDonutStyles() {
  if (document.getElementById('skillDonutStyles')) return;
  const style = document.createElement('style');
  style.id = 'skillDonutStyles';
  style.textContent = `
    .skill-donut { display:flex; flex-direction:column; align-items:center; gap:1.5rem; padding:1rem 0 0.5rem; }
    .skill-donut-chart { position:relative; width:100%; max-width:440px; }
    .skill-donut-svg { width:100%; height:auto; overflow:visible; }

    .skill-donut-cat-group { cursor:pointer; outline:none; }

    .skill-donut-cat-arc {
      opacity:0;
      transform:scale(0.001);
      transform-box:fill-box;
      transform-origin:center;
      transition:transform .6s cubic-bezier(.2,.8,.2,1), opacity .45s ease, filter .2s ease;
      stroke:var(--bg, #fff);
      stroke-width:1.5;
    }
    .skill-donut-cat-arc.visible { opacity:0.92; transform:scale(1); }
    .skill-donut-cat-group:hover .skill-donut-cat-arc.visible,
    .skill-donut-cat-group.active .skill-donut-cat-arc.visible,
    .skill-donut-cat-group:focus-visible .skill-donut-cat-arc.visible { opacity:1; filter:brightness(1.1); }

    .skill-donut-skill-arc {
      opacity:0;
      transform:scale(0.001);
      transform-box:fill-box;
      transform-origin:center;
      transition:transform .4s cubic-bezier(.2,.8,.2,1), opacity .25s ease;
      transition-delay:0s;
      pointer-events:none;
      stroke:var(--bg, #fff);
      stroke-width:1;
    }
    .skill-donut-cat-group.active .skill-donut-skill-arc,
    .skill-donut-cat-group:focus-visible .skill-donut-skill-arc {
      opacity:1;
      transform:scale(1);
      pointer-events:auto;
      transition-delay:calc(var(--i, 0) * 35ms);
    }
    .skill-donut-skill-arc:hover { filter:brightness(1.15); }

    .skill-donut-cat-lang { fill:rgb(180,127,0); }
    .skill-donut-cat-viz { fill:rgb(70,132,142); }
    .skill-donut-cat-platform { fill:rgb(150,88,150); }
    .skill-donut-cat-method { fill:rgb(92,140,92); }
    body.dark .skill-donut-cat-lang { fill:rgb(255,196,0); }
    body.dark .skill-donut-cat-viz { fill:rgb(110,205,218); }
    body.dark .skill-donut-cat-platform { fill:rgb(214,150,214); }
    body.dark .skill-donut-cat-method { fill:rgb(150,212,150); }

    .skill-donut-skill-lang { fill:rgba(180,127,0,0.55); }
    .skill-donut-skill-viz { fill:rgba(70,132,142,0.55); }
    .skill-donut-skill-platform { fill:rgba(150,88,150,0.55); }
    .skill-donut-skill-method { fill:rgba(92,140,92,0.55); }
    body.dark .skill-donut-skill-lang { fill:rgba(255,196,0,0.55); }
    body.dark .skill-donut-skill-viz { fill:rgba(110,205,218,0.55); }
    body.dark .skill-donut-skill-platform { fill:rgba(214,150,214,0.55); }
    body.dark .skill-donut-skill-method { fill:rgba(150,212,150,0.55); }

    .skill-donut-cat-label {
      font-family:'JetBrains Mono', ui-monospace, monospace;
      font-size:10.5px;
      font-weight:600;
      fill:currentColor;
      opacity:0.75;
    }
    .skill-donut-cat-label-sub {
      font-family:'JetBrains Mono', ui-monospace, monospace;
      font-size:9px;
      fill:currentColor;
      opacity:0.5;
    }

    .skill-donut-center {
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      pointer-events:none; text-align:center; width:38%;
    }
    .skill-donut-center-value {
      font-family:'JetBrains Mono', ui-monospace, monospace;
      font-size:2rem; font-weight:700; line-height:1;
      transition:opacity .15s ease;
    }
    .skill-donut-center-label {
      font-family:'JetBrains Mono', ui-monospace, monospace;
      font-size:0.62rem; letter-spacing:0.06em; text-transform:uppercase;
      opacity:0.6; margin-top:0.35rem;
      transition:opacity .15s ease;
    }

    .skill-donut-legend { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem 1.5rem; }
    .skill-donut-legend-item {
      display:flex; align-items:center; gap:0.4rem;
      font-size:0.8rem; opacity:0; cursor:pointer;
      transform:translateY(6px);
      transition:opacity .4s ease, transform .4s ease;
    }
    .skill-donut-legend-item.visible { opacity:1; transform:translateY(0); }
    .skill-donut-legend-item.active { opacity:1; font-weight:600; }
    .skill-donut-dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
    .skill-donut-dot-lang { background:rgb(180,127,0); }
    .skill-donut-dot-viz { background:rgb(70,132,142); }
    .skill-donut-dot-platform { background:rgb(150,88,150); }
    .skill-donut-dot-method { background:rgb(92,140,92); }
    body.dark .skill-donut-dot-lang { background:rgb(255,196,0); }
    body.dark .skill-donut-dot-viz { background:rgb(110,205,218); }
    body.dark .skill-donut-dot-platform { background:rgb(214,150,214); }
    body.dark .skill-donut-dot-method { background:rgb(150,212,150); }
  `;
  document.head.appendChild(style);
}

function renderSkillDonut(list) {
  injectSkillDonutStyles();

  // SKILLS is already grouped by category (lang → viz → platform → method).
  // Inner ring = the 4 categories. Outer ring = each skill's own arc, hidden
  // by default and "exploding" outward — radial length mapped to its % —
  // whenever its category is hovered/focused.
  const size = 480;
  const cx = size / 2;
  const cy = size / 2;
  const rInner = 66;
  const rOuter = 126;   // outer edge of the category ring
  const baseExtra = 6;  // minimum skill-arc extension so nothing reads as 0
  const maxExtra = 74;  // additional radius at 100%
  const labelR = rOuter + baseExtra + maxExtra + 22;

  const catGap = 0.05;   // radian gap between category arcs
  const skillGap = 0.018; // radian gap between skill arcs within a category

  const overallAvg = Math.round(SKILLS.reduce((sum, s) => sum + s.pct, 0) / SKILLS.length);

  function polar(r, angle) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function sectorPath(rIn, rOut, startAngle, endAngle) {
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    const p1 = polar(rOut, startAngle);
    const p2 = polar(rOut, endAngle);
    const p3 = polar(rIn, endAngle);
    const p4 = polar(rIn, startAngle);
    return [
      `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
      `A ${rOut} ${rOut} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
      `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
      `A ${rIn} ${rIn} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
      'Z'
    ].join(' ');
  }

  let cursor = -Math.PI / 2;
  const catGroups = SKILL_CATEGORY_ORDER.map(cat => {
    const catSkills = SKILLS.filter(s => s.cat === cat);
    const span = (catSkills.length / SKILLS.length) * (2 * Math.PI);
    const catStart = cursor + catGap / 2;
    const catEnd = cursor + span - catGap / 2;
    cursor += span;

    const catAvg = Math.round(catSkills.reduce((sum, s) => sum + s.pct, 0) / catSkills.length);
    const catArcPath = sectorPath(rInner, rOuter, catStart, catEnd);

    const skillSpan = (catEnd - catStart) / catSkills.length;
    const skillArcs = catSkills.map((s, i) => {
      const sStart = catStart + i * skillSpan + skillGap / 2;
      const sEnd = catStart + (i + 1) * skillSpan - skillGap / 2;
      const extra = baseExtra + (s.pct / 100) * maxExtra;
      const path = sectorPath(rOuter, rOuter + extra, sStart, sEnd);
      return `<path class="skill-donut-skill-arc skill-donut-skill-${cat}" style="--i:${i}" d="${path}"><title>${s.name} — ${s.pct}%</title></path>`;
    }).join('');

    const mid = (catStart + catEnd) / 2;
    const lp = polar(labelR, mid);
    const cosMid = Math.cos(mid);
    const anchor = cosMid > 0.2 ? 'start' : cosMid < -0.2 ? 'end' : 'middle';
    const label = `
      <text class="skill-donut-cat-label" x="${lp.x.toFixed(2)}" y="${(lp.y - 5).toFixed(2)}" text-anchor="${anchor}" dominant-baseline="middle">${SKILL_CATEGORY_LABELS[cat]}</text>
      <text class="skill-donut-cat-label-sub" x="${lp.x.toFixed(2)}" y="${(lp.y + 9).toFixed(2)}" text-anchor="${anchor}" dominant-baseline="middle">avg ${catAvg}%</text>
    `;

    return `
      <g class="skill-donut-cat-group" data-cat="${cat}" data-avg="${catAvg}" tabindex="0" aria-label="${SKILL_CATEGORY_LABELS[cat]}, average ${catAvg} percent">
        <path class="skill-donut-cat-arc skill-donut-cat-${cat}" d="${catArcPath}"><title>${SKILL_CATEGORY_LABELS[cat]} — avg ${catAvg}%</title></path>
        ${skillArcs}
        ${label}
      </g>
    `;
  }).join('');

  list.innerHTML = `
    <div class="skill-donut">
      <div class="skill-donut-chart">
        <svg class="skill-donut-svg" viewBox="0 0 ${size} ${size}">
          ${catGroups}
        </svg>
        <div class="skill-donut-center">
          <span class="skill-donut-center-value">${overallAvg}%</span>
          <span class="skill-donut-center-label">Overall avg</span>
        </div>
      </div>
      <div class="skill-donut-legend">
        ${SKILL_CATEGORY_ORDER.map(key => `
          <span class="skill-donut-legend-item" data-cat="${key}">
            <span class="skill-donut-dot skill-donut-dot-${key}"></span>
            <span>${SKILL_CATEGORY_LABELS[key]}</span>
          </span>
        `).join('')}
      </div>
    </div>
  `;

  const centerValue = list.querySelector('.skill-donut-center-value');
  const centerLabel = list.querySelector('.skill-donut-center-label');
  const groups = list.querySelectorAll('.skill-donut-cat-group');
  const legendItems = list.querySelectorAll('.skill-donut-legend-item');

  function activate(cat) {
    groups.forEach(g => g.classList.toggle('active', g.dataset.cat === cat));
    legendItems.forEach(li => li.classList.toggle('active', li.dataset.cat === cat));
    const g = list.querySelector(`.skill-donut-cat-group[data-cat="${cat}"]`);
    if (centerValue && g) {
      centerValue.textContent = g.dataset.avg + '%';
      centerLabel.textContent = SKILL_CATEGORY_LABELS[cat];
    }
  }

  function reset() {
    groups.forEach(g => g.classList.remove('active'));
    legendItems.forEach(li => li.classList.remove('active'));
    if (centerValue) {
      centerValue.textContent = overallAvg + '%';
      centerLabel.textContent = 'Overall avg';
    }
  }

  groups.forEach(g => {
    g.addEventListener('mouseenter', () => activate(g.dataset.cat));
    g.addEventListener('mouseleave', reset);
    g.addEventListener('focus', () => activate(g.dataset.cat));
    g.addEventListener('blur', reset);
  });
  legendItems.forEach(li => {
    li.addEventListener('mouseenter', () => activate(li.dataset.cat));
    li.addEventListener('mouseleave', reset);
    li.addEventListener('click', () => activate(li.dataset.cat));
  });

  requestAnimationFrame(() => {
    list.querySelectorAll('.skill-donut-cat-arc').forEach((arc, i) => {
      setTimeout(() => arc.classList.add('visible'), 100 + i * 90);
    });
    legendItems.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), 150 + i * 70);
    });
  });
}

function renderSkillBars(list, filtered) {
  list.innerHTML = filtered.map(s => `
    <div class="skill-row">
      <span class="skill-name">${s.name}</span>
      <div class="skill-track"><div class="skill-fill" data-pct="${s.pct}"></div></div>
      <span class="skill-pct mono">${s.pct}%</span>
    </div>
  `).join('');
  requestAnimationFrame(() => {
    list.querySelectorAll('.skill-row').forEach((row, i) => {
      setTimeout(() => {
        row.classList.add('visible');
        const fill = row.querySelector('.skill-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
      }, i * 40);
    });
  });
}

function renderSkills(cat) {
  const list = document.getElementById('skillList');
  if (!list) return;
  if (cat === 'all') {
    renderSkillDonut(list);
    return;
  }
  const filtered = SKILLS.filter(s => s.cat === cat);
  renderSkillBars(list, filtered);
}

document.querySelectorAll('.skill-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkills(btn.dataset.cat);
  });
});
if (document.getElementById('skillList')) renderSkills('all');

/* ── History toggle (Experience / Education) ─────────────────────── */
(function () {
  const tabs = document.querySelectorAll('.history-toggle-btn');
  const panels = document.querySelectorAll('.history-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.panel;
      panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + target));
    });
  });
})();

/* ── Dashboards filter ────────────────────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.dash-card');
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
})();

/* ── Floating data background ─────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const TOKENS = [
    '92%', '∑', 'μ', 'σ', '∅', '//', '{}', '[]',
    'SELECT', 'JOIN', 'WHERE', 'GROUP BY',
    'AVG()', 'SUM()', 'COUNT()',
    '0', '1', 'null', 'true',
    'Power BI', 'Fabric', 'SQL', 'DAX', 'KPI',
    '↑12%', '→', '≈', 'Δ', '∞',
    '2024', '2025', 'Q3', 'YTD',
    '3.14', '0.98', '1.0', 'n+1',
  ];

  let W, H, particles = [];

  function isDark() {
    return document.body.classList.contains('dark');
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawn(placeRandomly) {
    const size = 10 + Math.random() * 9;
    return {
      text:    TOKENS[Math.floor(Math.random() * TOKENS.length)],
      x:       Math.random() * (W || window.innerWidth),
      y:       placeRandomly
                 ? Math.random() * (H || window.innerHeight)
                 : (H || window.innerHeight) + 40,
      size,
      speed:   0.18 + Math.random() * 0.22,
      drift:   (Math.random() - 0.5) * 0.18,
      opacity: 0.045 + Math.random() * 0.07,
      phase:   Math.random() * Math.PI * 2,
      freq:    0.0004 + Math.random() * 0.0004,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 55 }, () => spawn(true));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = isDark() ? '255,196,0' : '180,127,0';
    t++;

    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(t * p.freq * 1000 + p.phase) * 0.12;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `500 ${p.size}px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.fillStyle = `rgb(${col})`;
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();

      if (p.y < -30) {
        Object.assign(p, spawn(false));
        p.x = Math.random() * W;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ── Live reader counter (article pages) ──────────────────────────── */
(function () {
  const el = document.getElementById('articleViewCount');
  if (!el) return;

  // One namespace for the whole site, one key per article (set via
  // data-article-key on <body>). Swap NAMESPACE for your own domain
  // if you want the counters isolated to your site only.
  const API = 'https://abacus.jasoncameron.dev';
  const NAMESPACE = 'vishwavijaysheel-portfolio';
  const KEY = document.body.dataset.articleKey;
  if (!KEY) return;

  const SESSION_FLAG = 'counted:' + KEY;

  function render(n) {
    if (typeof n !== 'number' || Number.isNaN(n)) return;
    el.textContent = n.toLocaleString();
  }

  // Only increment once per browser session per article; repeat views
  // in the same session just re-fetch the current value.
  const alreadyCounted = sessionStorage.getItem(SESSION_FLAG);
  const initialEndpoint = alreadyCounted
    ? `${API}/get/${NAMESPACE}/${KEY}`
    : `${API}/hit/${NAMESPACE}/${KEY}`;

  fetch(initialEndpoint)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(data => {
      render(data.value);
      if (!alreadyCounted) sessionStorage.setItem(SESSION_FLAG, '1');

      // Stay live: subscribe to updates so the number moves in real
      // time as other people land on the page, without a refresh.
      try {
        const stream = new EventSource(`${API}/stream/${NAMESPACE}/${KEY}`);
        stream.onmessage = (e) => {
          try { render(JSON.parse(e.data).value); } catch (_) { /* ignore malformed frame */ }
        };
        stream.onerror = () => stream.close();
      } catch (_) { /* SSE unsupported — static count above still stands */ }
    })
    .catch(() => { el.textContent = '—'; });
})();

/* ── Newsletter form ───────────────────────────────────────────────
   Fully custom: live hint text as you type, then a real POST to our
   own Worker (see newsletter-worker/), which sends a custom email
   the moment someone subscribes. No third-party form or widget. ──── */
(function () {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const DEFAULT_HINT = "We'll email you when something new goes up — nothing else.";

  // Your deployed Worker's URL (see newsletter-worker/worker.js).
  const SUBSCRIBE_ENDPOINT = 'https://newsletter-subscribe.aarav7509.workers.dev/subscribe';

  document.querySelectorAll('.newsletter-form').forEach((form) => {
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.newsletter-btn');
    const hint = form.querySelector('.newsletter-hint');
    if (!input || !btn || !hint) return;

    let touched = false;

    function setHint(text, state) {
      hint.textContent = text;
      hint.classList.remove('valid', 'invalid', 'sent');
      if (state) hint.classList.add(state);
    }

    function validate() {
      const value = input.value.trim();
      if (!value) {
        input.classList.remove('invalid');
        setHint(DEFAULT_HINT, null);
        return null;
      }
      const isValid = EMAIL_RE.test(value);
      input.classList.toggle('invalid', touched && !isValid);
      if (isValid) {
        setHint('Looks good — one click and you\'re in.', 'valid');
      } else if (touched) {
        setHint('That doesn\'t look like a full email address yet.', 'invalid');
      } else {
        setHint(DEFAULT_HINT, null);
      }
      return isValid;
    }

    input.addEventListener('input', validate);
    input.addEventListener('blur', () => { touched = true; validate(); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      touched = true;
      const isValid = validate();
      const email = input.value.trim();

      if (!isValid) {
        input.focus();
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      setHint('Sending you something…', null);

      fetch(SUBSCRIBE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then(r => r.json().catch(() => ({})).then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (ok && (data.status === 'subscribed' || data.status === 'already_subscribed')) {
            btn.textContent = 'Subscribed ✓';
            input.value = '';
            touched = false;
            setHint('Check your inbox — just sent you something.', 'sent');
          } else {
            btn.disabled = false;
            btn.textContent = 'Subscribe';
            setHint(data.error || 'Something went wrong — try again.', 'invalid');
          }
        })
        .catch(() => {
          btn.disabled = false;
          btn.textContent = 'Subscribe';
          setHint('Network error — try again.', 'invalid');
        })
        .finally(() => {
          setTimeout(() => {
            if (btn.textContent === 'Subscribed ✓') {
              btn.disabled = false;
              btn.textContent = 'Subscribe';
              setHint(DEFAULT_HINT, null);
            }
          }, 4000);
        });
    });
  });
})();
