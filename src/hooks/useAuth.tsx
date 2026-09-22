import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string;
};

type LocalUserData = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
};

type AuthValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  signInLocally: (data: { email: string; username?: string; displayName?: string }) => void;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
  signInLocally: () => {},
});

function slugFromEmail(email: string | undefined, id: string) {
  const base = (email?.split("@")[0] ?? "user").toLowerCase().replace(/[^a-z0-9_]/g, "");
  return `${base || "user"}_${id.slice(0, 4)}`;
}

const LOCAL_STORAGE_KEY = "streamarena_local_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [localUser, setLocalUser] = useState<LocalUserData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from Supabase database or fallback to local user profile
  const loadProfile = async (u: User) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, banner_url, bio")
        .eq("id", u.id)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
        return;
      }
    } catch {
      // ignore
    }

    const username = slugFromEmail(u.email, u.id);
    const fallbackProfile: Profile = {
      id: u.id,
      username,
      display_name: (u.user_metadata?.["full_name"] as string) ?? (u.email?.split("@")[0] || "MovieFan"),
      avatar_url: (u.user_metadata?.["avatar_url"] as string) ?? `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      banner_url: null,
      bio: "Movie enthusiast on MovieArena",
    };

    try {
      const { data: created } = await supabase
        .from("profiles")
        .insert({
          id: u.id,
          username,
          display_name: fallbackProfile.display_name,
          avatar_url: fallbackProfile.avatar_url,
        })
        .select("id, username, display_name, avatar_url, banner_url, bio")
        .maybeSingle();
      if (created) {
        setProfile(created as Profile);
        return;
      }
    } catch {
      // fallback to local profile
    }

    setProfile(fallbackProfile);
  };

  useEffect(() => {
    // Check local storage for persistent guest/demo login
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as LocalUserData;
          setLocalUser(parsed);
          setProfile({
            id: parsed.id,
            username: parsed.username,
            display_name: parsed.display_name,
            avatar_url: parsed.avatar_url ?? `https://api.dicebear.com/7.x/bottts/svg?seed=${parsed.username}`,
            banner_url: null,
            bio: "Movie enthusiast on MovieArena",
          });
        }
      } catch {
        // ignore
      }
    }

    // Supabase auth subscription with safe error handling
    let unsubscribe: (() => void) | undefined;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        setLoading(false);
        if (s?.user) {
          setTimeout(() => void loadProfile(s.user), 0);
        } else if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
          setProfile(null);
        }
      });
      unsubscribe = () => data?.subscription?.unsubscribe();
    } catch (err) {
      console.warn("Failed to subscribe to auth state changes:", err);
      setLoading(false);
    }

    try {
      void supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        setLoading(false);
        if (data.session?.user) {
          void loadProfile(data.session.user);
        }
      }).catch((err) => {
        console.warn("Failed to get session:", err);
        setLoading(false);
      });
    } catch (err) {
      console.warn("Error calling getSession:", err);
      setLoading(false);
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  const signInLocally = (data: { email: string; username?: string; displayName?: string }) => {
    const id = "local-" + Math.random().toString(36).substring(2, 11);
    const email = data.email;
    const emailPrefix = email.split("@")[0] ?? "user";
    const username = data.username || emailPrefix.replace(/[^a-zA-Z0-9_]/g, "") || "user";
    const displayName = data.displayName || data.username || emailPrefix || "MovieArena Fan";
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

    const userData: LocalUserData = {
      id,
      email,
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // ignore
    }

    setLocalUser(userData);
    setProfile({
      id,
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      banner_url: null,
      bio: "Movie enthusiast on MovieArena",
    });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setSession(null);
    setLocalUser(null);
    setProfile(null);
  };

  // Synthesize active user from Supabase session or local session
  const effectiveUser: User | null = session?.user ?? (localUser ? ({
    id: localUser.id,
    app_metadata: { provider: "local" },
    user_metadata: { full_name: localUser.display_name, avatar_url: localUser.avatar_url },
    aud: "authenticated",
    created_at: new Date().toISOString(),
    email: localUser.email,
  } as unknown as User) : null);

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        session,
        profile,
        loading,
        refreshProfile: async () => {
          if (session?.user) await loadProfile(session.user);
        },
        signOut,
        signInLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
