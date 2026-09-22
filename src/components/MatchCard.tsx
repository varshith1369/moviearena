import { Link } from "@tanstack/react-router";
import { Play, Radio, Users } from "lucide-react";
import { badgeUrl, getMatchThumbnail, type Match } from "@/lib/sports.functions";

export function MatchCard({ match, live }: { match: Match; live?: boolean }) {
  const home = match.teams?.home;
  const away = match.teams?.away;
  const hasBadges = Boolean(home?.badge || away?.badge);
  const thumbnailUrl = getMatchThumbnail(match);

  return (
    <Link
      to="/match/$matchId"
      params={{ matchId: match.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
    >
      {/* 16:9 Thumbnail Image Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={match.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <span className="rounded-md bg-black/65 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white border border-white/10">
            {match.category}
          </span>
          {live ? (
            <span className="flex items-center gap-1.5 rounded-md bg-destructive px-2 py-0.5 text-[11px] font-extrabold text-destructive-foreground shadow-sm animate-pulse">
              <Radio className="size-3 animate-spin" />
              LIVE
            </span>
          ) : (
            <span className="rounded-md bg-black/65 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-white/90 border border-white/10">
              {new Date(match.date).toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Team badges floating over thumbnail bottom */}
        {hasBadges && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
            <div className="flex -space-x-2">
              {home?.badge && (
                <img
                  src={badgeUrl(home.badge)}
                  alt={home.name}
                  className="size-7 rounded-full border-2 border-card bg-secondary/90 object-contain p-0.5 shadow-md backdrop-blur-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              )}
              {away?.badge && (
                <img
                  src={badgeUrl(away.badge)}
                  alt={away.name}
                  className="size-7 rounded-full border-2 border-card bg-secondary/90 object-contain p-0.5 shadow-md backdrop-blur-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              )}
            </div>
            {match.league && (
              <span className="text-[11px] font-medium text-white/90 drop-shadow truncate max-w-[150px]">
                {match.league}
              </span>
            )}
          </div>
        )}

        {/* Hover play icon indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="size-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Body Info */}
      <div className="flex flex-1 flex-col justify-between p-3.5 gap-2">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
            {match.title}
          </h3>
          {home?.name && away?.name && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {home.name} <span className="text-primary/70 font-semibold">vs</span> {away.name}
            </p>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {match.sources?.length || 1} live {(match.sources?.length || 1) === 1 ? "feed" : "feeds"}
          </span>
          <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
            Watch now →
          </span>
        </div>
      </div>
    </Link>
  );
}
