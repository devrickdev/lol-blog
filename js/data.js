/* Small helpers shared by every page. Loads the JSON "data files"
   that live in /data — this is the whole "database" for the site.
   Edit those .json files to add posts, log a new rank, or update
   your champion pool. No build step, no server needed beyond a
   static file server (see README). */

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Falha ao carregar ${path}: ${res.status}`);
  return res.json();
}

async function loadConfig() { return loadJSON("data/config.json"); }
async function loadPosts() { return loadJSON("data/posts.json"); }
async function loadStats() { return loadJSON("data/stats.json"); }
async function loadChampions() { return loadJSON("data/champions.json"); }

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function rankLabel(entry) {
  if (!entry) return "—";
  if (["Mestre", "Grão-Mestre", "Desafiante", "Master", "Grandmaster", "Challenger"].includes(entry.tier)) {
    return `${entry.tier} · ${entry.lp} LP`;
  }
  return `${entry.tier} ${entry.division} · ${entry.lp} LP`;
}

function computeAggregate(statsHistory) {
  const wins = statsHistory.reduce((s, e) => s + (e.wins || 0), 0);
  const losses = statsHistory.reduce((s, e) => s + (e.losses || 0), 0);
  const total = wins + losses;
  const wr = total ? Math.round((wins / total) * 100) : 0;
  return { wins, losses, total, winrate: wr };
}
