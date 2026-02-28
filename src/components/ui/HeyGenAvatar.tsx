"use client";

import { useEffect, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";

interface Props {
  avatarId?: string;
  onReady?: () => void;
  onSpeaking?: (speaking: boolean) => void;
  listening?: boolean;
}

const DEFAULT_AVATAR = "Adriana_Business_Front_public";

export default function HeyGenAvatar({ avatarId = DEFAULT_AVATAR, onReady, onSpeaking }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const initRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // Store callbacks in refs to avoid re-triggering effect
  const onReadyRef = useRef(onReady);
  const onSpeakingRef = useRef(onSpeaking);
  onReadyRef.current = onReady;
  onSpeakingRef.current = onSpeaking;

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    console.log("[HeyGen] Starting init...");

    (async () => {
      try {
        console.log("[HeyGen] Fetching token...");
        const res = await fetch("/api/heygen-token", { method: "POST" });
        const { token } = await res.json();
        if (!token) { console.error("[HeyGen] No token received"); setError("No token"); return; }
        console.log("[HeyGen] Token received, creating avatar...");

        const avatar = new StreamingAvatar({ token });
        avatarRef.current = avatar;

        avatar.on(StreamingEvents.STREAM_READY, (evt: any) => {
          console.log("[HeyGen] Stream ready!", evt.detail);
          if (videoRef.current && evt.detail) {
            videoRef.current.srcObject = evt.detail;
            videoRef.current.play().catch((e: any) => console.error("[HeyGen] Play error:", e));
          }
          onReadyRef.current?.();
        });

        avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
          console.log("[HeyGen] Avatar started talking");
          onSpeakingRef.current?.(true);
        });
        avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
          console.log("[HeyGen] Avatar stopped talking");
          onSpeakingRef.current?.(false);
        });

        console.log("[HeyGen] Calling createStartAvatar with:", avatarId);
        const startRes = await avatar.createStartAvatar({
          avatarName: avatarId,
          quality: AvatarQuality.Medium,
          voice: { voiceId: "en-US-JennyNeural" },
        });
        console.log("[HeyGen] createStartAvatar response:", JSON.stringify(startRes));

        // Greeting
        await avatar.speak({
          text: "Hello! I'm your AI Concierge. How can I help you today?",
          taskType: TaskType.TALK,
          taskMode: TaskMode.SYNC,
        }).catch((e: any) => console.warn("[HeyGen] Speak error:", e));

      } catch (e: any) {
        console.error("[HeyGen] Init error:", e?.message, e);
        setError(e.message || "Failed to connect");
      }
    })();

    return () => {
      avatarRef.current?.stopAvatar?.();
    };
  }, [avatarId]);

  if (error) {
    return (
      <img
        src="/images/unsplash/photo-1573497019940-1c28c88b4f3e.jpg"
        alt="AI Concierge"
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={false}
      style={{ width: "100%", height: "100%", objectFit: "cover", background: "#0a0a0a" }}
    />
  );
}
