import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Film,
  Star,
  ChevronRight,
  Sparkles,
  Clapperboard,
  Flame,
  Globe,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  getTrendingMovies,
  getTeluguMovies,
  getHindiMovies,
  getTamilMovies,
  getKannadaMovies,
  getEnglishMovies,
  tmdbPosterUrl,
  tmdbBackdropUrl,
  LANGUAGE_LABELS,
  GENRE_MAP,
  type Movie,
} from "@/lib/movies.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MovieArena — Watch 300+ Free HD Movies" },
      {
        name: "description",
        content:
          "Stream 300+ free HD movies — latest English, Telugu, Hindi, Tamil, and Kannada blockbusters from past classics to 2026 releases. No subscription needed.",
      },
      { property: "og:title", content: "MovieArena — Watch 300+ Free HD Movies" },
      {
        property: "og:description",
        content:
          "Stream 300+ free HD movies — latest English, Telugu, Hindi, Tamil, and Kannada blockbusters from past classics to 2026 releases.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function getLangBadgeColor(lang?: string) {
  if (lang === "te") return "bg-amber-500/90 text-black";
  if (lang === "hi") return "bg-emerald-500/90 text-white";
  if (lang === "ta") return "bg-sky-500/90 text-white";
  if (lang === "kn") return "bg-rose-500/90 text-white";
  return "bg-blue-600/90 text-white";
}

function MovieCard({ movie }: { movie: Movie }) {
  const title = movie.title || movie.name || "Untitled";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const genres = (movie.genre_ids ?? []).slice(0, 1).map((id) => GENRE_MAP[id]).filter(Boolean);
  const mediaType = movie.media_type ?? "movie";
  const lang = movie.original_language || "en";
  const langLabel = movie.language_label || LANGUAGE_LABELS[lang] || lang.toUpperCase();

  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: `${mediaType}-${movie.id}` }}
      className="group relative overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
        {movie.poster_path ? (
          <img
            src={tmdbPosterUrl(movie.poster_path)}
            alt={title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br p-3 text-center",
            lang === "te" ? "from-amber-900 via-amber-800 to-orange-900" :
            lang === "hi" ? "from-emerald-900 via-teal-800 to-green-900" :
            lang === "ta" ? "from-sky-900 via-blue-800 to-indigo-900" :
            lang === "kn" ? "from-rose-900 via-pink-800 to-red-900" :
            "from-slate-900 via-blue-900 to-indigo-900"
          )}>
            <Film className="size-10 text-white/40 mb-2" />
            <p className="text-[10px] font-bold text-white/80 line-clamp-3 leading-snug">{title}</p>
            {year && <p className="mt-1 text-[9px] text-white/40">{year}</p>}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary shadow-lg">
            <Play className="size-5 fill-current text-primary-foreground ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow", getLangBadgeColor(lang))}>
            {langLabel}
          </span>
        </div>
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
            <Star className="size-3 fill-amber-400" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="line-clamp-1 text-xs font-bold text-foreground group-hover:text-primary transition-colors">{title}</p>
        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
          {year && <span className="font-semibold text-foreground/70">{year}</span>}
          {genres[0] && <><span>•</span><span className="truncate">{genres[0]}</span></>}
        </div>
      </div>
    </Link>
  );
}

function MovieRow({ title, icon, movies, badge }: { title: string; icon: React.ReactNode; movies: Movie[]; badge?: string }) {
  if (!movies.length) return null;
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-black sm:text-xl">{title}</h2>
          {badge && <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">{badge}</span>}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">{movies.length}</span>
        </div>
        <Link to="/movies" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          View all <ChevronRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {movies.slice(0, 8).map((m) => (
          <MovieCard key={`${m.original_language || ""}-${m.id}`} movie={m} />
        ))}
      </div>
    </section>
  );
}

function HeroBanner({ movie }: { movie: Movie }) {
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
      className="group relative flex h-80 w-full items-end overflow-hidden rounded-2xl border border-border sm:h-[420px] shadow-2xl"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("rounded-md px-2.5 py-1 text-xs font-black uppercase", getLangBadgeColor(lang))}>
            {langLabel} Blockbuster
          </span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-amber-400">
              <Star className="size-3 fill-amber-400" /> {movie.vote_average.toFixed(1)} / 10
            </span>
          )}
          <span className="rounded-md border border-white/20 bg-white/10 backdrop-blur px-2.5 py-1 text-xs font-bold text-white">
            Full HD
          </span>
        </div>
        <h1 className="text-3xl font-black text-white sm:text-4xl drop-shadow-lg">{title}</h1>
        <p className="mt-1 text-sm text-white/80 font-medium">
          {year}{genres.length > 0 && <> • {genres.join(" • ")}</>}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">{movie.overview}</p>
        <div className="mt-5 flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <Play className="size-4 fill-current" /> Watch Free Now
          </span>
          <span className="rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-xs font-semibold text-white backdrop-blur-md">
            No Subscription
          </span>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const [_selectedLang, setSelectedLang] = useState<string>("all");

  const { data: trendingMovies } = useQuery({
    queryKey: ["home-trending-movies"],
    queryFn: () => getTrendingMovies(),
  });
  const { data: teluguMovies } = useQuery({
    queryKey: ["home-telugu-movies"],
    queryFn: () => getTeluguMovies(),
  });
  const { data: hindiMovies } = useQuery({
    queryKey: ["home-hindi-movies"],
    queryFn: () => getHindiMovies(),
  });
  const { data: tamilMovies } = useQuery({
    queryKey: ["home-tamil-movies"],
    queryFn: () => getTamilMovies(),
  });
  const { data: kannadaMovies } = useQuery({
    queryKey: ["home-kannada-movies"],
    queryFn: () => getKannadaMovies(),
  });
  const { data: englishMovies } = useQuery({
    queryKey: ["home-english-movies"],
    queryFn: () => getEnglishMovies(),
  });

  const featuredMovie = (trendingMovies ?? [])[0];
  const allTrending = trendingMovies ?? [];

  const QUICK_LANG_PILLS = [
    { label: "🌟 All", value: "all" },
    { label: "🇬🇧 English", value: "en" },
    { label: "🪔 Telugu", value: "te" },
    { label: "🎬 Hindi", value: "hi" },
    { label: "🎭 Tamil", value: "ta" },
    { label: "🦁 Kannada", value: "kn" },
  ];

  return (
    <AppShell>
      <div className="px-4 pb-12 sm:px-6 max-w-[1600px] mx-auto">
        {/* Hero */}
        <div className="pt-6">
          {featuredMovie ? (
            <HeroBanner movie={featuredMovie} />
          ) : (
            <div className="h-80 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center">
              <div className="text-center">
                <Clapperboard className="size-16 text-primary mx-auto mb-3 animate-pulse" />
                <p className="text-xl font-bold">Loading MovieArena…</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {QUICK_LANG_PILLS.map((p) => {
            const href =
              p.value === "all"
                ? "/movies"
                : `/movies?lang=${
                    p.value === "en"
                      ? "english"
                      : p.value === "te"
                      ? "telugu"
                      : p.value === "hi"
                      ? "hindi"
                      : p.value === "ta"
                      ? "tamil"
                      : "kannada"
                  }`;
            return (
              <a
                key={p.value}
                href={href}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary transition-colors shadow-sm"
              >
                {p.label}
              </a>
            );
          })}
        </div>

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          icon={<Flame className="size-5 text-orange-400" />}
          movies={allTrending}
          badge="HOT"
        />

        {/* Tollywood Telugu */}
        <MovieRow
          title="🪔 Tollywood Cinema"
          icon={<Sparkles className="size-5 text-amber-400" />}
          movies={teluguMovies ?? []}
          badge="Telugu"
        />

        {/* Bollywood Hindi */}
        <MovieRow
          title="🎬 Bollywood Arena"
          icon={<Film className="size-5 text-emerald-400" />}
          movies={hindiMovies ?? []}
          badge="Hindi"
        />

        {/* Kollywood Tamil */}
        <MovieRow
          title="🎭 Kollywood Hits"
          icon={<Clapperboard className="size-5 text-sky-400" />}
          movies={tamilMovies ?? []}
          badge="Tamil"
        />

        {/* Sandalwood Kannada */}
        <MovieRow
          title="🦁 Sandalwood Hits"
          icon={<TrendingUp className="size-5 text-rose-400" />}
          movies={kannadaMovies ?? []}
          badge="Kannada"
        />

        {/* Hollywood English */}
        <MovieRow
          title="🏛️ Hollywood All-Time Classics"
          icon={<Globe className="size-5 text-blue-400" />}
          movies={englishMovies ?? []}
          badge="English"
        />

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-black mb-2">🎬 Explore 300+ More Movies</h2>
          <p className="text-muted-foreground mb-5">
            Browse our full catalogue — every language, every decade, every genre. All free in Full HD.
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <Film className="size-5" /> Browse All Movies
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
