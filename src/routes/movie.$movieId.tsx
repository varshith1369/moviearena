import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Star,
  Film,
  Tv,
  Monitor,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  getMovieDetails,
  getMovieFeeds,
  getTrendingMovies,
  tmdbPosterUrl,
  tmdbBackdropUrl,
  GENRE_MAP,
  type Movie,
} from "@/lib/movies.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/movie/$movieId")({
  head: ({ params }) => {
    const raw = params.movieId.replace(/^(movie|tv)-/, "").replace(/-/g, " ");
    return {
      meta: [
        { title: `Watch ${raw} Free HD Online | MovieArena` },
        {
          name: "description",
          content: `Stream ${raw} in HD online for free with multiple servers, english subs, and fast playback on MovieArena.`,
        },
        { property: "og:title", content: `Watch ${raw} Free HD Online | MovieArena` },
        { property: "og:type", content: "video.movie" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { movieId } = Route.useParams();
  const [selectedServer, setSelectedServer] = useState(0);
  const [theater, setTheater] = useState(false);

  // parse format: "movie-1234" or "tv-1234" or just "1234"
  let mediaType: "movie" | "tv" = "movie";
  let numericId = 0;

  if (movieId.startsWith("tv-")) {
    mediaType = "tv";
    numericId = parseInt(movieId.replace("tv-", ""), 10);
  } else if (movieId.startsWith("movie-")) {
    mediaType = "movie";
    numericId = parseInt(movieId.replace("movie-", ""), 10);
  } else {
    numericId = parseInt(movieId, 10);
  }

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie-details", mediaType, numericId],
    queryFn: () => getMovieDetails({ data: { id: numericId, mediaType } }),
  });

  const { data: feeds } = useQuery({
    queryKey: ["movie-feeds", mediaType, numericId],
    queryFn: () => getMovieFeeds({ data: { id: numericId, mediaType } }),
  });

  const { data: recommendations } = useQuery({
    queryKey: ["movie-recommendations"],
    queryFn: () => getTrendingMovies(),
  });

  const currentFeed = (feeds ?? [])[selectedServer] ?? feeds?.[0];
  const title = movie?.title || movie?.name || "Movie Stream";
  const year = (movie?.release_date || movie?.first_air_date || "").slice(0, 4);

  return (
    <AppShell>
      <div className="min-h-screen pb-16">
        {/* Top Breadcrumb & Quick Nav */}
        <div className="border-b border-border bg-card/40 px-4 py-2.5 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link
              to="/movies"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Back to Movies & Shows
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                {mediaType === "tv" ? "TV Series" : "HD Movie"}
              </span>
              {movie?.vote_average ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                  <Star className="size-3 fill-amber-400" />
                  {movie.vote_average.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="bg-black">
          <div
            className={cn(
              "mx-auto transition-all duration-300",
              theater ? "w-full max-w-none" : "max-w-6xl px-0 sm:px-4 sm:py-4",
            )}
          >
            <div className="relative aspect-video w-full overflow-hidden sm:rounded-xl bg-neutral-950 shadow-2xl">
              {currentFeed ? (
                <iframe
                  key={currentFeed.embedUrl}
                  src={currentFeed.embedUrl}
                  title={title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="origin"
                  className="size-full border-0"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Film className="size-12 animate-pulse text-muted-foreground/40" />
                  <p className="text-sm">
                    {isLoading ? "Connecting to video servers…" : "Preparing free stream player…"}
                  </p>
                </div>
              )}
            </div>

            {/* Server Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-card p-3 sm:rounded-b-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Server:
                </span>
                {(feeds ?? []).map((feed, idx) => (
                  <button
                    key={feed.id}
                    onClick={() => setSelectedServer(idx)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                      selectedServer === idx
                        ? "bg-primary font-bold text-primary-foreground shadow-sm shadow-primary/30"
                        : "border border-border bg-secondary/50 text-foreground hover:bg-secondary",
                    )}
                  >
                    <Play className="size-3 fill-current" />
                    {feed.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheater((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                  title="Toggle Theatre Mode"
                >
                  <Monitor className="size-3.5" />
                  {theater ? "Standard" : "Theater"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info & Details */}
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Poster column */}
            <div className="hidden shrink-0 md:block">
              <div className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-border shadow-xl bg-neutral-900">
                {movie?.poster_path ? (
                  <img
                    src={tmdbPosterUrl(movie.poster_path, "w500")}
                    alt={title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center">
                    <Film className="size-16 text-white/30 mb-4" />
                    <p className="text-sm font-bold text-white/60 line-clamp-4">{title}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content info column */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground">
                  {title}
                </h1>
                {movie?.tagline && (
                  <p className="mt-1 text-sm italic text-muted-foreground">"{movie.tagline}"</p>
                )}
              </div>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {year && (
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Calendar className="size-3.5 text-primary" /> {year}
                  </span>
                )}
                {movie?.runtime ? (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-primary" /> {movie.runtime} min
                  </span>
                ) : null}
                {movie?.vote_average ? (
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="size-3.5 fill-amber-400" />
                    {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)
                  </span>
                ) : null}
                <span className="rounded bg-secondary px-2 py-0.5 font-medium uppercase text-secondary-foreground">
                  Full HD 1080p
                </span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-400 border border-emerald-500/20">
                  Free Streaming
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5">
                {(movie?.genres ?? (movie?.genre_ids ?? []).map((id) => ({ id, name: GENRE_MAP[id] }))).map(
                  (g) =>
                    g?.name ? (
                      <span
                        key={g.id}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {g.name}
                      </span>
                    ) : null,
                )}
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Synopsis
                </h2>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {movie?.overview ||
                    "Stream this title in high definition with English subtitles and multi-server backup. No subscription required."}
                </p>
              </div>

              {/* Stream notice banner */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
                <Sparkles className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-0.5">Streaming Tips</p>
                  <p>
                    If the current player buffers, switch to VidSrc Backup or SmashyStream in the server bar above. If you see ads in the player iframe, consider using an ad-blocker for the cleanest experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* More Like This / Recommended */}
          <div className="mt-12">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> More Movies & Shows You Might Like
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {(recommendations ?? []).slice(0, 6).map((item) => {
                const recTitle = item.title || item.name || "Untitled";
                const recYear = (item.release_date || item.first_air_date || "").slice(0, 4);
                return (
                  <Link
                    key={item.id}
                    to="/movie/$movieId"
                    params={{ movieId: `${item.media_type ?? "movie"}-${item.id}` }}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
                  >
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={tmdbPosterUrl(item.poster_path, "w342")}
                        alt={recTitle}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                        {recTitle}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{recYear}</span>
                        {item.vote_average ? (
                          <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                            <Star className="size-2.5 fill-amber-400" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
