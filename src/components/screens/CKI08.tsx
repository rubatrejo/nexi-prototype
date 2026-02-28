"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import { useRef, useState, useCallback, useEffect } from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";

const POLICIES = `Hotel Policies & Terms of Stay

1. Check-in / Check-out
Check-in time is 3:00 PM. Check-out time is 11:00 AM. Late check-out may be available upon request and subject to availability.

2. Cancellation Policy
Reservations may be cancelled up to 48 hours prior to arrival without penalty. Cancellations within 48 hours will be charged one night's room rate.

3. Smoking Policy
This is a non-smoking property. A cleaning fee of $250 will be charged for smoking in guest rooms or on balconies.

4. Pet Policy
Service animals are welcome. Pets up to 25 lbs are permitted with a $75 per night pet fee.

5. Damage Policy
Guests are responsible for any damage to hotel property during their stay. Charges will be applied to the card on file.

6. Pool & Fitness Center
Pool hours: 7:00 AM - 10:00 PM. Fitness center: 24 hours. No lifeguard on duty. Children under 12 must be accompanied by an adult.

7. Noise Policy
Quiet hours are observed from 10:00 PM to 7:00 AM. Please be respectful of fellow guests.

8. Privacy Policy
Guest information is collected for reservation and service purposes only. We do not sell or share personal data with third parties.`;

export default function TermsSignature() {
  const { navigate, goBack } = useKiosk();
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    setHasSigned(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
  }, [getPos]);

  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (lastPos.current) {
      const mid = { x: (lastPos.current.x + pos.x) / 2, y: (lastPos.current.y + pos.y) / 2 };
      ctx.quadraticCurveTo(lastPos.current.x, lastPos.current.y, mid.x, mid.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [isDrawing, getPos]);

  const stopDraw = useCallback(() => setIsDrawing(false), []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1566073771259-6a8506099945.jpg') center/cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.75))" }} />
      <div className="grain" />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlobalHeader variant="cinematic" />
      </div>

      {/* Progress */}
      <div style={{ position: "relative", zIndex: 2, height: 4, background: "rgba(255,255,255,0.1)" }}>
        <div style={{ height: "100%", width: `${(6/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", gap: 20, padding: "24px", height: "calc(100% - 48px - 4px - 72px)", overflow: "hidden" }}>
        {/* Left - Policies */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{t("cki.terms.policiesHeader")}</h2>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", fontSize: "0.8125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {POLICIES}
          </div>
        </div>

        {/* Right - Signature */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, gap: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{t("cki.terms.signatureHeader")}</h2>
            <div style={{ position: "relative", width: "100%", maxWidth: 360, height: 180, border: "2px dashed rgba(255,255,255,0.25)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <canvas
                ref={canvasRef}
                width={720}
                height={360}
                style={{ width: "100%", height: "100%", cursor: "crosshair", touchAction: "none" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
              {!hasSigned && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9375rem", fontStyle: "italic" }}>{t("cki.terms.signHere")}</span>
                </div>
              )}
              {/* Signature line */}
              <div style={{ position: "absolute", bottom: 32, left: 24, right: 24, height: 1, background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 16, left: 24, pointerEvents: "none" }}>
                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>✕</span>
              </div>
            </div>
            {hasSigned && (
              <div style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
{t("cki.terms.signatureCaptured")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 2, height: 72, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 24px" }}>
        <button onClick={clearSignature} className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>{t("cki.terms.redoSignature")}</button>
        <button onClick={() => navigate("CKI-09")} className="btn btn-primary">{t("common.next")}</button>
      </div>
    </div>
  );
}
