"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onReady?: () => void;
}

export default function TavusAvatar({ onReady }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const convIdRef = useRef<string>("");
  const initRef = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        console.log("[Tavus] Creating conversation...");
        const res = await fetch("/api/tavus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create" }),
        });
        const data = await res.json();
        console.log("[Tavus] Response:", data);

        if (data.conversation_url) {
          convIdRef.current = data.conversation_id;
          // Hide local video, controls, and chrome — show only the replica
          const base = data.conversation_url;
          const params = new URLSearchParams({
            "showLocalVideo": "false",
            "showParticipantsBar": "false",
            "showLeaveButton": "false",
            "showFullscreenButton": "false",
            "activeSpeakerMode": "true",
          });
          setUrl(`${base}?${params.toString()}`);
          onReadyRef.current?.();
        } else {
          console.error("[Tavus] No conversation_url:", data);
          setError(true);
        }
      } catch (e: any) {
        console.error("[Tavus] Error:", e);
        setError(true);
      }
    })();

    return () => {
      if (convIdRef.current) {
        fetch("/api/tavus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "end", conversationId: convIdRef.current }),
        }).catch(() => {});
      }
    };
  }, []);

  if (error) {
    return (
      <video
        src="https://cdn.replica.tavus.io/40242/2fe8396c.mp4"
        autoPlay loop muted playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <>
      {url && (
        <iframe
          src={url}
          allow="camera;microphone;autoplay"
          style={{
            width: "100%", height: "100%", border: "none",
            opacity: loading ? 0 : 1, transition: "opacity 500ms",
            // Scale up to hide Daily UI chrome around edges
            transform: "scale(1.15)",
            transformOrigin: "center center",
          }}
          onLoad={() => setLoading(false)}
        />
      )}
      {loading && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#0a0a0a",
        }}>
          <video
            src="https://cdn.replica.tavus.io/40242/2fe8396c.mp4"
            autoPlay loop muted playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          />
          <div style={{
            position: "absolute",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.2)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "nexiSpin 1s linear infinite" }} />
            <span style={{ color: "#fff", fontSize: "0.625rem", fontWeight: 600 }}>Connecting to AI Concierge...</span>
          </div>
        </div>
      )}
    </>
  );
}
