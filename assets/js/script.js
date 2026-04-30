// Add interactivity if needed—for example, smooth scrolling, or blog loading in future
console.log("Portfolio loaded successfully.");


document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('skillsChart').getContext('2d');
    
    // Skill categories and levels
    const categories = {
        database: {
            label: 'Databases',
            labels: ['Relational','NoSQL', 'Object Oriented', 'Cloud based'],
            data: [90, 85, 75, 80],
            color: '#a0603a' // Matches --primary
        },
        programming: {
            label: 'Programming Languages',
            labels: ['Python', 'R', 'HTML/CSS'],
            data: [85, 70, 90],
            color: '#e6b89c' // Matches --accent
        },
        visualisation: {
            label: 'Visualisation Tools',
            labels: ['Power BI', 'Tableau', 'Weka', 'Looker'],
            data: [95, 85, 80, 95],
            color: '#7a8c45' 
        },
        nonTechnical: {
            label: 'Machine Learning Algorithms',
            labels: ['Linear Regression', 'SVM', 'Naive-Bayes'],
            data: [90, 85, 95],
            color: '#8d99ae'
        }
    };

    // Prepare grouped data
    const allLabels = [...categories.database.labels, ...categories.programming.labels, ...categories.visualisation.labels, ...categories.nonTechnical.labels];
    
    const datasets = Object.keys(categories).map(key => {
        const cat = categories[key];
        // Create an array the length of all labels, filled with null except where the label matches
        const pointData = allLabels.map(label => {
            const index = cat.labels.indexOf(label);
            return index !== -1 ? cat.data[index] : null;
        });

        return {
            label: cat.label,
            data: pointData,
            backgroundColor: cat.color + 'BB', // Transparency
            borderColor: cat.color,
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.8,
            categoryPercentage: 1.0
        };
    });

    const style = getComputedStyle(document.body);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allLabels,
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: style.getPropertyValue('--text').trim(),
                        font: { family: 'inherit', size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => ` Proficiency: ${context.parsed.x}%`
                    }
                }
            },
            scales: {
                x: {
                    max: 100,
                    grid: { display: false },
                    ticks: { color: style.getPropertyValue('--text-muted').trim() }
                },
                y: {
                    stacked: true,
                    grid: { color: style.getPropertyValue('--border').trim() },
                    ticks: { 
                        color: style.getPropertyValue('--text').trim(),
                        font: { weight: '500' }
                    }
                }
            }
        }
    });
});

// Scroll-reveal for timeline items
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

// ── Skills chart ─────────────────────────────────────────────
const SKILLS = {
  lang:     [{ n:'SQL', v:92 },{ n:'DAX', v:88 },{ n:'M Query', v:82 },{ n:'Python', v:78 }],
  viz:      [{ n:'Excel / Power Query', v:93 },{ n:'Power BI', v:90 },{ n:'Chart.js', v:65 }],
  platform: [{ n:'Microsoft Fabric', v:85 },{ n:'SharePoint', v:80 },{ n:'SAP Ariba', v:72 },{ n:'Azure', v:68 }],
  method:   [{ n:'Data Modelling', v:88 },{ n:'ETL Pipelines', v:84 },{ n:'Process Automation', v:82 },{ n:'Statistical Analysis', v:76 }],
};

const CAT_LABELS = { lang:'Languages', viz:'Visualisation', platform:'Platforms', method:'Methods' };
const CAT_COLORS = { lang:'#a0603a', viz:'#c47a4f', platform:'#7a4a2c', method:'#d4956b' };

let skillChart = null;

function setLegend(items) {
  document.getElementById('skillLegend').innerHTML = items.map(i =>
    `<span><span class="skill-swatch" style="background:${i.color}"></span>${i.label}</span>`
  ).join('');
}

function buildBar(cat) {
  const items = cat === 'all'
    ? Object.entries(SKILLS).flatMap(([c, arr]) => arr.map(s => ({ ...s, cat: c })))
        .sort((a, b) => b.v - a.v)
    : SKILLS[cat].map(s => ({ ...s, cat }));

  const h = Math.max(220, items.length * 48 + 60);
  document.getElementById('skillWrap').style.height = h + 'px';

  const bgColors = items.map(s => CAT_COLORS[s.cat]);

  if (cat === 'all') {
    setLegend(Object.keys(SKILLS).map(c => ({ label: CAT_LABELS[c], color: CAT_COLORS[c] })));
  } else {
    setLegend([{ label: `${CAT_LABELS[cat]}  ·  ${items.length} skills`, color: CAT_COLORS[cat] }]);
  }

  return new Chart(document.getElementById('skillChart'), {
    type: 'bar',
    data: {
      labels: items.map(s => s.n),
      datasets: [{
        label: 'Proficiency',
        data: items.map(s => s.v),
        backgroundColor: bgColors,
        borderColor: 'transparent',
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } }
      },
      scales: {
        x: {
          min: 0, max: 100,
          grid: { color: 'rgba(160,96,58,0.08)' },
          ticks: { color: '#6f6f6f', font: { size: 11, family: 'inherit' }, callback: v => v + '%' },
          border: { display: false }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#1f1f1f', font: { size: 12, family: 'inherit' } },
          border: { display: false }
        }
      }
    }
  });
}

function renderSkillChart(cat) {
  if (skillChart) skillChart.destroy();
  document.getElementById('skillChart').setAttribute('aria-label',
    cat === 'all' ? 'All skills ranked by proficiency' : `${CAT_LABELS[cat]} skills proficiency`
  );
  skillChart = buildBar(cat);
}

document.querySelectorAll('.skill-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkillChart(btn.dataset.cat);
  });
});

renderSkillChart('all');

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


