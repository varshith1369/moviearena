import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile settings | StreamArena" },
      { name: "description", content: "Customize your channel name, avatar, banner and bio." },
      { property: "og:title", content: "Profile settings | StreamArena" },
      { property: "og:description", content: "Customize your channel name, avatar, banner and bio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    display_name: "",
    avatar_url: "",
    banner_url: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) void router.navigate({ to: "/auth" });
  }, [loading, user, router]);

  useEffect(() => {
    if (profile)
      setForm({
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url ?? "",
        banner_url: profile.banner_url ?? "",
        bio: profile.bio,
      });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        username: form.username.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        display_name: form.display_name,
        avatar_url: form.avatar_url || null,
        banner_url: form.banner_url || null,
        bio: form.bio,
      })
      .eq("id", user.id);
    if (error) toast.error(error.message);
    else {
      await refreshProfile();
      toast.success("Profile updated");
    }
  };

  return (
    <AppShell>
      <form onSubmit={save} className="max-w-xl space-y-3 p-6">
        <h1 className="text-2xl font-extrabold">Profile settings</h1>
        {(
          [
            ["username", "Username"],
            ["display_name", "Display name"],
            ["avatar_url", "Avatar image URL"],
            ["banner_url", "Banner image URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{label}</span>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="mb-1 block text-muted-foreground">Bio</span>
          <textarea
            value={form.bio}
            rows={4}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Save profile
        </button>
      </form>
    </AppShell>
  );
}
