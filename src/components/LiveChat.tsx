import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Smile, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  body: string;
  created_at: string;
};

const EMOJI = ["🔥", "😂", "😮", "👏", "❤️", "⚽", "🏀", "GG"];

const COLORS = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
];

function colorFor(id: string) {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return COLORS[sum % COLORS.length];
}

export function LiveChat({ roomId, title = "Stream chat" }: { roomId: string; title?: string }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(80)
      .then(({ data }) => {
        if (active && data) setMessages((data as ChatMessage[]).slice().reverse());
      });

    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev.slice(-199), payload.new as ChatMessage]);
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (value: string) => {
    if (!user || !profile || !value.trim() || sending) return;
    setSending(true);
    await supabase.from("chat_messages").insert({
      room_id: roomId,
      user_id: user.id,
      username: profile.username,
      body: value.trim().slice(0, 400),
    });
    setText("");
    setSending(false);
  };

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-border bg-sidebar">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold">{title}</span>
        <button
          onClick={() => setShowTimestamps((v) => !v)}
          className="rounded p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          aria-label="Chat settings"
          title="Toggle timestamps"
        >
          <Settings2 className="size-4" />
        </button>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
        {messages.length === 0 && (
          <p className="text-muted-foreground">No messages yet. Say hello 👋</p>
        )}
        {messages.map((m) => (
          <p key={m.id} className="leading-snug break-words">
            {showTimestamps && (
              <span className="mr-1 text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            <span className={cn("font-semibold", colorFor(m.user_id))}>{m.username}</span>
            <span className="text-muted-foreground">: </span>
            <span>{m.body}</span>
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      {showEmoji && (
        <div className="flex flex-wrap gap-1 border-t border-border px-3 py-2">
          {EMOJI.map((e) => (
            <button
              key={e}
              onClick={() => setText((t) => `${t}${e} `)}
              className="rounded px-2 py-1 hover:bg-sidebar-accent"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(text);
        }}
      >
        {user ? (
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Send a message"
              maxLength={400}
              className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
              className="rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              aria-label="Emoji"
            >
              <Smile className="size-4" />
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Log in to chat
          </Link>
        )}
      </form>
    </aside>
  );
}
