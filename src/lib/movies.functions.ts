import { createServerFn } from "@tanstack/react-start";
import {
  CURATED_TELUGU_MOVIES,
  CURATED_HINDI_MOVIES,
  CURATED_TAMIL_MOVIES,
  CURATED_KANNADA_MOVIES,
  CURATED_CLASSICS_70S_80S,
  CURATED_MOVIES_90S,
  CURATED_MOVIES_2000S,
  CURATED_MOVIES_2010S,
  CURATED_MOVIES,
  CURATED_TV_SHOWS,
  ALL_CURATED_MOVIES,
  TOTAL_CURATED_COUNT,
} from "./movieCatalog";

export {
  CURATED_TELUGU_MOVIES,
  CURATED_HINDI_MOVIES,
  CURATED_TAMIL_MOVIES,
  CURATED_KANNADA_MOVIES,
  CURATED_CLASSICS_70S_80S,
  CURATED_MOVIES_90S,
  CURATED_MOVIES_2000S,
  CURATED_MOVIES_2010S,
  CURATED_MOVIES,
  CURATED_TV_SHOWS,
  ALL_CURATED_MOVIES,
  TOTAL_CURATED_COUNT,
};

const TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = "https://image.tmdb.org/t/p";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  media_type?: "movie" | "tv";
  name?: string; // for TV shows
  first_air_date?: string; // for TV
  original_language?: string; // "te", "hi", "ta", "kn", "en"
  language_label?: string; // "Telugu", "Hindi", "Tamil", "Kannada", "English"
};

export type MovieDetails = Movie & {
  runtime?: number;
  genres?: { id: number; name: string }[];
  tagline?: string;
  status?: string;
  homepage?: string;
  imdb_id?: string;
  production_companies?: { name: string; logo_path: string | null }[];
};

export type Genre = { id: number; name: string };

export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  te: "Telugu",
  hi: "Hindi",
  ta: "Tamil",
  kn: "Kannada",
  en: "English",
  ml: "Malayalam",
};

async function tmdbFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const url = `${TMDB_BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${TMDB_KEY}&language=en-US`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function tmdbPosterUrl(
  path: string | null,
  size: "w200" | "w342" | "w500" | "w780" | "original" = "w500",
): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
  }
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) {
    return `https://image.tmdb.org/t/p/${size}/${path}`;
  }
  return `${TMDB_IMG}/${size}${path}`;
}

export function tmdbBackdropUrl(
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280",
): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1280&q=80";
  }
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) {
    return `https://image.tmdb.org/t/p/${size}/${path}`;
  }
  return `${TMDB_IMG}/${size}${path}`;
}

/** Free vidsrc.to embed URL for any movie/show */
export function vidsrcEmbedUrl(type: "movie" | "tv", id: number, season?: number, episode?: number): string {
  if (type === "tv" && season !== undefined && episode !== undefined) {
    return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
  }
  return `https://vidsrc.to/embed/${type}/${id}`;
}

export function vidsrc2EmbedUrl(type: "movie" | "tv", id: number): string {
  return `https://vidsrc.xyz/embed/${type}?tmdb=${id}`;
}

export function vidsrcCcEmbedUrl(type: "movie" | "tv", id: number): string {
  return `https://vidsrc.cc/v2/embed/${type}/${id}`;
}

export function smashyStreamEmbedUrl(type: "movie" | "tv", id: number): string {
  return `https://embed.smashystream.com/playere.php?tmdb=${id}&type=${type}`;
}

// -------------------------------------------------------------
// SERVER FUNCTIONS: Language-specific and categorized endpoints
// -------------------------------------------------------------

// TELUGU MOVIES (Tollywood & 4MovieRulz favorites - 70 movies)
export const getTeluguMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: any[] }>(
    "/discover/movie?with_original_language=te&sort_by=popularity.desc&page=1",
    { results: [] },
  );
  if (res.results && res.results.length > 0) {
    const live = res.results.map((m) => ({
      ...m,
      media_type: "movie" as const,
      original_language: "te",
      language_label: "Telugu",
    }));
    const seen = new Set(live.map((m) => m.id));
    const extras = CURATED_TELUGU_MOVIES.filter((m) => !seen.has(m.id));
    return [...CURATED_TELUGU_MOVIES.slice(0, 6), ...live, ...extras];
  }
  return CURATED_TELUGU_MOVIES;
});

// HINDI MOVIES (Bollywood - 80 movies)
export const getHindiMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: any[] }>(
    "/discover/movie?with_original_language=hi&sort_by=popularity.desc&page=1",
    { results: [] },
  );
  if (res.results && res.results.length > 0) {
    const live = res.results.map((m) => ({
      ...m,
      media_type: "movie" as const,
      original_language: "hi",
      language_label: "Hindi",
    }));
    const seen = new Set(live.map((m) => m.id));
    const extras = CURATED_HINDI_MOVIES.filter((m) => !seen.has(m.id));
    return [...CURATED_HINDI_MOVIES.slice(0, 6), ...live, ...extras];
  }
  return CURATED_HINDI_MOVIES;
});

// TAMIL MOVIES (Kollywood - 67 movies)
export const getTamilMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: any[] }>(
    "/discover/movie?with_original_language=ta&sort_by=popularity.desc&page=1",
    { results: [] },
  );
  if (res.results && res.results.length > 0) {
    const live = res.results.map((m) => ({
      ...m,
      media_type: "movie" as const,
      original_language: "ta",
      language_label: "Tamil",
    }));
    const seen = new Set(live.map((m) => m.id));
    const extras = CURATED_TAMIL_MOVIES.filter((m) => !seen.has(m.id));
    return [...CURATED_TAMIL_MOVIES.slice(0, 6), ...live, ...extras];
  }
  return CURATED_TAMIL_MOVIES;
});

// KANNADA MOVIES (Sandalwood - 48 movies)
export const getKannadaMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: any[] }>(
    "/discover/movie?with_original_language=kn&sort_by=popularity.desc&page=1",
    { results: [] },
  );
  if (res.results && res.results.length > 0) {
    const live = res.results.map((m) => ({
      ...m,
      media_type: "movie" as const,
      original_language: "kn",
      language_label: "Kannada",
    }));
    const seen = new Set(live.map((m) => m.id));
    const extras = CURATED_KANNADA_MOVIES.filter((m) => !seen.has(m.id));
    return [...CURATED_KANNADA_MOVIES.slice(0, 6), ...live, ...extras];
  }
  return CURATED_KANNADA_MOVIES;
});

// ENGLISH MOVIES (Hollywood All-Time & Latest - 90 movies)
export const getEnglishMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: any[] }>(
    "/discover/movie?with_original_language=en&sort_by=popularity.desc&page=1",
    { results: [] },
  );
  const allEnglishCurated = [
    ...CURATED_MOVIES,
    ...CURATED_MOVIES_2010S,
    ...CURATED_MOVIES_2000S,
    ...CURATED_MOVIES_90S,
    ...CURATED_CLASSICS_70S_80S,
  ];
  if (res.results && res.results.length > 0) {
    const live = res.results.map((m) => ({
      ...m,
      media_type: "movie" as const,
      original_language: "en",
      language_label: "English",
    }));
    const seen = new Set(live.map((m) => m.id));
    const extras = allEnglishCurated.filter((m) => !seen.has(m.id));
    return [...live, ...extras];
  }
  return allEnglishCurated;
});

// All Movies combined (370+ titles)
export const getAllMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  return ALL_CURATED_MOVIES;
});

// Combined Indian Cinema
export const getIndianMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const [te, hi, ta, kn] = await Promise.all([
    getTeluguMovies(),
    getHindiMovies(),
    getTamilMovies(),
    getKannadaMovies(),
  ]);
  const combined: Movie[] = [];
  const maxLen = Math.max(te.length, hi.length, ta.length, kn.length);
  for (let i = 0; i < maxLen; i++) {
    const t = te[i];
    if (t) combined.push(t);
    const h = hi[i];
    if (h) combined.push(h);
    const a = ta[i];
    if (a) combined.push(a);
    const k = kn[i];
    if (k) combined.push(k);
  }
  return combined;
});

// Popular Movies
export const getPopularMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: Movie[] }>("/movie/popular?page=1", { results: [] });
  if (res.results && res.results.length > 0) {
    return res.results.map((m) => ({ ...m, media_type: "movie" as const }));
  }
  return [
    ...CURATED_TELUGU_MOVIES.slice(0, 10),
    ...CURATED_HINDI_MOVIES.slice(0, 10),
    ...CURATED_TAMIL_MOVIES.slice(0, 10),
    ...CURATED_MOVIES.slice(0, 10),
  ];
});

// Trending Movies
export const getTrendingMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: Movie[] }>("/trending/movie/week", { results: [] });
  if (res.results && res.results.length > 0) {
    return res.results.map((m) => ({ ...m, media_type: "movie" as const }));
  }
  return [
    ...CURATED_TELUGU_MOVIES.slice(0, 4),
    ...CURATED_HINDI_MOVIES.slice(0, 4),
    ...CURATED_TAMIL_MOVIES.slice(0, 4),
    ...CURATED_KANNADA_MOVIES.slice(0, 4),
    ...CURATED_MOVIES.slice(0, 6),
  ];
});

// TV Series
export const getTrendingTV = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: Movie[] }>("/trending/tv/week", { results: [] });
  if (res.results && res.results.length > 0) {
    return res.results.map((m) => ({ ...m, media_type: "tv" as const }));
  }
  return CURATED_TV_SHOWS;
});

// Top Rated
export const getTopRatedMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: Movie[] }>("/movie/top_rated?page=1", { results: [] });
  if (res.results && res.results.length > 0) {
    return res.results.map((m) => ({ ...m, media_type: "movie" as const }));
  }
  return [...ALL_CURATED_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
});

// Now Playing
export const getNowPlayingMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: Movie[] }>("/movie/now_playing?page=1", { results: [] });
  if (res.results && res.results.length > 0) {
    return res.results.map((m) => ({ ...m, media_type: "movie" as const }));
  }
  return [
    ...CURATED_TELUGU_MOVIES.slice(0, 6),
    ...CURATED_HINDI_MOVIES.slice(0, 6),
    ...CURATED_TAMIL_MOVIES.slice(0, 6),
    ...CURATED_KANNADA_MOVIES.slice(0, 6),
  ];
});

// Action Movies
export const getActionMovies = createServerFn({ method: "GET" }).handler(async (): Promise<Movie[]> => {
  const res = await tmdbFetch<{ results: Movie[] }>(
    "/discover/movie?with_genres=28&sort_by=popularity.desc",
    { results: [] },
  );
  if (res.results && res.results.length > 0) {
    return res.results.map((m) => ({ ...m, media_type: "movie" as const }));
  }
  return ALL_CURATED_MOVIES.filter((m) => m.genre_ids.includes(28));
});

// Movies by Decade: From past to till now
export const getDecadeMovies = createServerFn({ method: "GET" })
  .inputValidator((data: { decade: "2020s" | "2010s" | "2000s" | "90s" | "classics" }) => data)
  .handler(async ({ data }): Promise<Movie[]> => {
    const { decade } = data;
    if (decade === "classics") return CURATED_CLASSICS_70S_80S;
    if (decade === "90s") return CURATED_MOVIES_90S;
    if (decade === "2000s") return CURATED_MOVIES_2000S;
    if (decade === "2010s") return CURATED_MOVIES_2010S;
    return CURATED_MOVIES;
  });

// Search Movies across languages and decades
export const searchMovies = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data }): Promise<Movie[]> => {
    const q = encodeURIComponent(data.query.toLowerCase());
    const [movies, tv] = await Promise.all([
      tmdbFetch<{ results: Movie[] }>(`/search/movie?query=${q}&page=1`, { results: [] }),
      tmdbFetch<{ results: Movie[] }>(`/search/tv?query=${q}&page=1`, { results: [] }),
    ]);
    const liveResults = [
      ...(movies.results ?? []).map((m) => ({ ...m, media_type: "movie" as const })),
      ...(tv.results ?? []).map((m) => ({ ...m, media_type: "tv" as const })),
    ];
    if (liveResults.length > 0) {
      return liveResults.sort((a, b) => b.popularity - a.popularity).slice(0, 50);
    }
    // Fallback search across all 370 curated movies and shows
    return ALL_CURATED_MOVIES.filter((m) =>
      (m.title || m.name || "").toLowerCase().includes(data.query.toLowerCase()),
    );
  });

// Movie Details
export const getMovieDetails = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number; mediaType: "movie" | "tv" }) => data)
  .handler(async ({ data }): Promise<MovieDetails | null> => {
    const type = data.mediaType;
    const res = await tmdbFetch<MovieDetails>(
      `/${type}/${data.id}?append_to_response=credits,videos`,
      null as any,
    );
    if (res && res.title) {
      return { ...res, media_type: type };
    }
    // Lookup in curated lists
    const match = ALL_CURATED_MOVIES.find((m) => m.id === data.id);
    if (match) {
      return {
        ...match,
        media_type: type,
        runtime: 150,
        tagline: `${match.language_label || "All-Time"} Classic available free in Full HD on MovieArena`,
      };
    }
    return null;
  });

// Video Embed Feeds (Multi-server streaming)
export const getMovieFeeds = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number; mediaType: "movie" | "tv" }) => data)
  .handler(async ({ data }) => {
    const { id, mediaType } = data;
    return [
      {
        id: `vidsrc-${id}`,
        name: "VidSrc HD (Primary Server)",
        embedUrl: vidsrcEmbedUrl(mediaType, id),
        quality: "1080p HD",
        provider: "VidSrc",
      },
      {
        id: `vidsrc2-${id}`,
        name: "VidSrc.xyz (Backup Server)",
        embedUrl: vidsrc2EmbedUrl(mediaType, id),
        quality: "1080p HD",
        provider: "VidSrc XYZ",
      },
      {
        id: `vidsrc-cc-${id}`,
        name: "VidSrc CC (Fast Stream)",
        embedUrl: vidsrcCcEmbedUrl(mediaType, id),
        quality: "1080p HD",
        provider: "VidSrc CC",
      },
      {
        id: `smashystream-${id}`,
        name: "SmashyStream (Multi-Audio)",
        embedUrl: smashyStreamEmbedUrl(mediaType, id),
        quality: "HD",
        provider: "SmashyStream",
      },
    ];
  });

export const getMovieGenres = createServerFn({ method: "GET" }).handler(async (): Promise<Genre[]> => {
  return Object.entries(GENRE_MAP).map(([id, name]) => ({ id: Number(id), name }));
});
