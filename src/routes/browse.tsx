import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Film, Flame, Star, Sword, Heart, Ghost, Laugh, Globe } from "lucide-react";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Movie Genres | MovieArena" },
      { name: "description", content: "Discover 300+ movies by genre, language and era on MovieArena — English, Telugu, Hindi, Tamil & Kannada." },
      { property: "og:title", content: "Browse Movie Genres | MovieArena" },
      { property: "og:description", content: "Discover 300+ movies by genre, language and era on MovieArena." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
});

const GENRES = [
  { label: "Action", icon: <Sword className="size-5" />, color: "from-red-600 to-orange-600" },
  { label: "Drama", icon: <Film className="size-5" />, color: "from-purple-600 to-blue-600" },
  { label: "Comedy", icon: <Laugh className="size-5" />, color: "from-yellow-500 to-orange-500" },
  { label: "Romance", icon: <Heart className="size-5" />, color: "from-pink-500 to-rose-600" },
  { label: "Horror", icon: <Ghost className="size-5" />, color: "from-slate-700 to-gray-900" },
  { label: "Sci-Fi", icon: <Globe className="size-5" />, color: "from-cyan-600 to-teal-700" },
  { label: "Thriller", icon: <Flame className="size-5" />, color: "from-amber-600 to-yellow-700" },
  { label: "Top Rated", icon: <Star className="size-5" />, color: "from-emerald-600 to-green-700" },
];

const LANGUAGES = [
  { flag: "🇬🇧", label: "English (Hollywood)", lang: "english", color: "bg-blue-600" },
  { flag: "🪔", label: "Telugu (Tollywood)", lang: "telugu", color: "bg-amber-500" },
  { flag: "🎬", label: "Hindi (Bollywood)", lang: "hindi", color: "bg-emerald-600" },
  { flag: "🎭", label: "Tamil (Kollywood)", lang: "tamil", color: "bg-sky-600" },
  { flag: "🦁", label: "Kannada (Sandalwood)", lang: "kannada", color: "bg-rose-600" },
];

const ERAS = [
  { label: "⏳ 2020s – 2026 Latest", era: "2020s" },
  { label: "📼 2010s Blockbusters", era: "2010s" },
  { label: "💿 2000s Peak Cinema", era: "2000s" },
  { label: "📼 90s Golden Era", era: "90s" },
  { label: "🏛️ 70s–80s Vintage Classics", era: "classics" },
];

function BrowsePage() {
  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Browse MovieArena</h1>
          <p className="mt-1 text-muted-foreground">
            300+ movies across all languages, genres and eras — watch free in Full HD.
          </p>
        </div>

        {/* Genres */}
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">🎭 Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GENRES.map((g) => (
              <Link
                key={g.label}
                to="/movies"
                className={`flex items-center gap-3 rounded-xl bg-gradient-to-br ${g.color} p-4 text-white font-bold hover:opacity-90 transition-opacity shadow-lg`}
              >
                {g.icon}
                {g.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">🌏 Browse by Language</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LANGUAGES.map((l) => (
              <Link
                key={l.lang}
                to="/movies"
                className={`flex flex-col items-center justify-center gap-2 rounded-xl ${l.color} p-5 text-white font-bold hover:opacity-90 transition-opacity shadow-lg text-center`}
              >
                <span className="text-3xl">{l.flag}</span>
                <span className="text-sm leading-tight">{l.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Eras */}
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">📅 Browse by Era</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ERAS.map((e) => (
              <Link
                key={e.era}
                to="/movies"
                className="flex items-center justify-center rounded-xl border-2 border-primary/30 bg-card p-4 text-sm font-bold hover:border-primary hover:bg-primary/10 transition-colors text-center"
              >
                {e.label}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-black mb-2">🎬 Ready to Watch?</h2>
          <p className="text-muted-foreground mb-4">Browse all 300+ movies across every language, era and genre — all free in Full HD.</p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Film className="size-5" /> Explore All Movies
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
