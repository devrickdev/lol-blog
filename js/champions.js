const DDRAGON_VERSION = "14.13.1";

function ddragonIcon(championId) {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championId}.png`;
}

let CHAMPS = [];
let SORT_KEY = "games";
let SORT_DIR = -1;

function kda(c) {
  return c.deaths > 0 ? (c.kills + c.assists) / c.deaths : c.kills + c.assists;
}
function winrate(c) {
  return c.games > 0 ? Math.round((c.wins / c.games) * 100) : 0;
}

function sortAndRender() {
  const rows = [...CHAMPS].sort((a, b) => {
    let av, bv;
    if (SORT_KEY === "winrate") { av = winrate(a); bv = winrate(b); }
    else if (SORT_KEY === "kda") { av = kda(a); bv = kda(b); }
    else { av = a[SORT_KEY]; bv = b[SORT_KEY]; }
    if (typeof av === "string") return SORT_DIR * av.localeCompare(bv);
    return SORT_DIR * (av - bv);
  });

  const tbody = document.getElementById("champ-tbody");
  tbody.innerHTML = rows
    .map((c) => {
      const wr = winrate(c);
      const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      return `
      <tr>
        <td>
          <div class="champ-name-cell">
            <img class="champ-icon" src="${ddragonIcon(c.championId)}" alt=""
                 onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'champ-icon-fallback', textContent:'${initials}'}))">
            ${c.name}
          </div>
        </td>
        <td>${c.role}</td>
        <td>${c.games}</td>
        <td>${c.wins}-${c.losses}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="wr-bar-track"><div class="wr-bar-fill" style="width:${wr}%"></div></div>
            ${wr}%
          </div>
        </td>
        <td>${kda(c).toFixed(2)}</td>
      </tr>`;
    })
    .join("");
}

function initSorting() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (SORT_KEY === key) SORT_DIR *= -1;
      else { SORT_KEY = key; SORT_DIR = -1; }
      sortAndRender();
    });
  });
}
