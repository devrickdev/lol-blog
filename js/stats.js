const TIER_ORDER = [
  "Ferro", "Bronze", "Prata", "Ouro", "Platina", "Esmeralda", "Diamante",
  "Mestre", "Grão-Mestre", "Desafiante",
];
const APEX_TIERS = ["Mestre", "Grão-Mestre", "Desafiante"];
const DIVISIONS = ["IV", "III", "II", "I"];

// Converts a rank entry into a single ascending number, so the whole
// climb (tier + division + lp) can be plotted on one continuous axis.
function tierValue(entry) {
  const tierIdx = TIER_ORDER.indexOf(entry.tier);
  const base = tierIdx * 400;
  if (APEX_TIERS.includes(entry.tier)) return base + entry.lp;
  const divIdx = DIVISIONS.indexOf(entry.division); // IV=0 ... I=3
  return base + divIdx * 100 + entry.lp;
}

function buildLadderSVG(history) {
  const tiersToShow = TIER_ORDER.slice(0, 7); // Ferro..Diamante fits most journeys; apex handled separately below
  const showApex = history.some((h) => APEX_TIERS.includes(h.tier));
  const rungs = showApex ? TIER_ORDER : tiersToShow;

  const w = 620;
  const rowH = 40;
  const h = rungs.length * rowH + 40;
  const labelX = 130;
  const trackX0 = 150;
  const trackX1 = w - 30;

  const values = history.map(tierValue);
  const maxVal = Math.max(...values, (rungs.length) * 400);

  function xFor(v) {
    return trackX0 + (v / maxVal) * (trackX1 - trackX0);
  }

  let rungsSVG = "";
  rungs.forEach((tier, i) => {
    const y = 30 + i * rowH;
    rungsSVG += `
      <line x1="${trackX0}" y1="${y}" x2="${trackX1}" y2="${y}" stroke="var(--rule)" stroke-width="1" />
      <text x="${labelX}" y="${y + 4}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--ink-dim)">${tier}</text>
    `;
  });

  // path connecting each historical point, mapped to (x=value, y=tier row)
  function yForTier(tier) {
    const idx = rungs.indexOf(tier);
    return 30 + (idx === -1 ? rungs.length - 1 : idx) * rowH;
  }

  const points = history.map((entry) => ({
    x: xFor(tierValue(entry)),
    y: yForTier(entry.tier),
    date: entry.date,
    label: rankLabel(entry),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  const dots = points
    .map(
      (p, i) => `
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i === points.length - 1 ? 6 : 3.5}"
        fill="${i === points.length - 1 ? "var(--gold)" : "var(--bg)"}"
        stroke="var(--gold)" stroke-width="${i === points.length - 1 ? 0 : 1.5}">
        <title>${p.date} — ${p.label}</title>
      </circle>`
    )
    .join("");

  return `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Escada de elo mostrando a evolução do rank ao longo do tempo">
      ${rungsSVG}
      <path d="${pathD}" fill="none" stroke="var(--gold-dim)" stroke-width="2" />
      ${dots}
    </svg>
  `;
}

function renderEloChart(canvas, history) {
  const labels = history.map((h) => formatDate(h.date));
  const data = history.map(tierValue);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Progresso de elo",
          data,
          borderColor: "#D4A24C",
          backgroundColor: "rgba(212,162,76,0.12)",
          fill: true,
          tension: 0.25,
          pointRadius: 3,
          pointBackgroundColor: "#D4A24C",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => rankLabel(history[ctx.dataIndex]),
          },
        },
      },
      scales: {
        x: { ticks: { color: "#9FB0AC", font: { family: "IBM Plex Mono" } }, grid: { color: "#263B3E" } },
        y: { display: false },
      },
    },
  });
}

function renderKdaChart(canvas, history) {
  const labels = history.map((h) => formatDate(h.date));
  const kda = history.map((h) => (h.deaths > 0 ? (h.kills + h.assists) / h.deaths : h.kills + h.assists));

  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "KDA médio",
          data: kda.map((v) => Math.round(v * 100) / 100),
          backgroundColor: kda.map((v) => (v >= 3 ? "#4FA891" : v >= 2 ? "#D4A24C" : "#C1554D")),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#9FB0AC", font: { family: "IBM Plex Mono" } }, grid: { display: false } },
        y: { ticks: { color: "#9FB0AC" }, grid: { color: "#263B3E" } },
      },
    },
  });
}
