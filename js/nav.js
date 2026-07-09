async function renderSidebar(activePage) {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  let config = {};
  try {
    config = await loadConfig();
  } catch (e) {
    console.error(e);
  }

  const initials = (config.summonerName || "??").slice(0, 2).toUpperCase();
  const rankText = config.currentRank ? rankLabel(config.currentRank) : "Sem elo registrado";

  const links = [
    { href: "index.html", label: "Início" },
    { href: "posts.html", label: "Diário" },
    { href: "stats.html", label: "Evolução" },
    { href: "champions.html", label: "Campeões" },
  ];

  mount.innerHTML = `
    <aside class="sidebar">
      <div class="summoner-card">
        <div class="rank-badge">${initials}</div>
        <div>
          <div class="summoner-name">${config.summonerName || "Invocador"}</div>
          <div class="summoner-rank">${rankText}</div>
        </div>
      </div>
      <nav class="mainnav">
        ${links
          .map(
            (l) =>
              `<a href="${l.href}" class="${l.href === activePage ? "active" : ""}">${l.label}</a>`
          )
          .join("")}
      </nav>
      <div class="sidebar-footer">
        ${config.tagline || "Registro pessoal de progresso no Summoner's Rift."}
      </div>
    </aside>
  `;
}
