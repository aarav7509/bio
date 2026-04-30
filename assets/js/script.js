// Add interactivity if needed—for example, smooth scrolling, or blog loading in future
console.log("Portfolio loaded successfully.");

const SKILLS = [
  { name: "SQL",                pct: 92, cat: "lang" },
  { name: "Python",             pct: 78, cat: "lang" },
  { name: "DAX",                pct: 88, cat: "lang" },
  { name: "M Query",            pct: 82, cat: "lang" },
  { name: "Power BI",           pct: 90, cat: "viz"  },
  { name: "Excel / Power Query",pct: 93, cat: "viz"  },
  { name: "Chart.js",           pct: 65, cat: "viz"  },
  { name: "Microsoft Fabric",   pct: 85, cat: "platform" },
  { name: "SharePoint",         pct: 80, cat: "platform" },
  { name: "SAP Ariba",          pct: 72, cat: "platform" },
  { name: "Azure",              pct: 68, cat: "platform" },
  { name: "Data Modelling",     pct: 88, cat: "method" },
  { name: "ETL Pipelines",      pct: 84, cat: "method" },
  { name: "Statistical Analysis",pct: 76, cat: "method" },
  { name: "Process Automation", pct: 82, cat: "method" },
];

function renderSkills(cat) {
  const list = document.getElementById("skillList");
  const filtered = cat === "all" ? SKILLS : SKILLS.filter(s => s.cat === cat);


  list.innerHTML = filtered.map((s, i) => `
    <div class="skill-row" style="transition-delay:${i * 0.04}s">
      <span class="skill-name">${s.name}</span>
      <div class="skill-track"><div class="skill-fill" data-pct="${s.pct}"></div></div>
      <span class="skill-pct">${s.pct}%</span>
    </div>
  `).join("");

  requestAnimationFrame(() => {
    list.querySelectorAll(".skill-row").forEach(r => r.classList.add("visible"));
    list.querySelectorAll(".skill-fill").forEach(f => {
      f.style.width = f.dataset.pct + "%";
    });
  });
}


document.querySelectorAll(".skill-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".skill-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderSkills(btn.dataset.cat);
  });
});

renderSkills("all");

// Scroll-reveal for timeline items
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));


// ── Hero role cycling ─────────────────────────────────────────
const heroRoles = document.querySelectorAll('.hero-role');
let heroIdx = 0;
setInterval(() => {
  heroRoles[heroIdx].classList.remove('active');
  heroIdx = (heroIdx + 1) % heroRoles.length;
  heroRoles[heroIdx].classList.add('active');
}, 2200);


// ── Floating data background ──────────────────────────────────
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');

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
    return document.body.classList.contains('dark') ||
      (!document.body.classList.contains('dark') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
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
    const col = isDark() ? '230,184,156' : '160,96,58';
    t++;

    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(t * p.freq * 1000 + p.phase) * 0.12;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `500 ${p.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
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


