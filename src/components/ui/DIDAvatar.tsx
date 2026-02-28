"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onReady?: () => void;
  onSpeaking?: (speaking: boolean) => void;
}

export default function DIDAvatar({ onReady, onSpeaking }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamIdRef = useRef<string>("");
  const sessionIdRef = useRef<string>("");
  const initRef = useRef(false);
  const [error, setError] = useState(false);
  const [connected, setConnected] = useState(false);

  const onReadyRef = useRef(onReady);
  const onSpeakingRef = useRef(onSpeaking);
  onReadyRef.current = onReady;
  onSpeakingRef.current = onSpeaking;

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        console.log("[D-ID] Creating stream...");
        const createRes = await fetch("/api/did-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create" }),
        });
        const streamData = await createRes.json();
        console.log("[D-ID] Stream created:", streamData.id);

        if (!streamData.id || !streamData.offer) {
          console.error("[D-ID] No stream data:", streamData);
          setError(true);
          return;
        }

        streamIdRef.current = streamData.id;
        sessionIdRef.current = streamData.session_id || "";

        // Setup WebRTC
        const pc = new RTCPeerConnection({
          iceServers: streamData.ice_servers || [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        pc.ontrack = (evt) => {
          console.log("[D-ID] Got track:", evt.track.kind);
          if (evt.streams[0] && videoRef.current) {
            videoRef.current.srcObject = evt.streams[0];
            videoRef.current.play().catch(() => {});
            setConnected(true);
            onReadyRef.current?.();
          }
        };

        pc.onicecandidate = async (evt) => {
          if (evt.candidate) {
            await fetch("/api/did-stream", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "ice",
                streamId: streamIdRef.current,
                sessionId: sessionIdRef.current,
                candidate: evt.candidate.candidate,
                sdpMid: evt.candidate.sdpMid,
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
              }),
            }).catch((e) => console.warn("[D-ID] ICE error:", e));
          }
        };

        pc.onconnectionstatechange = () => {
          console.log("[D-ID] Connection state:", pc.connectionState);
          if (pc.connectionState === "connected") {
            setConnected(true);
          }
        };

        // Set remote description (offer from D-ID)
        await pc.setRemoteDescription(new RTCSessionDescription(streamData.offer));

        // Create and send answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log("[D-ID] Sending SDP answer...");
        await fetch("/api/did-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sdp",
            streamId: streamIdRef.current,
            sessionId: sessionIdRef.current,
            answer: answer,
          }),
        });

        // Wait a moment then send greeting
        setTimeout(async () => {
          console.log("[D-ID] Sending greeting...");
          onSpeakingRef.current?.(true);
          await fetch("/api/did-stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "talk",
              streamId: streamIdRef.current,
              sessionId: sessionIdRef.current,
              text: "Hello! I'm your AI Concierge. How can I help you today?",
            }),
          });
          setTimeout(() => onSpeakingRef.current?.(false), 5000);
        }, 3000);

      } catch (e: any) {
        console.error("[D-ID] Error:", e);
        setError(true);
      }
    })();

    return () => {
      // Cleanup
      pcRef.current?.close();
      if (streamIdRef.current) {
        fetch("/api/did-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "destroy",
            streamId: streamIdRef.current,
            sessionId: sessionIdRef.current,
          }),
        }).catch(() => {});
      }
    };
  }, []);

  if (error) {
    return (
      <img
        src="/images/unsplash/photo-1573497019940-1c28c88b4f3e.jpg"
        alt="AI Concierge"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          background: "#0a0a0a",
          opacity: connected ? 1 : 0,
          transition: "opacity 500ms",
        }}
      />
      {!connected && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#0a0a0a",
        }}>
          <img
            src="/images/unsplash/photo-1573497019940-1c28c88b4f3e.jpg"
            alt="AI Concierge"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
          />
          <div style={{
            position: "absolute",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div className="nexi-spinner" style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.2)", borderTop: "3px solid #fff", borderRadius: "50%" }} />
            <span style={{ color: "#fff", fontSize: "0.625rem", fontWeight: 600 }}>Connecting...</span>
          </div>
        </div>
      )}
    </>
  );
}
