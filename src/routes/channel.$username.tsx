import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LiveChat } from "@/components/LiveChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/channel/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} | StreamArena` },
      { name: "description", content: `Watch ${params.username} live on StreamArena and join the chat.` },
      { property: "og:title", content: `${params.username} | StreamArena` },
      { property: "og:description", content: `Watch ${params.username} live on StreamArena and join the chat.` },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChannelPage,
});

function ChannelPage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(true);
  const [following, setFollowing] = useState(false);

  const { data: channel } = useQuery({
    queryKey: ["channel", username],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, banner_url, bio")
        .eq("username", username)
        .maybeSingle();
      return data;
    },
  });

  const { data: streams } = useQuery({
    queryKey: ["channel-streams", channel?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("streams")
        .select("id, title, category, tags, is_live, started_at, ended_at")
        .eq("user_id", channel!.id)
        .order("started_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!channel?.id,
    refetchInterval: 20000,
  });

  const { data: followers, refetch: refetchFollowers } = useQuery({
    queryKey: ["followers", channel?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("channel_id", channel!.id);
      return count ?? 0;
    },
    enabled: !!channel?.id,
  });

  useEffect(() => {
    if (!user || !channel?.id) return;
    void supabase
      .from("follows")
      .select("channel_id")
      .eq("channel_id", channel.id)
      .eq("follower_id", user.id)
      .maybeSingle()
      .then(({ data }) => setFollowing(!!data));
  }, [user, channel?.id]);

  const toggleFollow = async () => {
    if (!user || !channel?.id) {
      toast.error("Log in to follow this channel.");
      return;
    }
    if (following) {
      await supabase.from("follows").delete().eq("channel_id", channel.id).eq("follower_id", user.id);
      setFollowing(false);
    } else {
      await supabase.from("follows").insert({ channel_id: channel.id, follower_id: user.id });
      setFollowing(true);
    }
    void refetchFollowers();
  };

  const liveStream = (streams ?? []).find((s) => s.is_live);
  const past = (streams ?? []).filter((s) => !s.is_live);

  if (!channel) {
    return (
      <AppShell>
        <div className="p-10 text-muted-foreground">Channel not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <div className="min-w-0 flex-1">
          <div
            className="h-36 w-full bg-accent bg-cover bg-center"
            style={channel.banner_url ? { backgroundImage: `url(${channel.banner_url})` } : undefined}
          />
          <div className="aspect-video w-full bg-black">
            <div className="flex size-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              {liveStream ? (
                <>
                  <span className="rounded bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                    LIVE
                  </span>
                  <p className="font-semibold text-foreground">{liveStream.title}</p>
                  <p>Broadcast video plays here once the creator's live feed is connected.</p>
                </>
              ) : (
                <p>{channel.display_name || channel.username} is offline.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-b border-border p-4">
            <img
              src={channel.avatar_url ?? "https://api.dicebear.com/9.x/thumbs/svg?seed=" + channel.username}
              alt={channel.username}
              className="size-16 rounded-full bg-secondary object-cover"
            />
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold">{channel.display_name || channel.username}</h1>
              <p className="text-sm text-muted-foreground">@{channel.username}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="size-4" /> {followers ?? 0} followers
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={toggleFollow}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {following ? "Following" : "Follow"}
              </button>
              <button
                onClick={() => setChatOpen((v) => !v)}
                className="flex items-center gap-1 rounded-md border border-input px-3 py-2 text-sm hover:bg-secondary"
              >
                <MessageSquare className="size-4" /> {chatOpen ? "Hide chat" : "Show chat"}
              </button>
            </div>
          </div>

          <div className="p-4">
            {channel.bio && <p className="max-w-2xl text-sm text-muted-foreground">{channel.bio}</p>}
            <h2 className="mt-6 mb-2 text-sm font-bold text-muted-foreground uppercase">
              Past streams
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((s) => (
                <div key={s.id} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.category} · {new Date(s.started_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {past.length === 0 && <p className="text-sm text-muted-foreground">No past streams yet.</p>}
            </div>
          </div>
        </div>

        {chatOpen && (
          <div className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
              <LiveChat roomId={`channel:${username}`} title="Channel chat" />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
