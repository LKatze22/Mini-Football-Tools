"use strict";
/* ==========================================================================
   MFTools — Application Script
   Structure:
     1. Mock data layer      (players, scouts, guides, news)
     2. Utilities            (formatting, storage, dom helpers)
     3. Global UI             (nav, theme, search, back-to-top, reveal)
     4. Router
     5. View renderers        (home, players, player detail, scouts, tools,
                                rankings, guides, news, static, 404)
   Data currently lives in-memory so the same render functions can later be
   pointed at a real API without changing view code (see fetchPlayers etc.)
   ========================================================================== */

/* -------------------------------------------------------------------------
   1. MOCK DATA LAYER
   ------------------------------------------------------------------------- */
const POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LM",
  "RM",
  "LW",
  "RW",
  "ST",
];
const RARITIES = [
  { id: "common", label: "Common", color: "#8B96AB" },
  { id: "rare", label: "Rare", color: "#3B82F6" },
  { id: "epic", label: "Epic", color: "#A78BFA" },
  { id: "legendary", label: "Legendary", color: "#F5B942" },
];
const NATIONS = [
  "Brazil",
  "England",
  "Spain",
  "Germany",
  "France",
  "Argentina",
  "Portugal",
  "Italy",
  "Netherlands",
  "Japan",
  "Nigeria",
  "Croatia",
];
const CLUBS = [
  "Ironbay FC",
  "Astra United",
  "Reddock City",
  "Meridian SC",
  "Vantage FC",
  "Solheim Athletic",
  "Perth Harbor",
  "Cobalt Rovers",
  "Nordwind FC",
  "Palmetto United",
];
const LEAGUES = [
  "Prime League",
  "Continental Cup League",
  "Coastal Division",
  "Metro Champions League",
];
const FIRST = [
  "Lucas",
  "Mateo",
  "Leon",
  "Kai",
  "Noah",
  "Diego",
  "Marco",
  "Theo",
  "Owen",
  "Rafael",
  "Ben",
  "Elias",
  "Hugo",
  "Sami",
  "Jonas",
  "Dario",
  "Milo",
  "Enzo",
  "Axel",
  "Vito",
  "Kian",
  "Remy",
  "Toma",
  "Iker",
];
const LAST = [
  "Ferreira",
  "Novak",
  "Hartmann",
  "Okafor",
  "Silva",
  "Moreau",
  "Baptiste",
  "Kowalski",
  "Reyes",
  "Lindqvist",
  "Toledo",
  "Costa",
  "Brandt",
  "Suarez",
  "Vidal",
  "Amaro",
  "Pereira",
  "Duval",
  "Santini",
  "Rocha",
];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seededRandom(2026);
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function generatePlayers(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const pos = pick(POSITIONS);
    const isGK = pos === "GK";
    const rarityRoll = rand();
    const rarity =
      rarityRoll > 0.93
        ? RARITIES[3]
        : rarityRoll > 0.75
          ? RARITIES[2]
          : rarityRoll > 0.45
            ? RARITIES[1]
            : RARITIES[0];
    const base = { common: 58, rare: 68, epic: 78, legendary: 87 }[rarity.id];
    const rating = Math.min(99, base + randInt(-3, 7));
    const stat = (lo, hi) =>
      Math.min(99, Math.max(30, rating + randInt(lo, hi)));
    const player = {
      id: "p" + (i + 1),
      name: `${pick(FIRST)} ${pick(LAST)}`,
      rating,
      position: pos,
      rarity: rarity.id,
      rarityLabel: rarity.label,
      rarityColor: rarity.color,
      nation: pick(NATIONS),
      club: pick(CLUBS),
      league: pick(LEAGUES),
      pace: isGK ? randInt(35, 55) : stat(-8, 8),
      shooting: isGK ? randInt(15, 30) : stat(-10, 8),
      passing: isGK ? randInt(30, 50) : stat(-6, 8),
      dribbling: isGK ? randInt(20, 40) : stat(-8, 8),
      defense: isGK
        ? randInt(20, 40)
        : ["CB", "LB", "RB", "CDM"].includes(pos)
          ? stat(-4, 10)
          : stat(-20, 4),
      physical: stat(-6, 8),
      avatar: isGK ? "🧤" : pick(["⚽", "🎽", "👟"]),
    };
    list.push(player);
  }
  return list;
}
const PLAYERS = generatePlayers(48);
function fetchPlayers() {
  return Promise.resolve(PLAYERS);
} // swap for real API later
function getPlayer(id) {
  return PLAYERS.find((p) => p.id === id);
}

const GUIDES = [
  {
    id: "beginner",
    level: "Beginner",
    icon: "🌱",
    title: "Beginner Guide: Your First 7 Days",
    desc: "Squad basics, training priorities and the mistakes that cost new managers the most coins.",
  },
  {
    id: "teams",
    level: "Intermediate",
    icon: "🛡️",
    title: "Best Teams to Build Around",
    desc: "Balanced squad archetypes for every budget, from starter XIs to endgame rosters.",
  },
  {
    id: "formations",
    level: "Intermediate",
    icon: "📐",
    title: "Best Formations & When to Use Them",
    desc: "How 4-3-3, 4-2-3-1 and 3-5-2 behave differently and which fits your play style.",
  },
  {
    id: "tips",
    level: "All Levels",
    icon: "💡",
    title: "Tips & Tricks Most Players Miss",
    desc: "Small habits — from scout timing to training queues — that compound over a season.",
  },
  {
    id: "economy",
    level: "Advanced",
    icon: "💰",
    title: "Economy Guide: Coins, Gems & Value",
    desc: "How to plan spending, when to save for packs, and how to avoid wasting resources.",
  },
];

const NEWS = [
  {
    id: "n1",
    tag: "Update",
    date: "Jul 28, 2026",
    icon: "🆕",
    title: "Season 9 Kicks Off With New Scout Pool",
    excerpt:
      "A refreshed legendary pool and rebalanced probabilities land alongside the new season.",
  },
  {
    id: "n2",
    tag: "Event",
    date: "Jul 21, 2026",
    icon: "🏆",
    title: "Summer Cup Rewards Detailed",
    excerpt:
      "Milestone rewards, ranked brackets and the return of the community leaderboard.",
  },
  {
    id: "n3",
    tag: "Balance",
    date: "Jul 14, 2026",
    icon: "⚖️",
    title: "Defensive Stats Rebalanced Across Rarities",
    excerpt:
      "Common and rare defenders see a modest bump to keep early squads competitive.",
  },
  {
    id: "n4",
    tag: "Community",
    date: "Jul 06, 2026",
    icon: "🗣️",
    title: "Top Community Formations This Month",
    excerpt:
      "A look at the formations climbing the ranked ladder and why they are working.",
  },
  {
    id: "n5",
    tag: "Update",
    date: "Jun 29, 2026",
    icon: "🆕",
    title: "Training Ground Rework Explained",
    excerpt:
      "Queue slots, XP curves and a new fast-track option for veteran accounts.",
  },
  {
    id: "n6",
    tag: "Guide",
    date: "Jun 22, 2026",
    icon: "📘",
    title: "How Upgrade Costs Scale Past Level 30",
    excerpt:
      "A breakdown of where resource costs start climbing fastest and how to plan for it.",
  },
];

/* -------------------------------------------------------------------------
   2. UTILITIES
   ------------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const app = $("#app");

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function store(key, val) {
  if (val === undefined) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* storage unavailable */
  }
}
function statColor(v) {
  return v >= 80
    ? "var(--pitch)"
    : v >= 60
      ? "var(--blue-bright)"
      : "var(--text-2)";
}

let favorites = new Set(store("mft-favorites") || []);
function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  store("mft-favorites", Array.from(favorites));
}

let compareList = [];
function toggleCompare(id) {
  const i = compareList.indexOf(id);
  if (i > -1) compareList.splice(i, 1);
  else if (compareList.length < 2) compareList.push(id);
  renderCompareBar();
}
function renderCompareBar() {
  let bar = $("#compare-bar");
  if (!bar) {
    bar = el(`<div class="compare-bar" id="compare-bar">
      <span></span>
      <button class="btn btn-primary btn-sm" id="compare-go">Compare</button>
      <button class="icon-btn" id="compare-clear" aria-label="Clear comparison">✕</button>
    </div>`);
    document.body.appendChild(bar);
    $("#compare-clear", bar).addEventListener("click", () => {
      compareList = [];
      renderCompareBar();
    });
    $("#compare-go", bar).addEventListener("click", () => {
      if (compareList[0])
        location.hash = `#/players/${compareList[0]}${compareList[1] ? "?vs=" + compareList[1] : ""}`;
    });
  }
  $("span", bar).textContent = compareList.length
    ? `${compareList.length} player${compareList.length > 1 ? "s" : ""} selected to compare`
    : "";
  bar.classList.toggle("show", compareList.length > 0);
  $("#compare-go", bar).disabled = compareList.length < 2;
}

function statBar(label, value) {
  return `<div class="stat-bar-row">
    <div class="stat-bar-label"><span>${label}</span><b>${value}</b></div>
    <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${value}%;background:${statColor(value)}"></div></div>
  </div>`;
}

function observeReveal(container) {
  const items = $$(".reveal", container);
  if (!("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  items.forEach((i) => io.observe(i));
}

/* -------------------------------------------------------------------------
   3. GLOBAL UI
   ------------------------------------------------------------------------- */
function initTheme() {
  const saved = localStorage.getItem("mft-theme");
  const theme = saved || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  syncThemeIcon(theme);
  $("#theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mft-theme", next);
    syncThemeIcon(next);
  });
}
function syncThemeIcon(theme) {
  $(".icon-moon").hidden = theme === "light";
  $(".icon-sun").hidden = theme === "dark";
}

function initNavToggle() {
  const btn = $("#nav-toggle"),
    nav = $("#main-nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });
}

function initBackToTop() {
  const btn = $("#back-to-top");
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 500),
    { passive: true },
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

function initSearch() {
  const overlay = $("#search-overlay"),
    input = $("#search-input"),
    results = $("#search-results");
  const open = () => {
    overlay.classList.add("open");
    setTimeout(() => input.focus(), 80);
    renderSearch("");
  };
  const close = () => overlay.classList.remove("open");
  $("#search-open").addEventListener("click", open);
  $("#search-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
    if (e.key === "Escape") close();
  });
  input.addEventListener("input", () => renderSearch(input.value));

  function renderSearch(q) {
    const query = q.trim().toLowerCase();
    let items = [];
    if (query) {
      items = items.concat(
        PLAYERS.filter((p) => p.name.toLowerCase().includes(query))
          .slice(0, 6)
          .map((p) => ({
            icon: p.avatar,
            title: p.name,
            meta: `${p.position} · ${p.rating} OVR`,
            href: `#/players/${p.id}`,
          })),
        GUIDES.filter((g) => g.title.toLowerCase().includes(query))
          .slice(0, 3)
          .map((g) => ({
            icon: g.icon,
            title: g.title,
            meta: "Guide",
            href: `#/guides`,
          })),
        NEWS.filter((n) => n.title.toLowerCase().includes(query))
          .slice(0, 3)
          .map((n) => ({
            icon: n.icon,
            title: n.title,
            meta: "News · " + n.date,
            href: `#/news`,
          })),
      );
    }
    results.innerHTML = "";
    if (!query) {
      results.appendChild(
        el(
          `<div class="search-empty">Search players, guides and news. Try “ST”, “legendary”, or a player name.</div>`,
        ),
      );
      return;
    }
    if (!items.length) {
      results.appendChild(
        el(
          `<div class="search-empty">No results for “${escapeHtml(q)}”.</div>`,
        ),
      );
      return;
    }
    items.forEach((it) => {
      const row = el(`<a class="search-result-item" href="${it.href}">
        <span class="srav">${it.icon}</span>
        <span><span class="srtitle">${escapeHtml(it.title)}</span><br><span class="srmeta">${it.meta}</span></span>
      </a>`);
      row.addEventListener("click", close);
      results.appendChild(row);
    });
  }
}
function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function setActiveNav(route) {
  $$(".main-nav a").forEach((a) =>
    a.classList.toggle("active", a.dataset.route === route),
  );
}

/* -------------------------------------------------------------------------
   4. ROUTER
   ------------------------------------------------------------------------- */
const routes = [
  { test: (h) => h === "" || h === "/", render: renderHome, name: "home" },
  { test: (h) => h === "/players", render: renderPlayers, name: "players" },
  {
    test: (h) => /^\/players\/[\w-]+/.test(h),
    render: renderPlayerDetail,
    name: "players",
  },
  { test: (h) => h === "/scouts", render: renderScouts, name: "scouts" },
  { test: (h) => h === "/tools", render: renderTools, name: "tools" },
  { test: (h) => h === "/rankings", render: renderRankings, name: "rankings" },
  { test: (h) => h === "/guides", render: renderGuides, name: "guides" },
  { test: (h) => h === "/news", render: renderNews, name: "news" },
  {
    test: (h) => h === "/about",
    render: () => renderProse("About MFTools", aboutCopy),
    name: "",
  },
  {
    test: (h) => h === "/privacy",
    render: () => renderProse("Privacy Policy", privacyCopy),
    name: "",
  },
  {
    test: (h) => h === "/disclaimer",
    render: () => renderProse("Disclaimer", disclaimerCopy),
    name: "",
  },
];

function router() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [path, query] = hash.split("?");
  const match = routes.find((r) => r.test(path));
  window.scrollTo({
    top: 0,
    behavior: "instant" in document.documentElement.style ? "instant" : "auto",
  });
  if (!match) {
    setActiveNav("");
    renderNotFound();
    return;
  }
  setActiveNav(match.name);
  showSkeleton(match.name);
  requestAnimationFrame(() => {
    match.render(path, new URLSearchParams(query || ""));
    observeReveal(app);
  });
}
function showSkeleton(routeName) {
  if (routeName !== "players") return; // only DB view benefits from skeleton loading
}
window.addEventListener("hashchange", router);

/* -------------------------------------------------------------------------
   5. VIEW: HOME
   ------------------------------------------------------------------------- */
function renderHome() {
  app.innerHTML = `
  <section class="hero">
    <div class="hero-field"></div>
    <div class="wrap">
      <div class="hero-inner">
        <p class="eyebrow">Mini Football Companion</p>
        <h1>The Ultimate <em>Mini Football</em> Companion</h1>
        <p class="hero-sub">Find player stats, compare players, discover the best scouts, calculate upgrades and improve your team — all in one place.</p>
        <div class="hero-actions">
          <a href="#/players" class="btn btn-primary">Explore Players</a>
          <a href="#/scouts" class="btn btn-secondary">Scout Tools</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Everything in one place</p>
        <h2>Built for every part of your squad</h2>
        <p>From scouting to squad building, MFTools covers the whole loop.</p>
      </div>
      <div class="grid grid-3" id="home-cards"></div>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <div class="feature-card reveal" style="background:linear-gradient(135deg, var(--blue-dim), var(--bg-elevated));">
        <div class="section-head-row" style="width:100%;">
          <div>
            <h3 style="margin-bottom:8px;">Know your squad before every match</h3>
            <p style="max-width:480px;">Compare any two players stat-for-stat, plan upgrades with real cost math, and never miss a scout window again.</p>
          </div>
          <a href="#/players" class="btn btn-primary">Start Comparing</a>
        </div>
      </div>
    </div>
  </section>`;

  const cards = [
    {
      href: "#/players",
      icon: "🗂️",
      title: "Player Database",
      desc: "Search every player with advanced filters by position, rarity, rating and more.",
    },
    {
      href: "#/scouts",
      icon: "🔭",
      title: "Scout Tools",
      desc: "Track scouts, calculate rewards and see your odds before you spend resources.",
    },
    {
      href: "#/tools",
      icon: "🧮",
      title: "Calculators",
      desc: "Upgrade, pack value, XP and currency calculators to plan every decision.",
    },
    {
      href: "#/rankings",
      icon: "🏆",
      title: "Rankings",
      desc: "Browse the best players by position, pace, defense, passing and more.",
    },
    {
      href: "#/guides",
      icon: "📘",
      title: "Guides",
      desc: "Beginner fundamentals through advanced economy and formation strategy.",
    },
    {
      href: "#/news",
      icon: "📰",
      title: "News",
      desc: "Stay current with the latest Mini Football updates and balance changes.",
    },
  ];
  const wrap = $("#home-cards");
  cards.forEach((c, i) => {
    const card =
      el(`<a href="${c.href}" class="feature-card reveal" style="transition-delay:${i * 40}ms">
      <div class="icon">${c.icon}</div>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <span class="card-link">Explore <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </a>`);
    wrap.appendChild(card);
  });
}

/* -------------------------------------------------------------------------
   5b. VIEW: PLAYERS (database)
   ------------------------------------------------------------------------- */
const dbState = {
  q: "",
  position: "",
  rarity: "",
  nation: "",
  club: "",
  league: "",
  minRating: 40,
  sort: "rating-desc",
  page: 1,
  pageSize: 12,
};

function renderPlayers() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Player Database</p>
        <h2>Find any player in seconds</h2>
        <p>Filter by position, rarity, rating and more, then compare or favorite the players that matter to your squad.</p>
      </div>
      <div class="db-layout">
        <aside class="filter-panel reveal" aria-label="Player filters">
          <h4>Filters</h4>
          <div class="search-box">
            <input type="text" id="f-search" placeholder="Search player name…" aria-label="Search players">
          </div>
          <div class="filter-group">
            <legend>Position</legend>
            <div class="chip-row" id="f-position"></div>
          </div>
          <div class="filter-group">
            <legend>Rarity</legend>
            <div class="chip-row" id="f-rarity"></div>
          </div>
          <div class="filter-group">
            <legend>Minimum Rating</legend>
            <div class="range-row">
              <input type="range" id="f-rating" min="40" max="99" value="${dbState.minRating}">
              <span class="range-val" id="f-rating-val">${dbState.minRating}</span>
            </div>
          </div>
          <div class="filter-group">
            <legend>Nationality</legend>
            <select id="f-nation"><option value="">All Nations</option>${NATIONS.map((n) => `<option value="${n}">${n}</option>`).join("")}</select>
          </div>
          <div class="filter-group">
            <legend>Club</legend>
            <select id="f-club"><option value="">All Clubs</option>${CLUBS.map((c) => `<option value="${c}">${c}</option>`).join("")}</select>
          </div>
          <div class="filter-group">
            <legend>League</legend>
            <select id="f-league"><option value="">All Leagues</option>${LEAGUES.map((l) => `<option value="${l}">${l}</option>`).join("")}</select>
          </div>
          <button class="btn btn-secondary btn-sm mt-24" id="f-reset" style="width:100%;">Reset Filters</button>
        </aside>

        <div>
          <div class="toolbar reveal">
            <p class="result-count"><b id="result-num">0</b> players found</p>
            <div class="sort-select">
              <select id="f-sort">
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="name-asc">Name: A–Z</option>
              </select>
            </div>
          </div>
          <div class="player-grid reveal" id="player-grid"></div>
          <div class="pagination" id="pagination"></div>
        </div>
      </div>
    </div>
  </section>`;

  // build chip filters
  const posRow = $("#f-position");
  ["All", ...POSITIONS].forEach((p) => {
    const chip = el(
      `<button class="chip ${p === "All" ? "active" : ""}" data-val="${p === "All" ? "" : p}">${p}</button>`,
    );
    chip.addEventListener("click", () => {
      dbState.position = chip.dataset.val;
      dbState.page = 1;
      $$(".chip", posRow).forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      applyFilters();
    });
    posRow.appendChild(chip);
  });
  const rarRow = $("#f-rarity");
  [{ id: "", label: "All" }, ...RARITIES].forEach((r) => {
    const chip = el(
      `<button class="chip ${r.id === "" ? "active" : ""}" data-val="${r.id}">${r.label}</button>`,
    );
    chip.addEventListener("click", () => {
      dbState.rarity = chip.dataset.val;
      dbState.page = 1;
      $$(".chip", rarRow).forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      applyFilters();
    });
    rarRow.appendChild(chip);
  });

  $("#f-search").addEventListener("input", (e) => {
    dbState.q = e.target.value;
    dbState.page = 1;
    applyFilters();
  });
  $("#f-rating").addEventListener("input", (e) => {
    dbState.minRating = +e.target.value;
    $("#f-rating-val").textContent = e.target.value;
    dbState.page = 1;
    applyFilters();
  });
  $("#f-nation").addEventListener("change", (e) => {
    dbState.nation = e.target.value;
    dbState.page = 1;
    applyFilters();
  });
  $("#f-club").addEventListener("change", (e) => {
    dbState.club = e.target.value;
    dbState.page = 1;
    applyFilters();
  });
  $("#f-league").addEventListener("change", (e) => {
    dbState.league = e.target.value;
    dbState.page = 1;
    applyFilters();
  });
  $("#f-sort").addEventListener("change", (e) => {
    dbState.sort = e.target.value;
    applyFilters();
  });
  $("#f-reset").addEventListener("click", () => {
    Object.assign(dbState, {
      q: "",
      position: "",
      rarity: "",
      nation: "",
      club: "",
      league: "",
      minRating: 40,
      sort: "rating-desc",
      page: 1,
    });
    renderPlayers();
  });

  // skeleton then load
  const grid = $("#player-grid");
  grid.innerHTML = Array.from({ length: 8 })
    .map(() => `<div class="skeleton-card"></div>`)
    .join("");
  fetchPlayers().then(() => setTimeout(applyFilters, 220));
}

function applyFilters() {
  let list = PLAYERS.filter((p) => {
    if (dbState.q && !p.name.toLowerCase().includes(dbState.q.toLowerCase()))
      return false;
    if (dbState.position && p.position !== dbState.position) return false;
    if (dbState.rarity && p.rarity !== dbState.rarity) return false;
    if (dbState.nation && p.nation !== dbState.nation) return false;
    if (dbState.club && p.club !== dbState.club) return false;
    if (dbState.league && p.league !== dbState.league) return false;
    if (p.rating < dbState.minRating) return false;
    return true;
  });
  list.sort((a, b) => {
    if (dbState.sort === "rating-desc") return b.rating - a.rating;
    if (dbState.sort === "rating-asc") return a.rating - b.rating;
    if (dbState.sort === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  $("#result-num").textContent = list.length;
  const totalPages = Math.max(1, Math.ceil(list.length / dbState.pageSize));
  dbState.page = Math.min(dbState.page, totalPages);
  const pageItems = list.slice(
    (dbState.page - 1) * dbState.pageSize,
    dbState.page * dbState.pageSize,
  );

  const grid = $("#player-grid");
  grid.innerHTML = "";
  if (!pageItems.length) {
    grid.appendChild(
      el(
        `<div class="empty-state" style="grid-column:1/-1;"><div class="icon">🔍</div><p>No players match those filters. Try widening your search.</p></div>`,
      ),
    );
  } else {
    pageItems.forEach((p) => grid.appendChild(playerCard(p)));
  }

  const pag = $("#pagination");
  pag.innerHTML = "";
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const b = el(
        `<button class="${i === dbState.page ? "active" : ""}">${i}</button>`,
      );
      b.addEventListener("click", () => {
        dbState.page = i;
        applyFilters();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      pag.appendChild(b);
    }
  }
}

function playerCard(p) {
  const card = el(`<article class="player-card">
    <div class="rarity-glow" style="--r-color:${p.rarityColor}"></div>
    <div class="pc-top">
      <div class="pc-rating">${p.rating}<span>${p.position}</span></div>
      <span class="rarity-tag" style="--r-color:${p.rarityColor}">${p.rarityLabel}</span>
    </div>
    <a href="#/players/${p.id}" class="pc-avatar">${p.avatar}</a>
    <a href="#/players/${p.id}"><div class="pc-name">${p.name}</div></a>
    <div class="pc-meta">${p.club} · ${p.nation}</div>
    <div class="pc-stats">
      <div class="pc-stat">PAC <b>${p.pace}</b></div>
      <div class="pc-stat">SHO <b>${p.shooting}</b></div>
      <div class="pc-stat">PAS <b>${p.passing}</b></div>
      <div class="pc-stat">DRI <b>${p.dribbling}</b></div>
      <div class="pc-stat">DEF <b>${p.defense}</b></div>
      <div class="pc-stat">PHY <b>${p.physical}</b></div>
    </div>
    <div class="pc-actions">
      <a href="#/players/${p.id}" class="btn btn-secondary btn-sm">View</a>
      <button class="btn btn-secondary btn-sm cmp-btn">Compare</button>
      <button class="btn btn-secondary btn-sm fav-btn ${favorites.has(p.id) ? "active" : ""}" aria-label="Favorite ${p.name}">★</button>
    </div>
  </article>`);
  $(".cmp-btn", card).addEventListener("click", () => {
    toggleCompare(p.id);
  });
  const favBtn = $(".fav-btn", card);
  favBtn.addEventListener("click", () => {
    toggleFavorite(p.id);
    favBtn.classList.toggle("active");
  });
  return card;
}

/* -------------------------------------------------------------------------
   5c. VIEW: PLAYER DETAIL
   ------------------------------------------------------------------------- */
function renderPlayerDetail(path, query) {
  const id = path.split("/")[2];
  const p = getPlayer(id);
  if (!p) {
    renderNotFound();
    return;
  }
  const vsId = query.get("vs");
  const vs = vsId ? getPlayer(vsId) : null;

  const similar = PLAYERS.filter(
    (x) => x.position === p.position && x.id !== p.id,
  )
    .sort(
      (a, b) => Math.abs(a.rating - p.rating) - Math.abs(b.rating - p.rating),
    )
    .slice(0, 6);

  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <a href="#/players" class="btn-ghost" style="display:inline-flex;margin-bottom:24px;">← Back to Player Database</a>

      <div class="player-hero reveal">
        <div class="player-hero-avatar" style="--r-color:${p.rarityColor}">${p.avatar}</div>
        <div>
          <span class="rarity-tag" style="--r-color:${p.rarityColor}">${p.rarityLabel}</span>
          <h1>${p.name}</h1>
          <p class="pos-tag">${p.position} · Overall ${p.rating}</p>
          <div class="tag-row">
            <span class="info-tag">Nation <b>${p.nation}</b></span>
            <span class="info-tag">Club <b>${p.club}</b></span>
            <span class="info-tag">League <b>${p.league}</b></span>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-primary" id="pd-fav">${favorites.has(p.id) ? "★ Favorited" : "☆ Add to Favorites"}</button>
            <button class="btn btn-secondary" id="pd-compare">Compare with another player</button>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div>
          <p class="panel-title">Stats</p>
          <div class="stat-panel reveal">
            ${statBar("Pace", p.pace)}
            ${statBar("Shooting", p.shooting)}
            ${statBar("Passing", p.passing)}
            ${statBar("Dribbling", p.dribbling)}
            ${statBar("Defense", p.defense)}
            ${statBar("Physical", p.physical)}
          </div>
        </div>
        <div>
          <p class="panel-title">${vs ? "Comparison" : "Recommended Upgrades"}</p>
          <div class="stat-panel reveal">
            ${vs ? compareBlock(p, vs) : upgradeBlock(p)}
          </div>
        </div>
      </div>

      <div style="margin-top:44px;">
        <p class="panel-title">Similar Players</p>
        <div class="similar-row reveal">
          ${similar
            .map(
              (s) => `<a class="mini-player" href="#/players/${s.id}">
            <div class="av">${s.avatar}</div>
            <div class="nm">${s.name}</div>
            <div class="rt">${s.rating} OVR · ${s.position}</div>
          </a>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>`;

  $("#pd-fav").addEventListener("click", () => {
    toggleFavorite(p.id);
    $("#pd-fav").textContent = favorites.has(p.id)
      ? "★ Favorited"
      : "☆ Add to Favorites";
  });
  $("#pd-compare").addEventListener("click", () => {
    toggleCompare(p.id);
    location.hash = "#/players";
  });
}

function compareBlock(a, b) {
  const rows = [
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defense",
    "physical",
  ];
  const labels = {
    pace: "Pace",
    shooting: "Shooting",
    passing: "Passing",
    dribbling: "Dribbling",
    defense: "Defense",
    physical: "Physical",
  };
  return (
    `<div style="display:flex;justify-content:space-between;margin-bottom:18px;font-size:13.5px;color:var(--text-2);">
      <span>${a.avatar} ${a.name}</span><span>${b.avatar} ${b.name}</span>
    </div>` +
    rows
      .map(
        (r) => `<div class="stat-bar-row">
      <div class="stat-bar-label"><b style="color:${a[r] >= b[r] ? "var(--pitch)" : "var(--text-2)"}">${a[r]}</b><span>${labels[r]}</span><b style="color:${b[r] >= a[r] ? "var(--pitch)" : "var(--text-2)"}">${b[r]}</b></div>
    </div>`,
      )
      .join("")
  );
}
function upgradeBlock(p) {
  const weakest = [
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defense",
    "physical",
  ]
    .sort((x, y) => p[x] - p[y])
    .slice(0, 3);
  const labels = {
    pace: "Pace",
    shooting: "Shooting",
    passing: "Passing",
    dribbling: "Dribbling",
    defense: "Defense",
    physical: "Physical",
  };
  return `<p style="color:var(--text-2);font-size:13.5px;margin-bottom:16px;">Based on this player's profile, training resources go furthest here:</p>
    <ul style="display:flex;flex-direction:column;gap:12px;">
      ${weakest
        .map(
          (
            w,
          ) => `<li style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;">
        <span>${labels[w]}</span><span style="font-family:var(--font-mono);color:var(--blue-bright);">${p[w]} → ${Math.min(99, p[w] + 6)}</span>
      </li>`,
        )
        .join("")}
    </ul>
    <a href="#/tools" class="btn btn-secondary btn-sm mt-24">Open Upgrade Calculator</a>`;
}

/* -------------------------------------------------------------------------
   5d. VIEW: SCOUTS
   ------------------------------------------------------------------------- */
let scoutTimerHandle = null;
function renderScouts() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Scout Tools</p>
        <h2>Time it right, spend with confidence</h2>
        <p>Track active scouts, estimate rewards and understand your odds before committing resources.</p>
      </div>
      <div class="grid grid-2">
        <div class="tool-panel reveal">
          <h3>⏱️ Scout Timer</h3>
          <p class="desc">Countdown until your current scout finishes.</p>
          <span style="color:#4f8ef7;"><strong>Common</strong></span> to <span style="color:#9b59b6;"><strong>Rare</strong></span> scouts take <strong>180 minutes</strong> (3 hour) to complete.<br>
          <span style="color:#9b59b6;"><strong>Rare</strong></span> to <span style="color:#f39c12;"><strong>Epic</strong></span> scouts take <strong>480 minutes</strong> (8 hours) to complete.<br>
          <span style="color:#f39c12;"><strong>Epic</strong></span> to <span style="color:#f1c40f;"><strong>Legendary</strong></span> scouts take <strong>720 minutes</strong> (12 hours) to complete.
          <div class="field-row">
            <label for="sc-minutes">Scout duration (minutes)</label>
            <input type="number" id="sc-minutes" value="720" min="1" max="720">
          </div>
          <div class="timer-progress"><div class="timer-progress-fill" id="sc-progress"></div></div>
          <div class="timer-display" id="sc-display">12:00:00</div>
          <div class="timer-actions">
            <button class="btn btn-primary" id="sc-start">Start</button>
            <button class="btn btn-secondary" id="sc-reset">Reset</button>
          </div>
        </div>

        <div class="tool-panel reveal">
          <h3> Scout Guide</h3>
          <p class="desc">How scouting actually works.</p>
          <ul style="display:flex;flex-direction:column;gap:14px;font-size:13.5px;color:var(--text-2);">
            <li><b style="color:var(--text-1);">Stack your queue.</b> Always keep a scout running — idle slots are wasted time, not saved resources.</li>
            <li><b style="color:var(--text-1);">Long scouts skew rarer.</b> Longer durations generally shift odds toward higher rarity pools.</li>
            <li><b style="color:var(--text-1);">Track your pity counter.</b> Many pools guarantee a rare-or-better after a set number of scouts — don't spend that streak on a short scout.</li>
            <li><b style="color:var(--text-1);">Budget in runs, not gems.</b> Decide how many scouts you can afford this week before you start, not after.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>`;

  // scout timer
  let totalSeconds = $("#sc-minutes").value * 60,
    remaining = totalSeconds,
    running = false;
  const display = $("#sc-display"),
    progress = $("#sc-progress"),
    startBtn = $("#sc-start");
  function fmt(s) {
    const hours = Math.floor(s / 3600),
      mins = Math.floor((s % 3600) / 60),
      secs = s % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  display.textContent = fmt(remaining);
  progress.style.width = "0%";
  function tick() {
    if (!running) return;
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      running = false;
      startBtn.textContent = "Start";
    }
    display.textContent = fmt(remaining);
    progress.style.width = `${100 - (remaining / totalSeconds) * 100}%`;
    if (running) scoutTimerHandle = setTimeout(tick, 1000);
  }
  $("#sc-minutes").addEventListener("change", (e) => {
    totalSeconds = Math.max(1, +e.target.value) * 60;
    remaining = totalSeconds;
    running = false;
    startBtn.textContent = "Start";
    display.textContent = fmt(remaining);
    progress.style.width = "0%";
    clearTimeout(scoutTimerHandle);
  });
  startBtn.addEventListener("click", () => {
    running = !running;
    startBtn.textContent = running ? "Pause" : "Start";
    if (running) tick();
    else clearTimeout(scoutTimerHandle);
  });
  $("#sc-reset").addEventListener("click", () => {
    running = false;
    clearTimeout(scoutTimerHandle);
    remaining = totalSeconds;
    startBtn.textContent = "Start";
    display.textContent = fmt(remaining);
    progress.style.width = "0%";
  });
}

/* -------------------------------------------------------------------------
   5e. VIEW: TOOLS
   ------------------------------------------------------------------------- */
function renderTools() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Calculators</p>
        <h2>Plan every resource before you spend it</h2>
        <p>Five focused calculators covering the decisions that matter most.</p>
      </div>
      <div class="grid grid-2">


        <div class="tool-panel reveal">
          <h3>📊 Collection Progress Tracker</h3>
          <p class="desc">Track how close you are to completing a rarity set.</p>
          <div class="field-inline">
            <div class="field-row"><label for="ct-owned">Players owned</label><input type="number" id="ct-owned" value="none" min="0"></div>
            <div class="field-row"><label for="ct-total">Total in set</label><input type="number" id="ct-total" value="none" min="1"></div>
          </div>
          <div class="stat-bar-row" style="margin-top:6px;">
            <div class="stat-bar-label"><span>Completion</span><b id="ct-pct">57%</b></div>
            <div class="stat-bar-track"><div class="stat-bar-fill" id="ct-fill" style="width:57%"></div></div>
          </div>
        </div>

        <div class="tool-panel reveal">
          <h3>⚡ XP Calculator</h3>
          <p class="desc">Matches needed to reach your next account level.</p>
          <div class="field-inline">
            <div class="field-row"><label for="xc-current">Current XP</label><input type="number" id="xc-current" value="none" min="0"></div>
            <div class="field-row"><label for="xc-needed">XP for next level</label><input type="number" id="xc-needed" value="none" min="1"></div>
          </div>
          <div class="field-row"><label for="xc-per">XP per match</label><input type="number" id="xc-per" value="none" min="1"></div>
          <div class="result-box">
            <div><div class="label">Matches Needed</div><div class="value" id="xc-result">/</div></div>
          </div>
        </div>

        

      </div>
    </div>
  </section>`;

  function bindLive(ids, fn) {
    ids.forEach((id) => $("#" + id).addEventListener("input", fn));
    fn();
  }

  bindLive(["ct-owned", "ct-total"], () => {
    const owned = +$("#ct-owned").value || 0,
      total = +$("#ct-total").value || 1;
    const pct = Math.min(100, Math.round((owned / total) * 100));
    $("#ct-pct").textContent = `${pct}%`;
    $("#ct-fill").style.width = `${pct}%`;
  });

  bindLive(["xc-current", "xc-needed", "xc-per"], () => {
    const cur = +$("#xc-current").value || 0,
      needed = +$("#xc-needed").value || 0,
      per = +$("#xc-per").value || 1;
    const remaining = Math.max(0, needed - cur);
    $("#xc-result").textContent = Math.ceil(remaining / per);
  });
}

/* -------------------------------------------------------------------------
   5f. VIEW: RANKINGS
   ------------------------------------------------------------------------- */
const RANK_STATS = [
  { id: "rating", label: "Overall" },
  { id: "position", label: "By Position" },
  { id: "pace", label: "Speed" },
  { id: "defense", label: "Defense" },
  { id: "passing", label: "Passing" },
  { id: "shooting", label: "Shooting" },
  { id: "physical", label: "Physical" },
];
function renderRankings() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Rankings</p>
        <h2>Top players, every category</h2>
        <p>Rankings update as the player pool changes. Switch categories to see who leads.</p>
      </div>
      <div class="tab-row reveal" id="rank-tabs"></div>
      <div class="tab-row reveal" id="rank-pos-tabs" style="display:none;"></div>
      <div class="rank-list reveal" id="rank-list"></div>
    </div>
  </section>`;

  const tabRow = $("#rank-tabs");
  RANK_STATS.forEach((s, i) => {
    const btn = el(
      `<button class="tab-btn ${i === 0 ? "active" : ""}" data-id="${s.id}">${s.label}</button>`,
    );
    btn.addEventListener("click", () => {
      $$(".tab-btn", tabRow).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      $("#rank-pos-tabs").style.display = s.id === "position" ? "flex" : "none";
      renderRankList(
        s.id,
        s.id === "position" ? posState || POSITIONS[0] : null,
      );
    });
    tabRow.appendChild(btn);
  });

  let posState = POSITIONS[0];
  const posRow = $("#rank-pos-tabs");
  POSITIONS.forEach((p, i) => {
    const btn = el(
      `<button class="tab-btn ${i === 0 ? "active" : ""}" data-pos="${p}">${p}</button>`,
    );
    btn.addEventListener("click", () => {
      $$(".tab-btn", posRow).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      posState = p;
      renderRankList("position", p);
    });
    posRow.appendChild(btn);
  });

  function renderRankList(statId, posFilter) {
    let list = [...PLAYERS];
    if (statId === "position")
      list = list
        .filter((p) => p.position === posFilter)
        .sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b[statId] - a[statId]);
    list = list.slice(0, 15);
    const valKey = statId === "position" ? "rating" : statId;
    const container = $("#rank-list");
    container.innerHTML = list
      .map(
        (p, i) => `
      <div class="rank-row">
        <div class="rank-num">${i + 1}</div>
        <div class="rank-av">${p.avatar}</div>
        <div>
          <div class="rank-name"><a href="#/players/${p.id}">${p.name}</a></div>
          <div class="rank-meta">${p.position} · ${p.club}</div>
        </div>
        <span class="rarity-tag hide-mobile" style="--r-color:${p.rarityColor}">${p.rarityLabel}</span>
        <div class="rank-value">${p[valKey]}</div>
      </div>`,
      )
      .join("");
  }
  renderRankList("rating", null);
}

/* -------------------------------------------------------------------------
   5g. VIEW: GUIDES
   ------------------------------------------------------------------------- */
function renderGuides() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Guides</p>
        <h2>Strategy for every stage</h2>
        <p>From your first squad to endgame economy management.</p>
      </div>
      <div class="grid grid-3" id="guide-grid"></div>
    </div>
  </section>`;
  const grid = $("#guide-grid");
  GUIDES.forEach((g, i) => {
    grid.appendChild(
      el(`<article class="guide-card reveal" style="transition-delay:${i * 40}ms">
      <div class="guide-thumb">${g.icon}</div>
      <div class="guide-body">
        <div class="guide-level">${g.level}</div>
        <h3>${g.title}</h3>
        <p>${g.desc}</p>
      </div>
    </article>`),
    );
  });
}

/* -------------------------------------------------------------------------
   5h. VIEW: NEWS
   ------------------------------------------------------------------------- */
function renderNews() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">News</p>
        <h2>Latest Mini Football updates</h2>
        <p>Balance changes, events and community highlights.</p>
      </div>
      <div class="grid grid-3" id="news-grid"></div>
    </div>
  </section>`;
  const grid = $("#news-grid");
  NEWS.forEach((n, i) => {
    grid.appendChild(
      el(`<article class="news-card reveal" style="transition-delay:${i * 40}ms">
      <div class="news-thumb"><span class="news-tag">${n.tag}</span>${n.icon}</div>
      <div class="news-body">
        <div class="news-date">${n.date}</div>
        <h3>${n.title}</h3>
        <p>${n.excerpt}</p>
        <span class="btn btn-secondary btn-sm">Read More</span>
      </div>
    </article>`),
    );
  });
}

/* -------------------------------------------------------------------------
   5i. STATIC PAGES + 404
   ------------------------------------------------------------------------- */
const aboutCopy = `<p>MFTools is an independent, fan-built companion for Mini Football. It brings together a player database, scouting math and upgrade planning so you can make decisions with real numbers instead of guesswork.</p>
<h3>What we track</h3><p>Player stats, rarity pools, scout odds and the resource costs behind every upgrade — kept in one consistent place instead of scattered across guides and forums.</p>
<h3>What's next</h3><p>Account sync, live pricing and a full team builder are on the roadmap as the site grows.</p>`;
const privacyCopy = `<p>MFTools does not require an account to use the database, calculators or guides. Favorites and theme preference are stored locally in your browser and are never sent to a server.</p>
<h3>Analytics</h3><p>If analytics are added in the future, this page will be updated to describe exactly what is collected and why.</p>`;
const disclaimerCopy = `<p>MFTools is a fan-made resource and is not affiliated with, endorsed by, or connected to the developer or publisher of Mini Football.</p>
<h3>Data accuracy</h3><p>Player stats, drop rates and calculator formulas are community-sourced estimates intended for planning purposes and may not exactly match in-game values.</p>`;

function renderProse(title, html) {
  app.innerHTML = `<section class="section"><div class="wrap"><div class="prose reveal"><h1>${title}</h1>${html}</div></div></section>`;
}
function renderNotFound() {
  app.innerHTML = `<div class="notfound">
    <div class="big">404</div>
    <h2>Offside — this page doesn't exist</h2>
    <p>The page you're looking for may have moved or never existed.</p>
    <a href="#/" class="btn btn-primary">Back to Home</a>
  </div>`;
}

/* -------------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initTheme();
  initNavToggle();
  initBackToTop();
  initSearch();
  renderCompareBar();
  router();
});
