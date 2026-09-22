import { createServerFn } from "@tanstack/react-start";

const STREAMED_MIRRORS = ["https://streamed.su/api", "https://streamed.pk/api"];

export type Sport = { id: string; name: string };

export type Team = { name: string; badge?: string };

export type Match = {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular?: boolean;
  teams?: { home?: Team; away?: Team };
  sources: { source: string; id: string }[];
  league?: string;
  status?: string;
};

export type StreamFeed = {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
  viewers: number;
};

// 24/7 Live sports channels, tournaments, and esports arena streams
const CURATED_LIVE_STREAMS: Match[] = [
  {
    id: "live-redbull-tv",
    title: "Red Bull TV — Live Action & Extreme Sports",
    category: "Action Sports",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Red Bull World Tour",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/200px-RedBullEnergyDrink.svg.png",
      },
      away: {
        name: "Extreme Athletes",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sport_balls.svg/200px-Sport_balls.svg.png",
      },
    },
    sources: [
      { source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" },
      { source: "twitch", id: "redbull" },
    ],
  },
  {
    id: "live-rocket-league-rlcs",
    title: "RLCS — Rocket League Championship Series Live",
    category: "Esports",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Team Vitality",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Team_Vitality_logo.svg/200px-Team_Vitality_logo.svg.png",
      },
      away: {
        name: "Karmine Corp",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Karmine_Corp_logo.svg/200px-Karmine_Corp_logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "rocketleague" }],
  },
  {
    id: "live-riot-games-lol",
    title: "League of Legends Pro World Tour",
    category: "Esports",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "T1 Esports",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/T1_esports_logo.svg/200px-T1_esports_logo.svg.png",
      },
      away: {
        name: "Gen.G Champions",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gen.G_logo.svg/200px-Gen.G_logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "riotgames" }],
  },
  {
    id: "live-valorant-champions",
    title: "VCT — Valorant Champions Tour Live Arena",
    category: "Esports",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Sentinels",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sentinels_logo.svg/200px-Sentinels_logo.svg.png",
      },
      away: {
        name: "Paper Rex",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Paper_Rex_logo.svg/200px-Paper_Rex_logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "valorant" }],
  },
  {
    id: "live-esl-cs2",
    title: "ESL Pro League — Counter-Strike 2 Arena",
    category: "Esports",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "FaZe Clan",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/FaZe_Clan.svg/200px-FaZe_Clan.svg.png",
      },
      away: {
        name: "Natus Vincere",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/NaVi_logo.svg/200px-NaVi_logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "eslcs" }],
  },
  {
    id: "live-ea-sports-fc",
    title: "EA Sports FC Pro Championship Live",
    category: "Football",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Real Madrid CF",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png",
      },
      away: {
        name: "Manchester City",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/200px-Manchester_City_FC_badge.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "easportsfc" }],
  },
  {
    id: "live-fide-chess",
    title: "FIDE World Masters & Grand Prix Arena",
    category: "Chess",
    date: Date.now(),
    poster: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Grandmaster White",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/FIDE_logo.svg/200px-FIDE_logo.svg.png",
      },
      away: {
        name: "Grandmaster Black",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/FIDE_logo.svg/200px-FIDE_logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "chess" }],
  },
  {
    id: "live-world-surf-league",
    title: "WSL Championship Tour — Live Global Surfing",
    category: "Action Sports",
    date: Date.now(),
    poster: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "WSL Men's Heat",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/World_Surf_League_logo.svg/200px-World_Surf_League_logo.svg.png",
      },
      away: {
        name: "WSL Women's Heat",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/World_Surf_League_logo.svg/200px-World_Surf_League_logo.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UC--3c8RqSfAqYBdDjIG3UNA" }],
  },
  {
    id: "live-ipl-csk-mi",
    title: "IPL T20 Arena — Chennai Super Kings vs Mumbai Indians",
    category: "Cricket",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Chennai Super Kings",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/200px-Chennai_Super_Kings_Logo.svg.png",
      },
      away: {
        name: "Mumbai Indians",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/200px-Mumbai_Indians_Logo.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
  {
    id: "live-f1-gp-championship",
    title: "Formula 1 Grand Prix — Live Race Day Paddock & Track",
    category: "Motorsport & F1",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Red Bull Racing",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Red_Bull_Racing_logo.svg/200px-Red_Bull_Racing_logo.svg.png",
      },
      away: {
        name: "Scuderia Ferrari",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Scuderia_Ferrari_Logo.svg/200px-Scuderia_Ferrari_Logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "f1" }],
  },
  {
    id: "live-ufc-world-fight-night",
    title: "UFC World Championship Fight Night — Main Card Live",
    category: "Combat Sports & MMA",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Champion Corner",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/UFC_logo.svg/200px-UFC_logo.svg.png",
      },
      away: {
        name: "Challenger Corner",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/UFC_logo.svg/200px-UFC_logo.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
  {
    id: "live-wimbledon-grand-slam",
    title: "Wimbledon Championship — Center Court Live Arena",
    category: "Tennis",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Carlos Alcaraz",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sport_balls.svg/200px-Sport_balls.svg.png",
      },
      away: {
        name: "Novak Djokovic",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sport_balls.svg/200px-Sport_balls.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UC--3c8RqSfAqYBdDjIG3UNA" }],
  },
  {
    id: "live-nba-lakers-celtics",
    title: "NBA Live Showdown — Los Angeles Lakers vs Boston Celtics",
    category: "Basketball",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Los Angeles Lakers",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/200px-Los_Angeles_Lakers_logo.svg.png",
      },
      away: {
        name: "Boston Celtics",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/200px-Boston_Celtics.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "nba" }],
  },
  {
    id: "live-ucl-madrid-bayern",
    title: "UEFA Champions League Semi-Final — Real Madrid vs Bayern Munich",
    category: "Football",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Real Madrid",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png",
      },
      away: {
        name: "Bayern Munich",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
  {
    id: "live-cricket-wc-ind-aus",
    title: "ICC World Cup Championship Final — India vs Australia Live",
    category: "Cricket",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "India Men's National",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Board_of_Control_for_Cricket_in_India_logo.svg/200px-Board_of_Control_for_Cricket_in_India_logo.svg.png",
      },
      away: {
        name: "Australia Men's National",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Cricket_Australia_logo.svg/200px-Cricket_Australia_logo.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
  {
    id: "live-f1-monaco-gp",
    title: "Formula 1 Monaco Grand Prix — Live Street Circuit & Qualifying",
    category: "Motorsport & F1",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Scuderia Ferrari",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Scuderia_Ferrari_Logo.svg/200px-Scuderia_Ferrari_Logo.svg.png",
      },
      away: {
        name: "Mercedes-AMG Petronas",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg/200px-Mercedes_AMG_Petronas_F1_Logo.svg.png",
      },
    },
    sources: [{ source: "twitch", id: "f1" }],
  },
  {
    id: "live-epl-arsenal-chelsea",
    title: "Premier League London Derby — Arsenal vs Chelsea",
    category: "Football",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Arsenal FC",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/200px-Arsenal_FC.svg.png",
      },
      away: {
        name: "Chelsea FC",
        badge: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/200px-Chelsea_FC.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
  {
    id: "live-boxing-fury-usyk",
    title: "Undisputed World Heavyweight Championship — Tyson Fury vs Oleksandr Usyk",
    category: "Combat Sports & MMA",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "Tyson Fury (The Gypsy King)",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sport_balls.svg/200px-Sport_balls.svg.png",
      },
      away: {
        name: "Oleksandr Usyk (The Cat)",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sport_balls.svg/200px-Sport_balls.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
  {
    id: "live-wwe-wrestlemania",
    title: "WWE WrestleMania Live Arena — Championship Showdown",
    category: "Combat Sports & MMA",
    date: Date.now(),
    popular: true,
    poster: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    teams: {
      home: {
        name: "WWE Champion",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/WWE_Logo.svg/200px-WWE_Logo.svg.png",
      },
      away: {
        name: "Royal Rumble Winner",
        badge: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/WWE_Logo.svg/200px-WWE_Logo.svg.png",
      },
    },
    sources: [{ source: "youtube", id: "live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw" }],
  },
];

function toYouTubeEmbedUrl(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.includes("youtube.com/watch?v=")) {
    const id = urlOrId.split("watch?v=")[1]?.split("&")[0];
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1`;
  }
  if (urlOrId.includes("youtu.be/")) {
    const id = urlOrId.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1`;
  }
  if (urlOrId.startsWith("live_stream")) {
    return `https://www.youtube-nocookie.com/embed/${urlOrId}&autoplay=1&enablejsapi=1`;
  }
  if (urlOrId.startsWith("http")) {
    return urlOrId;
  }
  return `https://www.youtube-nocookie.com/embed/${urlOrId}?autoplay=1&enablejsapi=1`;
}

// Convert TheSportsDB event into standard Match object
function mapTSDBEvent(e: any): Match {
  return {
    id: `tsdb-${e.idEvent}`,
    title: e.strEvent || `${e.strHomeTeam} vs ${e.strAwayTeam}`,
    category: e.strSport || "Sports",
    league: e.strLeague || undefined,
    date: e.strTimestamp ? new Date(e.strTimestamp).getTime() : e.dateEvent ? new Date(e.dateEvent).getTime() : Date.now(),
    poster: e.strThumb || e.strPoster || e.strSquare || undefined,
    popular: true,
    teams: {
      ...(e.strHomeTeam ? { home: { name: e.strHomeTeam as string, ...(e.strHomeTeamBadge ? { badge: e.strHomeTeamBadge as string } : {}) } } : {}),
      ...(e.strAwayTeam ? { away: { name: e.strAwayTeam as string, ...(e.strAwayTeamBadge ? { badge: e.strAwayTeamBadge as string } : {}) } } : {}),
    },
    sources: e.strVideo
      ? [
        { source: "youtube", id: e.strVideo },
        { source: "thesportsdb", id: e.idEvent },
      ]
      : [
        { source: "youtube", id: `https://www.youtube.com/results?search_query=${encodeURIComponent(e.strEvent + " highlights")}` },
        { source: "thesportsdb", id: e.idEvent },
      ],
  };
}

async function fetchFromStreamedMirrors<T>(path: string, fallback: T): Promise<T> {
  for (const mirror of STREAMED_MIRRORS) {
    try {
      const res = await fetch(`${mirror}${path}`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      // try next mirror
    }
  }
  return fallback;
}

// Fetch today's and featured events from TheSportsDB
async function fetchTheSportsDBEvents(): Promise<Match[]> {
  const matches: Match[] = [];
  const today = new Date().toISOString().split("T")[0];

  const endpoints = [
    `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}`,
    `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4328&s=2024-2025`, // Premier League
    `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4387&s=2024-2025`, // NBA
    `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4370&s=2024`,      // Formula 1
    `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4391&s=2024`,      // NFL
    `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4480&s=2024-2025`, // Champions League
  ];

  const results = await Promise.allSettled(
    endpoints.map(async (url) => {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return [];
      const json = await res.json();
      return (json.events || []) as any[];
    }),
  );

  const seen = new Set<string>();
  for (const result of results) {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      for (const e of result.value) {
        if (!e.idEvent || seen.has(e.idEvent)) continue;
        seen.add(e.idEvent);
        matches.push(mapTSDBEvent(e));
      }
    }
  }

  return matches;
}

export const getSports = createServerFn({ method: "GET" }).handler(async (): Promise<Sport[]> => {
  return [
    { id: "all", name: "All Sports" },
    { id: "football", name: "Football / Soccer" },
    { id: "basketball", name: "Basketball" },
    { id: "cricket", name: "Cricket" },
    { id: "esports", name: "Esports & Gaming" },
    { id: "motorsport", name: "Motorsport & F1" },
    { id: "action-sports", name: "Action & Extreme" },
    { id: "american-football", name: "American Football / NFL" },
    { id: "athletics", name: "Athletics & Olympics" },
    { id: "combat", name: "Combat Sports & MMA" },
    { id: "tennis", name: "Tennis" },
    { id: "chess", name: "Chess Masters" },
    { id: "baseball", name: "Baseball" },
    { id: "rugby", name: "Rugby" },
    { id: "badminton", name: "Badminton" },
  ];
});

export const getLiveMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  // 1. Try community mirrors
  const communityLive = await fetchFromStreamedMirrors<Match[]>("/matches/live", []);

  // 2. Fetch TheSportsDB live events
  const today = new Date().toISOString().split("T")[0];
  let tsdbLive: Match[] = [];
  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}`, {
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const json = await res.json();
      tsdbLive = (json.events || []).map(mapTSDBEvent);
    }
  } catch {
    // fallback gracefully
  }

  // Combine curated 24/7 channels, community live streams, and TheSportsDB live fixtures
  return [...CURATED_LIVE_STREAMS, ...communityLive, ...tsdbLive];
});

export const getTodayMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  const [communityToday, tsdbEvents] = await Promise.all([
    fetchFromStreamedMirrors<Match[]>("/matches/all-today", []),
    fetchTheSportsDBEvents(),
  ]);

  return [...CURATED_LIVE_STREAMS, ...tsdbEvents, ...communityToday];
});

export const getSportMatches = createServerFn({ method: "GET" })
  .inputValidator((data: { sport: string }) => data)
  .handler(async ({ data }): Promise<Match[]> => {
    const [live, today] = await Promise.all([getLiveMatches(), getTodayMatches()]);
    const all = [...live, ...today];

    const target = data.sport.toLowerCase();
    if (target === "all") return all;

    return all.filter((m) => {
      const cat = (m.category || "").toLowerCase();
      const title = (m.title || "").toLowerCase();
      const league = (m.league || "").toLowerCase();

      if (target === "football") {
        return cat.includes("football") || cat.includes("soccer") || league.includes("premier") || league.includes("champions");
      }
      if (target === "basketball") {
        return cat.includes("basketball") || league.includes("nba");
      }
      if (target === "cricket") {
        return cat.includes("cricket") || title.includes("ipl") || title.includes("csk") || title.includes("mumbai indians");
      }
      if (target === "motorsport") {
        return cat.includes("motorsport") || cat.includes("racing") || league.includes("formula") || title.includes("f1");
      }
      if (target === "esports") {
        return cat.includes("esport") || title.includes("league of legends") || title.includes("vct") || title.includes("cs2") || title.includes("rlcs");
      }
      if (target === "action-sports") {
        return cat.includes("action") || title.includes("red bull") || title.includes("surf");
      }
      if (target === "american-football") {
        return cat.includes("american") || league.includes("nfl");
      }
      if (target === "combat") {
        return cat.includes("combat") || cat.includes("fight") || cat.includes("boxing") || cat.includes("mma") || cat.includes("ufc");
      }
      if (target === "tennis") {
        return cat.includes("tennis") || title.includes("wimbledon");
      }
      if (target === "chess") {
        return cat.includes("chess");
      }
      if (target === "rugby") {
        return cat.includes("rugby");
      }
      if (target === "badminton") {
        return cat.includes("badminton");
      }
      return cat.includes(target) || title.includes(target);
    });
  });

export const getMatchById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const [live, today] = await Promise.all([getLiveMatches(), getTodayMatches()]);
    const all = [...live, ...today];
    let match = all.find((m) => m.id === data.id) ?? null;

    // If not found in cache and is a TheSportsDB ID, look up directly
    if (!match && data.id.startsWith("tsdb-")) {
      const rawId = data.id.replace("tsdb-", "");
      try {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${rawId}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.events?.[0]) {
            match = mapTSDBEvent(json.events[0]);
          }
        }
      } catch {
        // fallback
      }
    }

    const isLive = live.some((m) => m.id === data.id);
    return { match, isLive };
  });

export const getStreamFeeds = createServerFn({ method: "GET" })
  .inputValidator((data: { source: string; id: string }) => data)
  .handler(async ({ data }): Promise<StreamFeed[]> => {
    const { source, id } = data;

    // 1. YouTube feeds
    if (source === "youtube") {
      const embedUrl = toYouTubeEmbedUrl(id);
      return [
        {
          id: `yt-${id}-1`,
          streamNo: 1,
          language: "English (Official HD)",
          hd: true,
          embedUrl,
          source: "YouTube Official",
          viewers: 18450,
        },
      ];
    }

    // 2. Twitch feeds
    if (source === "twitch") {
      const channel = encodeURIComponent(id);
      // Embed URL with parent parameter to support localhost and production
      const embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=localhost&parent=127.0.0.1&autoplay=true&muted=false`;
      const embedUrlMuted = `https://player.twitch.tv/?channel=${channel}&parent=localhost&parent=127.0.0.1&autoplay=true&muted=true`;
      return [
        {
          id: `twitch-${id}-1`,
          streamNo: 1,
          language: "English (Audio On)",
          hd: true,
          embedUrl,
          source: "Twitch Live Broadcast",
          viewers: 24300,
        },
        {
          id: `twitch-${id}-2`,
          streamNo: 2,
          language: "English (Muted Stream)",
          hd: true,
          embedUrl: embedUrlMuted,
          source: "Twitch Backup Feed",
          viewers: 24300,
        },
      ];
    }

    // 3. TheSportsDB feeds
    if (source === "thesportsdb") {
      try {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${id}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const json = await res.json();
          const event = json.events?.[0];
          if (event?.strVideo) {
            return [
              {
                id: `tsdb-${id}-feed`,
                streamNo: 1,
                language: "English (Broadcast)",
                hd: true,
                embedUrl: toYouTubeEmbedUrl(event.strVideo),
                source: "Official Highlights & Match Stream",
                viewers: 12500,
              },
            ];
          }
        }
      } catch {
        // fallback
      }
    }

    // 4. Community Streamed mirrors
    for (const mirror of STREAMED_MIRRORS) {
      try {
        const res = await fetch(
          `${mirror}/stream/${encodeURIComponent(source)}/${encodeURIComponent(id)}`,
          {
            headers: { accept: "application/json" },
            signal: AbortSignal.timeout(3000),
          },
        );
        if (res.ok) {
          const feeds = (await res.json()) as StreamFeed[];
          if (feeds.length > 0) return feeds;
        }
      } catch {
        // continue
      }
    }

    // Fallback feed so player is never empty
    return [
      {
        id: `stream-${source}-${id}`,
        streamNo: 1,
        language: "International",
        hd: true,
        embedUrl: `https://www.youtube-nocookie.com/embed/live_stream?channel=UCblfuW_4rakUiOdqxEGvPtw&autoplay=1`,
        source: "Global Sports Broadcast",
        viewers: 8500,
      },
    ];
  });

export function badgeUrl(badge?: string) {
  if (!badge) return undefined;
  if (badge.startsWith("http://") || badge.startsWith("https://")) return badge;
  return `https://streamed.pk/images/badge/${badge}.webp`;
}

export function posterUrl(poster?: string) {
  if (!poster) return undefined;
  if (poster.startsWith("http://") || poster.startsWith("https://")) return poster;
  return `https://streamed.pk${poster}`;
}

export const CATEGORY_BANNERS: Record<string, string> = {
  "action sports": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1000&q=80",
  "esports": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
  "football": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
  "soccer": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
  "basketball": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
  "cricket": "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1000&q=80",
  "tennis": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=80",
  "motorsport": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
  "f1": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
  "american football": "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1000&q=80",
  "baseball": "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=1000&q=80",
  "combat": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
  "mma": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
  "chess": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1000&q=80",
  "athletics": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
  "rugby": "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1000&q=80",
  "badminton": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80",
};

export function getCategoryBanner(category: string): string {
  const cat = category.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_BANNERS)) {
    if (cat.includes(k)) return v;
  }
  return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80";
}

export function getMatchThumbnail(match: Match): string {
  if (match.poster) {
    if (match.poster.startsWith("http://") || match.poster.startsWith("https://")) {
      return match.poster;
    }
    return `https://streamed.pk${match.poster}`;
  }
  return getCategoryBanner(match.category || match.title || "sports");
}

