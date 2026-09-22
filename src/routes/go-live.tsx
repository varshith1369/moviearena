import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Mic, MicOff, Video, VideoOff, Radio } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { LiveChat } from "@/components/LiveChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/go-live")({
  head: () => ({
    meta: [
      { title: "Broadcaster studio | StreamArena" },
      { name: "description", content: "Set up your camera and microphone and start broadcasting live." },
      { property: "og:title", content: "Broadcaster studio | StreamArena" },
      { property: "og:description", content: "Set up your camera and microphone and start broadcasting live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GoLive,
});

function GoLive() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Just Chatting");
  const [tags, setTags] = useState("");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [liveId, setLiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) void router.navigate({ to: "/auth" });
  }, [loading, user, router]);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => toast.error("Camera or microphone access was blocked."));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const goLive = async () => {
    if (!user || !title.trim()) {
      toast.error("Add a stream title first.");
      return;
    }
    const { data, error } = await supabase
      .from("streams")
      .insert({
        user_id: user.id,
        title: title.trim(),
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_live: true,
      })
      .select("id")
      .maybeSingle();
    if (error || !data) {
      toast.error("Could not start the stream.");
      return;
    }
    setLiveId(data.id);
    toast.success("You are live!");
  };

  const endStream = async () => {
    if (!liveId) return;
    await supabase
      .from("streams")
      .update({ is_live: false, ended_at: new Date().toISOString() })
      .eq("id", liveId);
    setLiveId(null);
    toast("Stream ended.");
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <div className="min-w-0 flex-1 p-6">
          <h1 className="text-2xl font-extrabold">Broadcaster studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preview your camera and mic, then go live. Your live preview streams in-browser (demo
            mode) — connect a media server later for multi-viewer delivery.
          </p>

          <div className="mt-5 aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
            <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={toggleCam}
              className="flex items-center gap-2 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-secondary"
            >
              {camOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
              {camOn ? "Camera on" : "Camera off"}
            </button>
            <button
              onClick={toggleMic}
              className="flex items-center gap-2 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-secondary"
            >
              {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
              {micOn ? "Mic on" : "Mic muted"}
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:max-w-xl">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Stream title"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {liveId ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={endStream}
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
                >
                  End stream
                </button>
                {profile && (
                  <Link
                    to="/channel/$username"
                    params={{ username: profile.username }}
                    className="rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary"
                  >
                    View my channel
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={goLive}
                className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Radio className="size-4" /> Go live
              </button>
            )}
          </div>
        </div>

        {profile && (
          <div className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
              <LiveChat roomId={`channel:${profile.username}`} title="Your chat" />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
