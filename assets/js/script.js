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

function renderSkills(cat) {
  const list = document.getElementById('skillList');
  if (!list) return;
  const filtered = cat === 'all' ? SKILLS : SKILLS.filter(s => s.cat === cat);
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
