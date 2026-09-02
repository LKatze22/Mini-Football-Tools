"use strict";
/* ==========================================================================
   MFTools — Application Script
   Structure:
     1. Mock data layer      (players, scouts, guides, news)
     2. Utilities            (formatting, storage, dom helpers)
     3. Global UI             (nav, theme, search, back-to-top, reveal)
     4. Router
     5. View renderers        (home, player detail, scouts, tools,
                                players (rankings), guides, news, static, 404)
   Players are entered manually in RAW_PLAYERS below (no random generation).
   fetchPlayers()/getPlayer() are kept as the data-access layer so the same
   render functions can later be pointed at a real API without changes.
   ========================================================================== */

/* -------------------------------------------------------------------------
   1. MOCK DATA LAYER
   ------------------------------------------------------------------------- */
const POSITIONS = ["GK", "DF", "MF", "ST"];
const RARITIES = [{ id: "mythical", label: "Mythical", color: "#bfebf5" }];
/* -------------------------------------------------------------------------
   PLAYER ROSTER — manually entered.
   To add a player, copy a row and fill in the fields:
     id       unique string, e.g. "p25"
     name     display name
     rating   overall rating, 0-99
     position one of POSITIONS above
     rarity   one of: "mythical"
     nation, club, league   free text
     pace / shooting / passing / dribbling / defense / physical   0-99
     avatar   an emoji shown as the player's icon
   rarityLabel/rarityColor are filled in automatically below from RARITIES,
   so you never have to type those by hand.
   ------------------------------------------------------------------------- */
const RAW_PLAYERS = [
  {
    id: "p1",
    name: "Spider",
    rating: 97,
    position: "GK",
    rarity: "mythical",
    realName: "Yashin",
    shooting: 96,
    passing: 95,
    sprinting: 99,
    tackle: 94,
    stamina_reflexes: 102,
    avatar: "🧤",
  },
  {
    id: "p2",
    name: "Super Stopper",
    rating: 97,
    position: "GK",
    rarity: "mythical",
    realName: "Buffon",
    shooting: 95,
    passing: 96,
    sprinting: 96,
    tackle: 94,
    stamina_reflexes: 102,
    avatar: "🧤",
  },
  {
    id: "p3",
    name: "Saint",
    rating: 96,
    position: "GK",
    rarity: "mythical",
    realName: "Casillas",
    shooting: 94,
    passing: 94,
    sprinting: 95,
    tackle: 94,
    stamina_reflexes: 101,
    avatar: "🧤",
  },
  {
    id: "p4",
    name: "Great Dane",
    rating: 94,
    position: "GK",
    rarity: "mythical",
    realName: "P. Schmeichel",
    shooting: 97,
    passing: 92,
    sprinting: 90,
    tackle: 91,
    stamina_reflexes: 102,
    avatar: "🧤",
  },
  {
    id: "p5",
    name: "Volcano",
    rating: 94,
    position: "GK",
    rarity: "mythical",
    realName: "Kahn",
    shooting: 91,
    passing: 93,
    sprinting: 93,
    tackle: 92,
    stamina_reflexes: 100,
    avatar: "🧤",
  },
  {
    id: "p6",
    name: "Mr Zero",
    rating: 92,
    position: "GK",
    rarity: "mythical",
    realName: "Chech",
    shooting: 90,
    passing: 91,
    sprinting: 92,
    tackle: 89,
    stamina_reflexes: 97,
    avatar: "🧤",
  },
  {
    id: "p7",
    name: "Scorpion",
    rating: 91,
    position: "GK",
    rarity: "mythical",
    realName: "Higuita",
    shooting: 93,
    passing: 88,
    sprinting: 88,
    tackle: 88,
    stamina_reflexes: 98,
    avatar: "🧤",
  },
  {
    id: "p8",
    name: "Numerodix",
    rating: 98,
    position: "MF",
    rarity: "mythical",
    realName: "Zidane",
    shooting: 99,
    passing: 100,
    sprinting: 95,
    tackle: 95,
    stamina_reflexes: 99,
    avatar: "⚽",
  },
  {
    id: "p9",
    name: "El Cerebro",
    rating: 97,
    position: "MF",
    rarity: "mythical",
    realName: "Iniesta",
    shooting: 97,
    passing: 101,
    sprinting: 96,
    tackle: 92,
    stamina_reflexes: 97,
    avatar: "⚽",
  },
  {
    id: "p10",
    name: "El Pibe",
    rating: 97,
    position: "MF",
    rarity: "mythical",
    realName: "Valderrama",
    shooting: 97,
    passing: 100,
    sprinting: 96,
    tackle: 94,
    stamina_reflexes: 97,
    avatar: "⚽",
  },
  {
    id: "p11",
    name: "The Waiter",
    rating: 97,
    position: "MF",
    rarity: "mythical",
    realName: "Kroos", // TODO
    shooting: 97,
    passing: 101,
    sprinting: 93,
    tackle: 94,
    stamina_reflexes: 98,
    avatar: "⚽",
  },
  {
    id: "p12",
    name: "Dribble",
    rating: 96,
    position: "MF",
    rarity: "mythical",
    realName: "Kaka",
    shooting: 96,
    passing: 98,
    sprinting: 100,
    tackle: 89,
    stamina_reflexes: 96,
    avatar: "⚽",
  },
  {
    id: "p13",
    name: "Magnificent",
    rating: 96,
    position: "MF",
    rarity: "mythical",
    realName: "Seedorf",
    shooting: 100,
    passing: 99,
    sprinting: 92,
    tackle: 95,
    stamina_reflexes: 96,
    avatar: "⚽",
  },
  {
    id: "p14",
    name: "The Knight",
    rating: 96,
    position: "MF",
    rarity: "mythical",
    realName: "B. Charlton",
    shooting: 97,
    passing: 94,
    sprinting: 99,
    tackle: 92,
    stamina_reflexes: 100,
    avatar: "⚽",
  },
  {
    id: "p15",
    name: "Architect",
    rating: 95,
    position: "MF",
    rarity: "mythical",
    realName: "Pirlo",
    shooting: 97,
    passing: 102,
    sprinting: 86,
    tackle: 91,
    stamina_reflexes: 97,
    avatar: "⚽",
  },
  {
    id: "p16",
    name: "Elephant Orange",
    rating: 95,
    position: "MF",
    rarity: "mythical",
    realName: "Y. Toure",
    shooting: 94,
    passing: 95,
    sprinting: 93,
    tackle: 94,
    stamina_reflexes: 97,
    avatar: "⚽",
  },
  {
    id: "p17",
    name: "The Bison",
    rating: 94,
    position: "MF",
    rarity: "mythical",
    realName: "Essien",
    shooting: 92,
    passing: 92,
    sprinting: 94,
    tackle: 95,
    stamina_reflexes: 96,
    avatar: "⚽",
  },
  {
    id: "p18",
    name: "Hide",
    rating: 94,
    position: "MF",
    rarity: "mythical",
    realName: "Nakata",
    shooting: 96,
    passing: 94,
    sprinting: 93,
    tackle: 93,
    stamina_reflexes: 95,
    avatar: "⚽",
  },
  {
    id: "p19",
    name: "Marekiaro",
    rating: 94,
    position: "MF",
    rarity: "mythical",
    realName: "Hamsik",
    shooting: 99,
    passing: 99,
    sprinting: 94,
    tackle: 84,
    stamina_reflexes: 94,
    avatar: "⚽",
  },
  {
    id: "p20",
    name: "Adaptor",
    rating: 93,
    position: "MF",
    rarity: "mythical",
    realName: "Lampart",
    shooting: 97,
    passing: 99,
    sprinting: 87,
    tackle: 91,
    stamina_reflexes: 92,
    avatar: "⚽",
  },
  {
    id: "p21",
    name: "Spice Boy",
    rating: 93,
    position: "MF",
    rarity: "mythical",
    realName: "Beckham",
    shooting: 96,
    passing: 100,
    sprinting: 93,
    tackle: 88,
    stamina_reflexes: 89,
    avatar: "⚽",
  },
  {
    id: "p22",
    name: "Fishion",
    rating: 92,
    position: "MF",
    rarity: "mythical",
    realName: "Ozil",
    shooting: 95,
    passing: 100,
    sprinting: 83,
    tackle: 85,
    stamina_reflexes: 96,
    avatar: "⚽",
  },
  {
    id: "p23",
    name: "Gladiator",
    rating: 92,
    position: "MF",
    rarity: "mythical",
    realName: "Totti",
    shooting: 93,
    passing: 92,
    sprinting: 87,
    tackle: 95,
    stamina_reflexes: 93,
    avatar: "⚽",
  },
  {
    id: "p24",
    name: "Stevie G",
    rating: 92,
    position: "MF",
    rarity: "mythical",
    realName: "Gerrad",
    shooting: 97,
    passing: 95,
    sprinting: 88,
    tackle: 89,
    stamina_reflexes: 93,
    avatar: "⚽",
  },
  {
    id: "p25",
    name: "Captain",
    rating: 97,
    position: "DF",
    rarity: "mythical",
    realName: "Maldini",
    shooting: 95,
    passing: 95,
    sprinting: 96,
    tackle: 102,
    stamina_reflexes: 99,
    avatar: "🛡️",
  },
  {
    id: "p26",
    name: "Emperor",
    rating: 97,
    position: "DF",
    rarity: "mythical",
    realName: "Beckenbauer",
    shooting: 94,
    passing: 97,
    sprinting: 93,
    tackle: 102,
    stamina_reflexes: 99,
    avatar: "🛡️",
  },
  {
    id: "p27",
    name: "Roberto Carlos",
    rating: 97,
    position: "DF",
    rarity: "mythical",
    realName: "Roberto Carlos",
    shooting: 100,
    passing: 94,
    sprinting: 99,
    tackle: 94,
    stamina_reflexes: 96,
    avatar: "🛡️",
  },
  {
    id: "p28",
    name: "Il Azzurri",
    rating: 96,
    position: "DF",
    rarity: "mythical",
    realName: "Azzurri",
    shooting: 93,
    passing: 95,
    sprinting: 93,
    tackle: 101,
    stamina_reflexes: 96,
    avatar: "🛡️",
  },
  {
    id: "p29",
    name: "El Loco",
    rating: 95,
    position: "DF",
    rarity: "mythical",
    realName: "Marcelo",
    shooting: 89,
    passing: 99,
    sprinting: 100,
    tackle: 96,
    stamina_reflexes: 91,
    avatar: "🛡️",
  },
  {
    id: "p30",
    name: "El Tractor",
    rating: 95,
    position: "DF",
    rarity: "mythical",
    realName: "Zanetti",
    shooting: 88,
    passing: 96,
    sprinting: 95,
    tackle: 100,
    stamina_reflexes: 95,
    avatar: "🛡️",
  },
  {
    id: "p31",
    name: "Keyser",
    rating: 95,
    position: "DF",
    rarity: "mythical",
    realName: "Chiellini",
    shooting: 90,
    passing: 93,
    sprinting: 93,
    tackle: 102,
    stamina_reflexes: 97,
    avatar: "🛡️",
  },
  {
    id: "p32",
    name: "President",
    rating: 95,
    position: "DF",
    rarity: "mythical",
    realName: "Kompany",
    shooting: 88,
    passing: 95,
    sprinting: 94,
    tackle: 100,
    stamina_reflexes: 96,
    avatar: "🛡️",
  },
  {
    id: "p33",
    name: "Gazelle",
    rating: 94,
    position: "DF",
    rarity: "mythical",
    realName: "Evra",
    shooting: 84,
    passing: 92,
    sprinting: 98,
    tackle: 100,
    stamina_reflexes: 97,
    avatar: "🛡️",
  },
  {
    id: "p34",
    name: "Snowflake",
    rating: 94,
    position: "DF",
    rarity: "mythical",
    realName: "Koeman",
    shooting: 102,
    passing: 95,
    sprinting: 83,
    tackle: 99,
    stamina_reflexes: 91,
    avatar: "🛡️",
  },
  {
    id: "p35",
    name: "Alchemist",
    rating: 100,
    position: "ST",
    rarity: "mythical",
    realName: "Cruyff",
    shooting: 102,
    passing: 99,
    sprinting: 102,
    tackle: 95,
    stamina_reflexes: 101,
    avatar: "⚡",
  },
  {
    id: "p36",
    name: "Phenomeon",
    rating: 99,
    position: "ST",
    rarity: "mythical",
    realName: "Ronaldo",
    shooting: 102,
    passing: 95,
    sprinting: 101,
    tackle: 95,
    stamina_reflexes: 100,
    avatar: "⚡",
  },
  {
    id: "p37",
    name: "Threepeat",
    rating: 99,
    position: "ST",
    rarity: "mythical",
    realName: "Pele",
    shooting: 101,
    passing: 97,
    sprinting: 102,
    tackle: 96,
    stamina_reflexes: 99,
    avatar: "⚡",
  },
  {
    id: "p38",
    name: "D10s",
    rating: 99,
    position: "ST",
    rarity: "mythical",
    realName: "Maradona",
    shooting: 100,
    passing: 100,
    sprinting: 100,
    tackle: 93,
    stamina_reflexes: 101,
    avatar: "⚡",
  },
  {
    id: "p39",
    name: "Magician",
    rating: 98,
    position: "ST",
    rarity: "mythical",
    realName: "Ronaldinho",
    shooting: 99,
    passing: 97,
    sprinting: 101,
    tackle: 92,
    stamina_reflexes: 100,
    avatar: "⚡",
  },
  {
    id: "p40",
    name: "El Ferrari",
    rating: 97,
    position: "ST",
    rarity: "mythical",
    realName: "Raul",
    shooting: 103,
    passing: 96,
    sprinting: 96,
    tackle: 88,
    stamina_reflexes: 100,
    avatar: "⚡",
  },
  {
    id: "p41",
    name: "Panther",
    rating: 97,
    position: "ST",
    rarity: "mythical",
    realName: "Eusebio",
    shooting: 101,
    passing: 95,
    sprinting: 101,
    tackle: 92,
    stamina_reflexes: 94,
    avatar: "⚡",
  },
  {
    id: "p42",
    name: "Ribo",
    rating: 97,
    position: "ST",
    rarity: "mythical",
    realName: "Rivaldo",
    shooting: 101,
    passing: 96,
    sprinting: 100,
    tackle: 88,
    stamina_reflexes: 98,
    avatar: "⚡",
  },
  {
    id: "p43",
    name: "Titi",
    rating: 97,
    position: "ST",
    rarity: "mythical",
    realName: "Thierry Henry",
    shooting: 100,
    passing: 96,
    sprinting: 102,
    tackle: 92,
    stamina_reflexes: 96,
    avatar: "⚡",
  },
  {
    id: "p44",
    name: "Gugu",
    rating: 97,
    position: "ST",
    rarity: "mythical",
    realName: "Ruud Gullit",
    shooting: 97,
    passing: 96,
    sprinting: 98,
    tackle: 99,
    stamina_reflexes: 96,
    avatar: "⚡",
  },
  {
    id: "p45",
    name: "The Gaffer",
    rating: 96,
    position: "ST",
    rarity: "mythical",
    realName: "Kenny Dalglish",
    shooting: 103,
    passing: 94,
    sprinting: 102,
    tackle: 87,
    stamina_reflexes: 96,
    avatar: "⚡",
  },
  {
    id: "p46",
    name: "Ivory Giant",
    rating: 96,
    position: "ST",
    rarity: "mythical",
    realName: "Drogba",
    shooting: 101,
    passing: 93,
    sprinting: 98,
    tackle: 91,
    stamina_reflexes: 95,
    avatar: "⚡",
  },
  {
    id: "p47",
    name: "The King",
    rating: 95,
    position: "ST",
    rarity: "mythical",
    realName: "Cantona",
    shooting: 100,
    passing: 96,
    sprinting: 95,
    tackle: 88,
    stamina_reflexes: 95,
    avatar: "⚡",
  },
  {
    id: "p48",
    name: "The Golfer",
    rating: 95,
    position: "ST",
    rarity: "mythical",
    realName: "Gareth Bale",
    shooting: 99,
    passing: 95,
    sprinting: 100,
    tackle: 86,
    stamina_reflexes: 94,
    avatar: "⚡",
  },
  {
    id: "p49",
    name: "Powergoal",
    rating: 94,
    position: "ST",
    rarity: "mythical",
    realName: "Batistuta",
    shooting: 100,
    passing: 92,
    sprinting: 98,
    tackle: 84,
    stamina_reflexes: 96,
    avatar: "⚡",
  },
  {
    id: "p50",
    name: "Sheva",
    rating: 94,
    position: "ST",
    rarity: "mythical",
    realName: "Shevchenko",
    shooting: 100,
    passing: 95,
    sprinting: 95,
    tackle: 88,
    stamina_reflexes: 94,
    avatar: "⚡",
  },
  {
    id: "p51",
    name: "Beatle",
    rating: 94,
    position: "ST",
    rarity: "mythical",
    realName: "Best",
    shooting: 98,
    passing: 96,
    sprinting: 101,
    tackle: 77,
    stamina_reflexes: 96,
    avatar: "⚡",
  },
  {
    id: "p52",
    name: "Codino",
    rating: 93,
    position: "ST",
    rarity: "mythical",
    realName: "Roberto Baggio",
    shooting: 98,
    passing: 100,
    sprinting: 97,
    tackle: 85,
    stamina_reflexes: 86,
    avatar: "⚡",
  },
  {
    id: "p53",
    name: "Master Belt",
    rating: 93,
    position: "ST",
    rarity: "mythical",
    realName: "Ibra",
    shooting: 98,
    passing: 94,
    sprinting: 94,
    tackle: 84,
    stamina_reflexes: 95,
    avatar: "⚡",
  },
  {
    id: "p54",
    name: "El Matador",
    rating: 91,
    position: "ST",
    rarity: "mythical",
    realName: "Cavani",
    shooting: 97,
    passing: 91,
    sprinting: 87,
    tackle: 86,
    stamina_reflexes: 94,
    avatar: "⚡",
  },
  {
    id: "p55",
    name: "Mister LA",
    rating: 91,
    position: "ST",
    rarity: "mythical",
    realName: "Donovan",
    shooting: 96,
    passing: 89,
    sprinting: 101,
    tackle: 77,
    stamina_reflexes: 94,
    avatar: "⚡",
  },
  {
    id: "p56",
    name: "Tigerheart",
    rating: 93,
    position: "DF",
    rarity: "mythical",
    realName: "Puyol",
    shooting: 93,
    passing: 89,
    sprinting: 88,
    tackle: 100,
    stamina_reflexes: 97,
    avatar: "🛡️",
  },
  {
    id: "p57",
    name: "Bonnibauer",
    rating: 91,
    position: "DF",
    rarity: "mythical",
    realName: "Bonucci",
    shooting: 81,
    passing: 85,
    sprinting: 91,
    tackle: 101,
    stamina_reflexes: 95,
    avatar: "🛡️",
  },
  {
    id: "p58",
    name: "Waka Waka",
    rating: 91,
    position: "DF",
    rarity: "mythical",
    realName: "Pique",
    shooting: 85,
    passing: 87,
    sprinting: 88,
    tackle: 100,
    stamina_reflexes: 95,
    avatar: "🛡️",
  },
  {
    id: "p59",
    name: "Smiley",
    rating: 98,
    position: "DF",
    rarity: "mythical",
    realName: "Cafu",
    shooting: 93,
    passing: 98,
    sprinting: 101,
    tackle: 99,
    stamina_reflexes: 97,
    avatar: "🛡️",
  },
  {
    id: "p60",
    name: "Godot",
    rating: 96,
    position: "ST",
    rarity: "mythical",
    realName: "Del Piero",
    shooting: 103,
    passing: 97,
    sprinting: 99,
    tackle: 85,
    stamina_reflexes: 96,
    avatar: "⚡",
  },
];

const PLAYERS = RAW_PLAYERS.map((p) => {
  const r = RARITIES.find((x) => x.id === p.rarity);
  return { ...p, rarityLabel: r.label, rarityColor: r.color };
});
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
    content: `<p>Your first week decides how smooth the rest of your season goes. Focus on fielding a balanced XI before you chase individual star players — a coherent formation beats a squad of mismatched specialists.</p>
    <h3>Priorities for day 1-3</h3>
    <p>Claim every early tutorial reward, complete the starter quest and claim the daily login bonuses, missing even one early login can set your resource curve back noticeably. Spend early coins on training your starting XI rather than saving for a single big pull. Play games to earn additional rewards and gain experience in the actual games.</p>
    <h3>Priorities for day 4-7</h3>
    <p>Start using the scout and check the official Mini-Football Discord for the latest update, community discussions and if you have questions.
    Join a club you like, in the Offical Mini-Football Discord there is a channel called club recruiting where admins of clubs, that want more members can promote their club.</p>`,
  },
  {
    id: "teams",
    level: "Intermediate",
    icon: "🛡️",
    title: "Best Teams to Build Around",
    desc: "Balanced squad archetypes for every budget, from starter XIs to endgame rosters.",
    content: `<p>Rather than chasing the single highest-rated player available, build around an archetype that matches resources you actually have.</p>
    <h3>Budget squads</h3>
    <p>A disciplined back four with two holding midfielders wins more games at low levels than an attack-heavy squad with a leaky defense. Prioritize matching stats over rarity when funds are tight.</p>
    <h3>Endgame rosters</h3>
    <p>Once you're pulling legendary players regularly, specialize: pick two or three roles (wing play, direct strikers, possession midfield) and commit your best pulls there instead of spreading upgrades evenly.</p>`,
  },
  {
    id: "formations",
    level: "Intermediate",
    icon: "📐",
    title: "Best Formations & When to Use Them",
    desc: "How 4-3-3, 4-2-3-1 and 3-5-2 behave differently and which fits your play style.",
    content: `<p>Formation choice changes how forgiving your squad is to positioning mistakes, so pick one that matches both your players and your playstyle.</p>
    <h3>4-3-3</h3>
    <p>Best when you have two strong wingers and a possession-minded midfield three. It pressures high but can be exposed on the counter if your fullbacks push too far forward.</p>
    <h3>4-2-3-1</h3>
    <p>The most balanced all-round option — double pivot midfielders protect the defense while a single striker gets service from an attacking midfielder.</p>
    <h3>3-5-2</h3>
    <p>Rewards squads with strong wing-backs and central midfielders, giving you a numbers advantage in midfield at the cost of natural width.After Kick-off from the opponent/ or in general you have a great chance to win the ball back.</p>`,
  },
  {
    id: "tips",
    level: "All Levels",
    icon: "💡",
    title: "Tips & Tricks Most Players Miss",
    desc: "Small habits — from scout timing to training queues — that compound over a season.",
    content: `<p>None of these tips are game-changing on their own, but together they add up over a full season.</p>
    <ul>
    <li>Use the scout regularly and check the official Mini-Football Discord for the latest updates and community discussions.</li>
    <li>Use the mythical player list to compare and get info about the stats of different players.</li>
    <li>Just keep playing Matches, Tournaments and other game modes to earn rewards and gain experience.</li>
    <li>Have fun and just dont quit when things get tough! The community is here to support you. And you gonna get better with time.</li>
    </ul>`,
  },
  {
    id: "FAQ",
    level: "All Levels",
    icon: "❓",
    title: "Frequently Asked Questions",
    desc: "A few common questions and answers that come up for new and returning managers.",
    content: `
    <h3>How good do my team needs to be to compete in Mythical Cup?</h3>
    <p>
    <span style="font-weight: bold;">AKA_2DA027 answer:</span><br>Team strength of 700+ can be enough, but to be on the safe side it should be 730+.<br>
    It depends a lot on how strong certain players are. It is often better to have some stronger ones and some weaker ones than an evenly balanced team.<br><br>
    But in my experience, more than team strength / OVR, a better benchmark is to see whether someone is ready for Mythical Cup is how well the do in the seasonal cup, and also Legend's Cup.<br>
    Especially when there are legendary cards on the line.<br><br>
    The bots in the seasonal cup are already quite strong, and you got to get used to playing and winning when some good cards are on the line.
    </p>
    <h3>How to get more diamonds?</h3>
    <p><span style="font-weight: bold;">AKA_2DA027 answer:</span><br>
    You have to pick up all freebies you get daily:<br>
    Daily deals (2x or 3x  five gems)<br>
    Free prizes (30 gems)<br>
    Ads pack (about 20 gems)<br><br>

    Then be part of a club where you get about 240 gems a week just for the club challenges.<br>
    Weekly missions also add up, you might need to refresh. Could be 100 - 190 gems a week.<br>
    Then individual rewards for world, country ranking.<br><br>

    In total you should collect 1000 gems a week for free just from the above.<br> Much more if you place very high in the leaderboards.<br>
    Game modes such as win streak and Endless Power also give gems that add up.<br>
    Any other gems through the club's world & league ranking are a bonus.<br><br>

    Golden shots get you 250 gems, so get good at converting them 🙂</p>

    <h3>Is there an active redeem code</h3>
    <p>Currently there is no active redeem code</p>
    <h3>Formations</h3>
    <p>In general the best formations are 4-4-2 and 3-5-2 but it depends on your playstyle and squad composition.</p>`,
  },
];

const NEWS = [
  {
    id: "n1",
    tag: "Update",
    date: "Aug 20, 2026",
    icon: "⚽",
    title: "Version 4.13.0 Preview: Road to Glory",
    excerpt:
      "Faster matchmaking, new confirmation popups and the Road to Glory season arrive in the next update.",
    content: `<p>Version 4.13.0 is rolling out next week and is expected to be available to everyone on Wednesday.</p>
    <h3>Bug fixes &amp; improvements</h3>
    <ul>
    <li><strong>Faster matchmaking:</strong> Opponents will be ready sooner so you can get on the pitch quicker.</li>
    <li><strong>Confirmation popups:</strong> New confirmation steps help prevent accidental gem spending, donations and similar actions.</li>
    <li><strong>Removed beachball from Lucky Shot:</strong> This unintentional side effect has been fixed, making Lucky Shot easier to play.</li>
    <li><strong>Various small improvements:</strong> Small touchups include removing the flying gems when claiming a Club Challenge reward.</li>
    </ul>
    <h3>Road to Glory launches August 20</h3>
    <p>A fresh new season introduces Tall Titan, Smiley and Godot, adding another strong defender and attacking options to the player pool.</p>
    <p>Mini Football also turns six this September, with special birthday events expected to start at the very end of August.</p>
    <p>The new Instant Play Reward track gives you an extra daily reward for winning matches in any mode, in addition to victory packs and other specific rewards.</p>`,
  },
  {
    id: "n2",
    tag: "Update",
    date: "Aug 10, 2026",
    icon: "🎲",
    title: "Chaos Rules Starts August 10",
    excerpt:
      "A new game mode brings 14 random match modifiers, including Fumble Keeper, Golden Goal, Pressure Timer and No Goalie.",
    content: `<p><strong>New game mode available next week for anyone on v4.12.0.</strong></p>
    <p>Adapt to unpredictable match conditions using fresh new strategies. At the start of every Chaos Rules match, each team gets hit with a unique rule randomly selected from a pool of 14 total modifiers, including <em>Fumble Keeper</em>, <em>Golden Goal</em>, <em>Pressure Timer</em> and <em>No Goalie</em>, just to name a few.</p>
    <h3>We want your feedback!</h3>
    <p>We need your help tuning the rules and effects. Jump in, play a few matches, and <a href="https://discord.com/channels/1298199867432374295/1536282146963062835" target="_blank" rel="noopener noreferrer">head over to the feedback channels</a> to let us know:</p>
    <ul>
    <li>What rules or match-ups did you like?</li>
    <li>What needs a tweak or rebalance? This can be a rule itself, duration, effects or something else.</li>
    <li>What brand-new rules should we add next?</li>
    </ul>
    <p>Thanks in advance! See you on the pitch ⚽</p>`,
  },
  {
    id: "n3",
    tag: "Event",
    date: "Aug 20, 2026",
    icon: "🏆",
    title: "Champion Event Shop Is Live!",
    excerpt:
      "The Champion Event Shop is live with exclusive Heroic rewards, Legendary kits, a new Prestige Pack and two new collection sets.",
    content: `<p>The new event shop is live! Alongside the exclusive Heroic rewards and Legendary kits, an all-new Prestige Pack is now available.</p>
    <p>Earn event currency by completing missions, playing Draft Tournament mode and claiming rewards from the shop, or receive it with specific purchases.</p>
    <h3>What's inside the Prestige Pack?</h3>
    <p>Grab your chance at rare Mythical, Hero, TCP and RTTF characters. If you're looking to upgrade your Class A squad or finally make the jump past Legendaries, this is the pack to pull.</p>
    <h3>New Set Collections</h3>
    <p>Two brand-new sets are now available. If you already hold the required cards, head over to claim your free rewards and give your team an extra boost.</p>`,
  },
  {
    id: "n4",
    tag: "Update",
    date: "Aug 24, 2026",
    icon: "🏆",
    title: "v4.12.0 Preview: Champions Event Shop & Draft Tournament",
    excerpt:
      "New ultra-rare rewards, improved Draft Tournament rewards, collection sets and v4.12.0 improvements arrive next week.",
    content: `<p><strong>Coming next Monday.</strong> No update is required if you're already on v4.11.0.</p>
    <h3>Champions Event Shop</h3>
    <p>New and returning ultra-rare rewards are coming to the shop, including a very special pack you won't want to miss.</p>
    <h3>Draft Tournament</h3>
    <p>The Draft Tournament has been tweaked based on your feedback, with higher event currency rewards expected this time around. <a href="https://discord.com/channels/1298199867432374295/1527281520879075369" target="_blank" rel="noopener noreferrer">Read more about it here</a>.</p>
    <h3>New Collection Sets</h3>
    <p>Two brand-new sets go live Monday, specially curated for legacy collectors.</p>
    <h3>v4.12.0 update preview</h3>
    <p>Version 4.12.0 is rolling out next week with the following bug fixes and improvements:</p>
    <ul>
    <li><strong>Google Login:</strong> Canceling or aborting won't get you stuck in the app anymore.</li>
    <li><strong>Profile Badge:</strong> Fixed confusing or missing badge icons when unlocking new avatars.</li>
    <li><strong>Season Pass:</strong> Player cards now update properly when claimed from the track.</li>
    <li><strong>Tablet Support:</strong> Polished the Tier Up screen layout for tablet devices.</li>
    <li><strong>Lucky Shot:</strong> Removed the Beach Ball from accidentally showing up there.</li>
    <li><strong>Stability:</strong> Multiple under-the-hood fixes help prevent most occurring crashes.</li>
    </ul>
    <h3>New features:</h3>
    <ul>
    <li>A new game mode is going live August 10th, with a full reveal coming next week.</li>
    <li>A promo-exclusive ball design is coming to the game by popular request.</li>
    </ul>`,
  },
  {
    id: "n5",
    tag: "Update",
    date: "Aug 3, 2026",
    icon: "🤝",
    title: "Rebalancing Club Points for Card Donations",
    excerpt:
      "Club donation points are being adjusted according to the average max ratings of each card rarity.",
    content: `<p>We've seen ongoing community debates about how card donations weigh against match performance in club points.</p>
    <p>To get a clearer picture, we reviewed data across all clubs. Even in top clubs, match results account for more than half of all points, but donations can make a noticeable impact. To keep donations rewarding for the overall player base, we decided not to touch limits or cooldowns. We're tweaking the point values instead, aligning points per card according to their respective average max ratings relative to other rarities.</p>
    <p>Effective <code>&lt;t:1785740400:F&gt;</code>, we're adjusting club points earned in the existing donation system as follows:</p>
    <div class="donation-table-wrap">
      <table>
        <thead>
          <tr><th>Rarity</th><th>Before</th><th>After</th></tr>
        </thead>
        <tbody>
          <tr><td>Common</td><td>1</td><td>1</td></tr>
          <tr><td>Rare</td><td>2</td><td>2</td></tr>
          <tr><td>Epic</td><td>5</td><td>4</td></tr>
          <tr><td>Legendary</td><td>15</td><td>7</td></tr>
          <tr><td>Ultra Legendary</td><td>15</td><td>7</td></tr>
          <tr><td>RTTF and TCP</td><td>25</td><td>7</td></tr>
          <tr><td>Hero</td><td>20</td><td>10</td></tr>
          <tr><td>Mythical</td><td>20</td><td>10</td></tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: "n6",
    tag: "Update",
    date: "Jul 23, 2026",
    icon: "📢",
    title: "Update v4.11.0 Is Rolling Out Now",
    excerpt:
      "Version 4.11.0 is rolling out over the next couple of days alongside the Lovers of the Game season.",
    content: `<p><strong>Mini Football v4.11.0</strong> will become available to everyone over the next couple of days.</p>
    <p>Besides the highlights mentioned earlier, it's time to kick off the <strong>Lovers of the Game</strong> season on July 23rd!</p>
    <p>Introducing The Bison, Dreads and Powergol so you can dominate every position on the field. Enjoy!</p>`,
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
      if (compareList[0]) {
        location.hash = `#/players/${compareList[0]}${compareList[1] ? "?vs=" + compareList[1] : ""}`;
        compareList = [];
        renderCompareBar();
      }
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
    {
      threshold: 0.01,
      rootMargin: "0px 0px -6% 0px",
    },
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
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
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
  {
    test: (h) => /^\/players\/[\w-]+/.test(h),
    render: renderPlayerDetail,
    name: "players",
  },
  { test: (h) => h === "/scouts", render: renderScouts, name: "scouts" },
  { test: (h) => h === "/tools", render: renderTools, name: "tools" },
  { test: (h) => h === "/players", render: renderPlayers, name: "players" },
  { test: (h) => h === "/guides", render: renderGuides, name: "guides" },
  {
    test: (h) => /^\/guides\/[\w-]+/.test(h),
    render: renderGuideDetail,
    name: "guides",
  },
  { test: (h) => h === "/news", render: renderNews, name: "news" },
  {
    test: (h) => /^\/news\/[\w-]+/.test(h),
    render: renderNewsDetail,
    name: "news",
  },
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
  requestAnimationFrame(() => {
    match.render(path, new URLSearchParams(query || ""));
    observeReveal(app);
  });
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
        <p class="eyebrow">Mini Football Tools - MFTools</p>
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
      href: "#/players",
      icon: "🏆",
      title: "Players",
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
   5b. Player Database list view removed — Players nav now points to
   the rankings-based view (see renderPlayers below).
   ------------------------------------------------------------------------- */
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
            <span class="info-tag">Real Name <b>${p.realName}</b></span>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-primary" id="pd-fav">${favorites.has(p.id) ? "★ Favorited" : "☆ Add to Favorites"}</button>
            ${
              vs
                ? `<button class="btn btn-secondary" id="pd-compare-clear">✕ Clear Comparison</button>`
                : `<button class="btn btn-secondary" id="pd-compare">Compare with another player</button>`
            }
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div>
          <p class="panel-title">${vs ? "Comparison" : "Stats"}</p>
          <div class="stat-panel reveal">
            ${
              vs
                ? compareBlock(p, vs)
                : `${statBar("Shooting", p.shooting)}
            ${statBar("Passing", p.passing)}
            ${statBar("Sprinting", p.sprinting)}
            ${statBar("Tackle", p.tackle)}
            ${statBar("Stamina/Reflexes", p.stamina_reflexes)}`
            }
          </div>
        </div>

      <div style="margin-top:44px;">
        <p class="panel-title">Players with the same position</p>
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
  if (vs) {
    $("#pd-compare-clear").addEventListener("click", () => {
      compareList = [];
      renderCompareBar();
      location.hash = `#/players/${p.id}`;
    });
  } else {
    $("#pd-compare").addEventListener("click", () => {
      toggleCompare(p.id);
      location.hash = "#/players";
    });
  }
}

function compareBlock(a, b) {
  const rows = [
    "rating",
    "shooting",
    "passing",
    "sprinting",
    "tackle",
    "stamina_reflexes",
  ];
  const labels = {
    rating: "Overall",
    shooting: "Shooting",
    passing: "Passing",
    sprinting: "Sprinting",
    tackle: "Tackle",
    stamina_reflexes: "Stamina/Reflexes",
  };
  return (
    `<div class="compare-head">
      <a href="#/players/${a.id}" class="compare-player">
        <div class="compare-av" style="--r-color:${a.rarityColor}">${a.avatar}</div>
        <div class="compare-name">${a.name}</div>
      </a>
      <span class="compare-vs">VS</span>
      <a href="#/players/${b.id}" class="compare-player">
        <div class="compare-av" style="--r-color:${b.rarityColor}">${b.avatar}</div>
        <div class="compare-name">${b.name}</div>
      </a>
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
    "shooting",
    "passing",
    "sprinting",
    "tackle",
    "stamina_reflexes",
  ]
    .sort((x, y) => p[x] - p[y])
    .slice(0, 3);
  const labels = {
    shooting: "Shooting",
    passing: "Passing",
    sprinting: "Sprinting",
    tackle: "Tackle",
    stamina: "Stamina/Reflexes",
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
            <li><b style="color:var(--text-1);">Buying Epic Cards in the shop</b>You can buy epic cards with coins in the shop and trade 40 epic into two legendary cards. </li>
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
          <h3>🎲 Probability Calculator</h3>
          <p class="desc">Chance of landing at least one legendary/mythical  across your selected number of packs.</p>
          <div class="field-inline">
            <div class="field-row"><label for="pc-n">Number of packs</label><input type="number" id="pc-n" value="20" min="1"></div>
            <div class="field-row"><label for="pc-p">Drop rate (%)</label><input type="number" id="pc-p" value="3" min="0" max="100" step="0.1"></div>
          </div>
          <div class="result-box">
            <div><div class="label">Chance of ≥1 Legendary / Mythical</div><div class="value" id="pc-result">45.1%</div></div>
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

  function updateProb() {
    const n = +$("#pc-n").value || 0,
      p = (+$("#pc-p").value || 0) / 100;
    const chance = (1 - Math.pow(1 - p, n)) * 100;
    $("#pc-result").textContent = `${chance.toFixed(1)}%`;
  }
  $$("#pc-n, #pc-p").forEach((i) => i.addEventListener("input", updateProb));
  updateProb();

  bindLive(["xc-current", "xc-needed", "xc-per"], () => {
    const cur = +$("#xc-current").value || 0,
      needed = +$("#xc-needed").value || 0,
      per = +$("#xc-per").value || 1;
    const remaining = Math.max(0, needed - cur);
    $("#xc-result").textContent = Math.ceil(remaining / per);
  });
}

/* -------------------------------------------------------------------------
   5f. VIEW: PLAYERS (rankings-based)
   ------------------------------------------------------------------------- */
const RANK_STATS = [
  { id: "rating", label: "Overall" },
  { id: "position", label: "By Position" },
  { id: "shooting", label: "Shooting" },
  { id: "passing", label: "Passing" },
  { id: "sprinting", label: "Sprinting" },
  { id: "tackle", label: "Tackle" },
  { id: "stamina_reflexes", label: "Stamina/Reflexes" },
  { id: "custom", label: "Combine Stats" },
];
/* Stats that can be mixed together in the "Combine Stats" tab, e.g. Tackle
   (Defense) + Sprinting (Speed) to find the best all-round defenders. */
const COMBINABLE_STATS = [
  { id: "rating", label: "Overall" },
  { id: "shooting", label: "Shooting" },
  { id: "passing", label: "Passing" },
  { id: "sprinting", label: "Sprinting (Speed)" },
  { id: "tackle", label: "Tackle (Defense)" },
  { id: "stamina_reflexes", label: "Stamina/Reflexes" },
];
function renderPlayers() {
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="eyebrow">Players</p>
        <h2>Top players, every category</h2>
        <p>Rankings update as the player pool changes. Switch categories to see who leads.</p>
      </div>
      <div class="tab-row reveal" id="rank-tabs"></div>
      <div class="tab-row reveal" id="rank-pos-tabs" style="display:none;"></div>
      <div class="combo-panel reveal" id="rank-combo-panel" style="display:none;">
        <p class="combo-hint">Pick two or more stats to build your own ranking — for example combine
          <b>Tackle</b> (Defense) and <b>Sprinting</b> (Speed) to find the best all-round defenders.</p>
        <div class="chip-row" id="combo-chip-row"></div>
        <div class="combo-weights" id="combo-weights"></div>
      </div>
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
      $("#rank-combo-panel").style.display =
        s.id === "custom" ? "block" : "none";
      if (s.id === "custom") {
        renderComboChips();
        renderComboWeights();
      }
      renderRankList(
        s.id,
        s.id === "position" ? posState || POSITIONS[0] : null,
      );
    });
    tabRow.appendChild(btn);
  });

  // "Combine Stats" tab state: which stats are mixed in, and how heavily
  // each one is weighted (1x-3x) relative to the others. Pre-populated with
  // Tackle + Sprinting (Defense + Speed) as a ready-made example.
  const comboState = new Map([
    ["tackle", 1],
    ["sprinting", 1],
  ]);

  function renderComboChips() {
    const row = $("#combo-chip-row");
    row.innerHTML = "";
    COMBINABLE_STATS.forEach((s) => {
      const chip = el(
        `<button type="button" class="chip ${comboState.has(s.id) ? "active" : ""}" data-id="${s.id}">${s.label}</button>`,
      );
      chip.addEventListener("click", () => {
        if (comboState.has(s.id)) comboState.delete(s.id);
        else comboState.set(s.id, 1);
        renderComboChips();
        renderComboWeights();
        renderRankList("custom", null);
      });
      row.appendChild(chip);
    });
  }

  function renderComboWeights() {
    const wrap = $("#combo-weights");
    const ids = [...comboState.keys()];
    if (!ids.length) {
      wrap.innerHTML = `<p class="combo-hint">Select at least one stat above to build a combined ranking.</p>`;
      return;
    }
    wrap.innerHTML = ids
      .map((id) => {
        const label = COMBINABLE_STATS.find((s) => s.id === id).label;
        const w = comboState.get(id);
        return `<div class="range-row combo-weight-row" data-weight-id="${id}">
          <span class="combo-weight-label">${label}</span>
          <input type="range" min="1" max="3" step="1" value="${w}">
          <span class="range-val">${w}×</span>
        </div>`;
      })
      .join("");
    $$("[data-weight-id]", wrap).forEach((row) => {
      const id = row.dataset.weightId;
      const input = row.querySelector("input[type=range]");
      const val = row.querySelector(".range-val");
      input.addEventListener("input", () => {
        comboState.set(id, Number(input.value));
        val.textContent = `${input.value}×`;
        renderRankList("custom", null);
      });
    });
  }

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
    const container = $("#rank-list");
    let comboIds = [];

    if (statId === "position") {
      list = list
        .filter((p) => p.position === posFilter)
        .sort((a, b) => b.rating - a.rating);
    } else if (statId === "custom") {
      comboIds = [...comboState.keys()];
      if (!comboIds.length) {
        container.innerHTML = `<div class="search-empty">Select at least one stat above to build a combined ranking.</div>`;
        return;
      }
      const totalWeight = comboIds.reduce(
        (sum, id) => sum + comboState.get(id),
        0,
      );
      list.forEach((p) => {
        p._comboScore =
          comboIds.reduce((sum, id) => sum + p[id] * comboState.get(id), 0) /
          totalWeight;
      });
      list.sort((a, b) => b._comboScore - a._comboScore);
    } else {
      list.sort((a, b) => b[statId] - a[statId]);
    }
    list = list.slice(0, 100);
    const valKey = statId === "position" ? "rating" : statId;

    container.innerHTML = list
      .map((p, i) => {
        const value =
          statId === "custom" ? p._comboScore.toFixed(1) : p[valKey];
        const meta =
          statId === "custom"
            ? `${p.position} · ${comboIds.map((id) => `${COMBINABLE_STATS.find((s) => s.id === id).label.split(" (")[0]} ${p[id]}`).join(" · ")}`
            : `${p.position} · ${p.realName}`;
        return `
      <div class="rank-row">
        <div class="rank-num">${i + 1}</div>
        <div class="rank-av">${p.avatar}</div>
        <div>
          <div class="rank-name"><a href="#/players/${p.id}">${p.name}</a></div>
          <div class="rank-meta">${meta}</div>
        </div>
        <span class="rarity-tag hide-mobile" style="--r-color:${p.rarityColor}">${p.rarityLabel}</span>
        <div class="rank-value">${value}</div>
      </div>`;
      })
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
      el(`<a href="#/guides/${g.id}" class="guide-card reveal" style="transition-delay:${i * 40}ms">
      <div class="guide-thumb">${g.icon}</div>
      <div class="guide-body">
        <div class="guide-level" data-level="${g.level}">${g.level}</div>
        <h3>${g.title}</h3>
        <p>${g.desc}</p>
      </div>
    </a>`),
    );
  });
}

/* -------------------------------------------------------------------------
   5g-2. VIEW: GUIDE DETAIL
   ------------------------------------------------------------------------- */
function renderGuideDetail(path) {
  const id = path.split("/")[2];
  const g = GUIDES.find((x) => x.id === id);
  if (!g) {
    renderNotFound();
    return;
  }
  const more = GUIDES.filter((x) => x.id !== g.id).slice(0, 3);
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <a href="#/guides" class="btn btn-secondary btn-sm" style="margin-bottom:20px;display:inline-flex">← All Guides</a>
      <article class="prose reveal">
        <div class="guide-level" data-level="${g.level}">${g.level}</div>
        <h1>${g.icon} ${g.title}</h1>
        ${g.content}
      </article>
      ${
        more.length
          ? `<div class="section-head reveal" style="margin-top:48px"><h2>More guides</h2></div>
      <div class="grid grid-3" id="guide-more"></div>`
          : ""
      }
    </div>
  </section>`;
  if (more.length) {
    const grid = $("#guide-more");
    more.forEach((mg, i) => {
      grid.appendChild(
        el(`<a href="#/guides/${mg.id}" class="guide-card reveal" style="transition-delay:${i * 40}ms">
        <div class="guide-thumb">${mg.icon}</div>
        <div class="guide-body">
          <div class="guide-level" data-level="${mg.level}">${mg.level}</div>
          <h3>${mg.title}</h3>
          <p>${mg.desc}</p>
        </div>
      </a>`),
      );
    });
  }
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
      el(`<a href="#/news/${n.id}" class="news-card reveal" style="transition-delay:${i * 40}ms">
      <div class="news-thumb"><span class="news-tag" data-tag="${n.tag}">${n.tag}</span>${n.icon}</div>
      <div class="news-body">
        <div class="news-date">${n.date}</div>
        <h3>${n.title}</h3>
        <p>${n.excerpt}</p>
        <span class="btn btn-secondary btn-sm">Read More</span>
      </div>
    </a>`),
    );
  });
}

/* -------------------------------------------------------------------------
   5h-2. VIEW: NEWS DETAIL
   ------------------------------------------------------------------------- */
function renderNewsDetail(path) {
  const id = path.split("/")[2];
  const n = NEWS.find((x) => x.id === id);
  if (!n) {
    renderNotFound();
    return;
  }
  const more = NEWS.filter((x) => x.id !== n.id).slice(0, 3);
  app.innerHTML = `
  <section class="section-tight">
    <div class="wrap">
      <a href="#/news" class="btn btn-secondary btn-sm" style="margin-bottom:20px;display:inline-flex">← All News</a>
      <article class="prose reveal">
        <div class="news-date">${n.tag} · ${n.date}</div>
        <h1>${n.icon} ${n.title}</h1>
        ${n.content}
      </article>
      ${
        more.length
          ? `<div class="section-head reveal" style="margin-top:48px"><h2>More news</h2></div>
      <div class="grid grid-3" id="news-more"></div>`
          : ""
      }
    </div>
  </section>`;
  if (more.length) {
    const grid = $("#news-more");
    more.forEach((mn, i) => {
      grid.appendChild(
        el(`<a href="#/news/${mn.id}" class="news-card reveal" style="transition-delay:${i * 40}ms">
        <div class="news-thumb"><span class="news-tag" data-tag="${mn.tag}">${mn.tag}</span>${mn.icon}</div>
        <div class="news-body">
          <div class="news-date">${mn.date}</div>
          <h3>${mn.title}</h3>
          <p>${mn.excerpt}</p>
          <span class="btn btn-secondary btn-sm">Read More</span>
        </div>
      </a>`),
      );
    });
  }
}

/* -------------------------------------------------------------------------
   5i. STATIC PAGES + 404
   ------------------------------------------------------------------------- */
const aboutCopy = `<p>MFTools is an independent, fan-built companion for Mini Football. It brings together player stats, scouting math and upgrade planning so you can make decisions with real numbers instead of guesswork.</p>
<h3>Developers & Supporters</h3>
<div class="supporter-card single-card">
  <div class="supporter-row">
    <span class="supporter-role">Developer</span>
    <a class="supporter-link" href="https://github.com/LKatze22" target="_blank" rel="noopener noreferrer">LKatze22</a>
  </div>
  <div class="supporter-row">
    <span class="supporter-role">Supporters</span>
    <div class="supporter-stack">
      <p>AKA_2DA027</p>
      <p>Baluni</p>
      <p>S♱S</p>
    </div>
  </div>
</div>
<h3>What we track</h3><p>Player stats, rarity pools, scout odds and the resource costs behind every upgrade — kept in one consistent place instead of scattered across guides and forums.</p>
<h3>What's next</h3><p>You're gonna see 😊</p>`;
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
  hideLoadingScreen();
});

function hideLoadingScreen() {
  const screen = $("#loading-screen");
  if (!screen) return;
  // Keep it up for at least one pass of the animation so it doesn't just flash.
  const MIN_VISIBLE_MS = 1400;
  window.setTimeout(() => {
    screen.classList.add("is-hidden");
    screen.addEventListener("transitionend", () => screen.remove(), {
      once: true,
    });
  }, MIN_VISIBLE_MS);
}
