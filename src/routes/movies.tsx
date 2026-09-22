import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { Star, Play, Tv, Film, TrendingUp, Search, Sparkles, Clapperboard, Calendar, Clock, Layers } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  getPopularMovies,
  getTrendingMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getActionMovies,
  getEnglishMovies,
  getDecadeMovies,
  getTeluguMovies,
  getHindiMovies,
  getTamilMovies,
  getKannadaMovies,
  searchMovies,
  tmdbPosterUrl,
  tmdbBackdropUrl,
  GENRE_MAP,
  LANGUAGE_LABELS,
  type Movie,
} from "@/lib/movies.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Watch 300+ Free Movies | MovieArena" },
      {
        name: "description",
        content:
          "Watch 300+ free HD movies — English, Telugu, Hindi, Tamil & Kannada blockbusters from classics to 2026 releases. Full HD, no subscription needed.",
      },
      { property: "og:title", content: "Watch 300+ Free Movies | MovieArena" },
      { property: "og:type", content: "video.movie" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MoviesPage,
});

type LanguageTab = "all" | "english" | "telugu" | "hindi" | "tamil" | "kannada" | "tv";
type EraTab = "any" | "2020s" | "2010s" | "2000s" | "90s" | "classics";

function getLanguageColor(lang?: string) {
  if (lang === "te") return "bg-amber-500/90 text-black";
  if (lang === "hi") return "bg-emerald-500/90 text-white";
  if (lang === "ta") return "bg-sky-500/90 text-white";
  if (lang === "kn") return "bg-rose-500/90 text-white";
  return "bg-blue-600/90 text-white";
}

function getLangGradient(lang: string) {
  if (lang === "te") return "from-amber-900 via-amber-800 to-orange-900";
  if (lang === "hi") return "from-emerald-900 via-teal-800 to-green-900";
  if (lang === "ta") return "from-sky-900 via-blue-800 to-indigo-900";
  if (lang === "kn") return "from-rose-900 via-pink-800 to-red-900";
  return "from-slate-900 via-blue-900 to-indigo-900";
}

function MovieCard({ movie, size = "normal" }: { movie: Movie; size?: "normal" | "large" }) {
  const title = movie.title || movie.name || "Untitled";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const genres = (movie.genre_ids ?? []).slice(0, 2).map((id) => GENRE_MAP[id]).filter(Boolean);
  const mediaType = movie.media_type ?? "movie";
  const lang = movie.original_language || "en";
  const langLabel = movie.language_label || LANGUAGE_LABELS[lang] || lang.toUpperCase();

  // Build poster URL — try TMDb path, then dynamic TMDb fetch by ID, then gradient placeholder
  const hasPoster = !!movie.poster_path;
  const hasBackdrop = !!movie.backdrop_path;
  const posterSrc = size === "large"
    ? (hasBackdrop ? tmdbBackdropUrl(movie.backdrop_path, "w780") : tmdbPosterUrl(movie.poster_path))
    : tmdbPosterUrl(movie.poster_path);

  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: `${mediaType}-${movie.id}` }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-2xl hover:shadow-primary/15",
        size === "large" && "col-span-2 row-span-2",
      )}
    >
      <div className={cn("relative overflow-hidden bg-neutral-900", size === "large" ? "aspect-video" : "aspect-[2/3]")}>
        {hasPoster || hasBackdrop ? (
          <img
            src={posterSrc}
            alt={title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // On error, hide img and show gradient fallback
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              const parent = img.parentElement;
              if (parent) parent.setAttribute("data-no-poster", "true");
            }}
          />
        ) : null}

        {/* Gradient placeholder shown when no poster or on img error */}
        {!hasPoster && !hasBackdrop && (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br p-4 text-center",
            getLangGradient(lang)
          )}>
            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Film className="size-7 text-white/80" />
            </div>
            <p className="text-xs font-bold text-white/90 line-clamp-3 leading-snug">{title}</p>
            {year && <p className="mt-1 text-[10px] text-white/50 font-medium">{year}</p>}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="size-5 fill-current text-primary-foreground ml-0.5" />
          </div>
        </div>

        {/* Language & Type Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md",
              getLanguageColor(lang),
            )}
          >
            {langLabel}
          </span>
          <span className="rounded-md bg-black/70 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-white uppercase border border-white/10">
            HD
          </span>
        </div>

        {/* Rating */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-white/10">
            <Star className="size-3 fill-amber-400" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          {year && <span className="font-semibold text-foreground/80">{year}</span>}
          {genres[0] && (
            <>
              <span>•</span>
              <span className="truncate">{genres[0]}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function FeaturedHero({ movie }: { movie: Movie }) {
  const title = movie.title || movie.name || "Untitled";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const genres = (movie.genre_ids ?? []).slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean);
  const mediaType = movie.media_type ?? "movie";
  const lang = movie.original_language || "en";
  const langLabel = movie.language_label || LANGUAGE_LABELS[lang] || "Feature";

  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: `${mediaType}-${movie.id}` }}
      className="group relative flex h-72 w-full items-end overflow-hidden rounded-2xl border border-border sm:h-96 shadow-2xl"
    >
      <img
        src={tmdbBackdropUrl(movie.backdrop_path)}
        alt={title}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1280&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("rounded-md px-2.5 py-1 text-xs font-black uppercase", getLanguageColor(lang))}>
            {langLabel} Blockbuster
          </span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1 text-xs font-bold text-amber-400">
              <Star className="size-3 fill-amber-400" /> {movie.vote_average.toFixed(1)} / 10
            </span>
          )}
        </div>
        <h2 className="text-2xl font-black text-white sm:text-3xl drop-shadow">{title}</h2>
        <p className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-white/80 font-medium">
          {year} {genres.length > 0 && <> • {genres.join(" • ")}</>}
        </p>
        <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-white/70">{movie.overview}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all group-hover:scale-105">
            <Play className="size-4 fill-current" /> Watch Free Now
          </span>
          <span className="rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md">
            Full HD 1080p
          </span>
        </div>
      </div>
    </Link>
  );
}

function MoviesSection({
  title,
  subtitle,
  movies,
  icon,
  badge,
}: {
  title: string;
  subtitle?: string;
  movies: Movie[];
  icon?: React.ReactNode;
  badge?: string;
}) {
  if (!movies.length) return null;
  return (
    <div className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-black sm:text-xl">{title}</h2>
            {badge && (
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                {badge}
              </span>
            )}
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">
              {movies.length}
            </span>
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((m) => (
          <MovieCard key={`${m.original_language || ""}-${m.media_type ?? "movie"}-${m.id}`} movie={m} />
        ))}
      </div>
    </div>
  );
}

const LANGUAGE_TABS: { id: LanguageTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "🌟 All Cinema", icon: <Film className="size-4" /> },
  { id: "english", label: "🇬🇧 English (Hollywood)", icon: <Film className="size-4 text-blue-400" /> },
  { id: "telugu", label: "🪔 Telugu (Tollywood)", icon: <Clapperboard className="size-4 text-amber-400" /> },
  { id: "hindi", label: "🎬 Hindi (Bollywood)", icon: <Clapperboard className="size-4 text-emerald-400" /> },
  { id: "tamil", label: "🎭 Tamil (Kollywood)", icon: <Clapperboard className="size-4 text-sky-400" /> },
  { id: "kannada", label: "🦁 Kannada (Sandalwood)", icon: <Clapperboard className="size-4 text-rose-400" /> },
  { id: "tv", label: "📺 TV Series", icon: <Tv className="size-4" /> },
];

const ERA_TABS: { id: EraTab; label: string }[] = [
  { id: "any", label: "All Eras (Past to Now)" },
  { id: "2020s", label: "⏳ 2020s - 2026 Latest" },
  { id: "2010s", label: "📼 2010s Blockbusters" },
  { id: "2000s", label: "💿 2000s Peak Cinema" },
  { id: "90s", label: "📼 90s Golden Era" },
  { id: "classics", label: "🏛️ 70s-80s Vintage Classics" },
];

function MoviesPage() {
  const [langTab, setLangTab] = useState<LanguageTab>("all");
  const [eraTab, setEraTab] = useState<EraTab>("any");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(48);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const l = params.get("lang");
      if (l && ["english", "telugu", "hindi", "tamil", "kannada", "tv"].includes(l)) {
        setLangTab(l as LanguageTab);
      }
    }
  }, []);

  const { data: englishMovies = [] } = useQuery({
    queryKey: ["movies-english"],
    queryFn: () => getEnglishMovies(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: teluguMovies = [] } = useQuery({
    queryKey: ["movies-telugu"],
    queryFn: () => getTeluguMovies(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: hindiMovies = [] } = useQuery({
    queryKey: ["movies-hindi"],
    queryFn: () => getHindiMovies(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: tamilMovies = [] } = useQuery({
    queryKey: ["movies-tamil"],
    queryFn: () => getTamilMovies(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: kannadaMovies = [] } = useQuery({
    queryKey: ["movies-kannada"],
    queryFn: () => getKannadaMovies(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: tvShows = [] } = useQuery({
    queryKey: ["tv-trending"],
    queryFn: () => getTrendingTV(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: decadeMovies = [] } = useQuery({
    queryKey: ["movies-decade", eraTab],
    queryFn: () => getDecadeMovies({ data: { decade: eraTab as any } }),
    enabled: eraTab !== "any",
  });

  const { data: searchResults } = useQuery({
    queryKey: ["movie-search", searchQuery],
    queryFn: () => searchMovies({ data: { query: searchQuery } }),
    enabled: searchQuery.trim().length >= 2,
  });

  const featured = englishMovies[0] ?? teluguMovies[0];

  const currentList = useMemo(() => {
    if (searchQuery.trim().length >= 2 && searchResults) {
      return searchResults;
    }
    if (eraTab !== "any" && decadeMovies.length > 0) {
      return decadeMovies;
    }
    if (langTab === "english") return englishMovies;
    if (langTab === "telugu") return teluguMovies;
    if (langTab === "hindi") return hindiMovies;
    if (langTab === "tamil") return tamilMovies;
    if (langTab === "kannada") return kannadaMovies;
    if (langTab === "tv") return tvShows;

    // "all": blend English + Telugu + Hindi + Tamil + Kannada + TV across all 370 titles!
    const seen = new Set<number>();
    const all: Movie[] = [];
    const addUnique = (m: Movie) => {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        all.push(m);
      }
    };
    const maxL = Math.max(
      englishMovies.length,
      teluguMovies.length,
      hindiMovies.length,
      tamilMovies.length,
      kannadaMovies.length,
      tvShows.length,
    );
    for (let i = 0; i < maxL; i++) {
      if (englishMovies[i]) addUnique(englishMovies[i]!);
      if (teluguMovies[i]) addUnique(teluguMovies[i]!);
      if (hindiMovies[i]) addUnique(hindiMovies[i]!);
      if (tamilMovies[i]) addUnique(tamilMovies[i]!);
      if (kannadaMovies[i]) addUnique(kannadaMovies[i]!);
      if (tvShows[i]) addUnique(tvShows[i]!);
    }
    return all;
  }, [
    langTab,
    eraTab,
    decadeMovies,
    searchQuery,
    searchResults,
    englishMovies,
    teluguMovies,
    hindiMovies,
    tamilMovies,
    kannadaMovies,
    tvShows,
  ]);

  const displayedMovies = useMemo(() => {
    return currentList.slice(0, visibleCount);
  }, [currentList, visibleCount]);

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Search & Header Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
              <Film className="size-7 text-primary" /> Cinema Vault: Past to Present
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Watch English, Hindi, Telugu, Tamil, and Kannada blockbusters from 70s-90s vintage classics to 2026 releases
            </p>
          </div>

          <div className="relative w-full md:w-84">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(48);
              }}
              placeholder="Search Godfather, Interstellar, Pushpa 2, KGF..."
              className="w-full rounded-xl border border-input bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Featured Hero (hidden when searching) */}
        {!searchQuery && featured && <FeaturedHero movie={featured} />}

        {/* Tier 1: Language Tabs */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {LANGUAGE_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setLangTab(t.id);
                  setEraTab("any");
                  setSearchQuery("");
                  setVisibleCount(48);
                }}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-sm",
                  langTab === t.id && eraTab === "any" && !searchQuery
                    ? "border-primary bg-primary text-primary-foreground shadow-primary/25 scale-105"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tier 2: Eras & Decades Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide border-t border-border/40 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1.5 flex items-center gap-1 shrink-0">
              <Calendar className="size-3 text-primary" /> Filter Era:
            </span>
            {ERA_TABS.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  setEraTab(era.id);
                  setSearchQuery("");
                  setVisibleCount(48);
                }}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  eraTab === era.id
                    ? "bg-primary/20 text-primary border border-primary/40 font-bold shadow-sm"
                    : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {era.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Grid View */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : eraTab !== "any"
                ? ERA_TABS.find((e) => e.id === eraTab)?.label
                : LANGUAGE_TABS.find((t) => t.id === langTab)?.label}
            </h2>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              Showing {displayedMovies.length} of {currentList.length} movies
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {displayedMovies.map((m) => (
              <MovieCard key={`${m.original_language || ""}-${m.media_type ?? "movie"}-${m.id}`} movie={m} />
            ))}
          </div>

          {visibleCount < currentList.length && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setVisibleCount((v) => Math.min(v + 48, currentList.length))}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-95 transition-all"
              >
                Load More (+48 Movies)
              </button>
              <button
                onClick={() => setVisibleCount(currentList.length)}
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground hover:bg-secondary transition-all"
              >
                Show All {currentList.length} Movies
              </button>
            </div>
          )}

          {currentList.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No movies found matching your selected criteria.
            </div>
          )}
        </div>

        {/* Curated Showcases across eras and industries when on default 'all' view */}
        {!searchQuery && langTab === "all" && eraTab === "any" && (
          <>
            {/* English All-Time Classics */}
            <MoviesSection
              title="🏛️ All-Time Greatest English Cinema (Past to Present)"
              subtitle="The Shawshank Redemption, The Godfather, The Dark Knight, Pulp Fiction, Inception, The Matrix, Fight Club"
              movies={englishMovies.slice(0, 12)}
              icon={<Film className="size-5 text-blue-400" />}
              badge="Hollywood Masterpieces"
            />

            {/* Telugu Showcase */}
            <MoviesSection
              title="🪔 Latest Telugu Movies (Tollywood & 4MovieRulz)"
              subtitle="Pushpa 2, Kalki 2898 AD, Devara, Salaar, RRR, Guntur Kaaram, Bāhubali 2"
              movies={teluguMovies}
              icon={<Clapperboard className="size-5 text-amber-400" />}
              badge="Telugu HD"
            />

            {/* Hindi Showcase */}
            <MoviesSection
              title="🎬 Latest Hindi Movies (Bollywood Releases)"
              subtitle="Stree 2, Jawan, Animal, Bhool Bhulaiyaa 3, Singham Again, Pathaan, 3 Idiots"
              movies={hindiMovies}
              icon={<Clapperboard className="size-5 text-emerald-400" />}
              badge="Hindi HD"
            />

            {/* Tamil Showcase */}
            <MoviesSection
              title="🎭 Latest Tamil Movies (Kollywood Hits)"
              subtitle="Leo, Amaran, Jailer, Vikram, Master, Vishwanath & Sons"
              movies={tamilMovies}
              icon={<Clapperboard className="size-5 text-sky-400" />}
              badge="Tamil HD"
            />

            {/* Kannada Showcase */}
            <MoviesSection
              title="🦁 Latest Kannada Movies (Sandalwood Blockbusters)"
              subtitle="K.G.F 1 & 2, Kantara, 777 Charlie, Toxic, Vikrant Rona"
              movies={kannadaMovies}
              icon={<Clapperboard className="size-5 text-rose-400" />}
              badge="Kannada HD"
            />

            {/* TV Series */}
            <MoviesSection
              title="📺 Top Rated TV Series"
              subtitle="Stranger Things, House of the Dragon, Breaking Bad, The Boys, Shōgun"
              movies={tvShows}
              icon={<Tv className="size-5 text-purple-400" />}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
