import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Clapperboard,
  Compass,
  Film,
  LogOut,
  User as UserIcon,
  Menu,
  Search,
  Tv,
  Star,
  Flame,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

function SidebarSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <p className="px-3 pb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) setOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-sidebar px-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded p-2 hover:bg-sidebar-accent"
          aria-label="Toggle navigation"
        >
          <Menu className="size-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <Clapperboard className="size-5 text-primary" />
          <span className="hidden sm:inline text-primary">Movie</span><span className="hidden sm:inline">Arena</span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 text-sm md:flex">
          <Link to="/" className="rounded px-3 py-1.5 hover:bg-sidebar-accent font-medium">
            🏠 Home
          </Link>
          <Link to="/movies" className="flex items-center gap-1.5 rounded px-3 py-1.5 hover:bg-sidebar-accent text-primary font-semibold">
            <Film className="size-4" /> Movies
          </Link>
          <a href="/movies?lang=english" className="rounded px-3 py-1.5 hover:bg-sidebar-accent">
            🇬🇧 English
          </a>
          <a href="/movies?lang=telugu" className="rounded px-3 py-1.5 hover:bg-sidebar-accent">
            🪔 Telugu
          </a>
          <a href="/movies?lang=hindi" className="rounded px-3 py-1.5 hover:bg-sidebar-accent">
            🎬 Hindi
          </a>
          <a href="/movies?lang=tamil" className="rounded px-3 py-1.5 hover:bg-sidebar-accent">
            🎭 Tamil
          </a>
          <a href="/movies?lang=kannada" className="rounded px-3 py-1.5 hover:bg-sidebar-accent">
            🦁 Kannada
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/movies"
            className="hidden items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground sm:flex"
          >
            <Search className="size-4" /> Search movies
          </Link>
          {user ? (
            <>
              <Link
                to="/settings"
                className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-sidebar-accent"
              >
                <UserIcon className="size-4" />
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  void router.navigate({ to: "/" });
                }}
                className="rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Log in
            </Link>
          )}
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto border-r border-border bg-sidebar py-4 lg:block",
            open ? "w-60" : "w-0 border-r-0",
          )}
        >
          {open && (
            <div className="px-2">
              <SidebarSection label="🎬 Movie Industries">
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent font-medium">
                  <Globe className="size-4 text-primary" /> All Movies
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <span className="text-base">🇬🇧</span> Hollywood (English)
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <span className="text-base">🪔</span> Tollywood (Telugu)
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <span className="text-base">🎬</span> Bollywood (Hindi)
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <span className="text-base">🎭</span> Kollywood (Tamil)
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <span className="text-base">🦁</span> Sandalwood (Kannada)
                </Link>
              </SidebarSection>

              <SidebarSection label="📅 Eras & Decades">
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <Flame className="size-4 text-orange-400" /> 2020s – Latest
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <Film className="size-4 text-blue-400" /> 2010s Blockbusters
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <Film className="size-4 text-purple-400" /> 2000s Peak Cinema
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <Star className="size-4 text-amber-400" /> 90s Golden Era
                </Link>
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <Star className="size-4 text-rose-400" /> 70s–80s Classics
                </Link>
              </SidebarSection>

              <SidebarSection label="🎭 More">
                <Link to="/movies" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent text-primary font-medium">
                  <Tv className="size-4" /> TV Series
                </Link>
                <Link to="/browse" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent">
                  <Compass className="size-4" /> Browse Genres
                </Link>
                {profile && (
                  <Link
                    to="/channel/$username"
                    params={{ username: profile.username }}
                    className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-sidebar-accent"
                  >
                    <UserIcon className="size-4" /> My Profile
                  </Link>
                )}
              </SidebarSection>
            </div>
          )}
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
