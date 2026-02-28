"use client";

import { useState } from "react";
import { NexiIcon, NexiLogoFull, PoweredByTrueOmni } from "@/components/ui/Icons";
import { useI18n, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const BLOCKED_DOMAINS = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "aol.com", "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com", "live.com", "msn.com", "me.com", "gmx.com"];

interface LeadData {
  name: string;
  email: string;
  hotel: string;
  rooms: string;
  title: string;
}

export default function OnboardingWelcome({ onNext }: { onNext: (name: string, data?: LeadData) => void }) {
  const [form, setForm] = useState({ name: "", email: "", hotel: "", rooms: "", title: "" });
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { locale, setLocale, t } = useI18n();

  const validateEmail = (email: string) => {
    if (!email.includes("@")) return "Please enter a valid email address";
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "Please enter a valid email address";
    if (BLOCKED_DOMAINS.includes(domain)) return "Please use your corporate email address";
    return "";
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const err = validateEmail(form.email);
    setEmailError(err);
    if (!form.name || !form.email || !form.hotel || !form.rooms || !form.title || err) return;

    // Send welcome email in background
    fetch("/api/send-welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, locale }),
    }).catch(() => {}); // Fire and forget

    onNext(form.name, form);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      {/* Full-screen background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/images/unsplash/photo-1566073771259-6a8506099945.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        animation: "kenBurns 20s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.5) 100%)",
      }} />
      {/* Film grain */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
        <filter id="grain-w"><feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#grain-w)" />
      </svg>

      {/* Language Toggle — Inside card, top-right area */}

      {/* Content layer */}
      <div className="onb-content-wrap" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Left — 65% Text */}
        <div className="onb-welcome-left">
          <div style={{ marginBottom: 20 }}>
            <NexiLogoFull color="#fff" height={30} />
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3.5vw, 3rem)", fontWeight: 800,
            color: "#fff", lineHeight: 1.1, marginBottom: 16,
          }}>
            {t("onb.welcome.headline1")}{" "}
            <span style={{ textDecoration: "line-through", opacity: 0.5 }}>{t("onb.welcome.future")}</span>{" "}
            <span style={{ color: "#1288FF" }}>{t("onb.welcome.present")}</span>
            <br />{t("onb.welcome.headline2")}
          </h1>

          <div style={{ marginTop: 12, transform: "scale(1)", transformOrigin: "left center" }}>
            <PoweredByTrueOmni variant="white" />
          </div>
        </div>

        {/* Right — 35% Form card */}
        <div className="onb-welcome-right">
          <div className="onb-welcome-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <NexiIcon size={26} color="#1A1A1A" />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "#1A1A1A", letterSpacing: 1 }}>NEXI</span>
              </div>
              {/* Language Toggle */}
              <div style={{
                display: "flex", gap: 2,
                background: "#F3F4F6",
                borderRadius: 9999,
                padding: 2,
              }}>
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code as Locale)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 9999,
                      border: "none",
                      background: locale === l.code ? "#1288FF" : "transparent",
                      color: locale === l.code ? "#fff" : "#6B7280",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.625rem",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 2, color: "#9CA3AF", fontWeight: 600, marginBottom: 8 }}>
                  {t("onb.welcome.badge")}
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.2 }}>
                  {t("onb.welcome.formTitle")}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.5, marginBottom: 14 }}>
                  {t("onb.welcome.formSubtitle")}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { key: "name", labelKey: "onb.welcome.fieldName", placeholder: "John Smith", type: "text" },
                  { key: "email", labelKey: "onb.welcome.fieldEmail", placeholder: "john@yourhotel.com", type: "email" },
                  { key: "hotel", labelKey: "onb.welcome.fieldHotel", placeholder: "The Grand Resort", type: "text" },
                  { key: "rooms", labelKey: "onb.welcome.fieldRooms", placeholder: "150", type: "number" },
                  { key: "title", labelKey: "onb.welcome.fieldTitle", placeholder: "General Manager", type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                      {t(field.labelKey)}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => {
                        setForm({ ...form, [field.key]: e.target.value });
                        if (field.key === "email") setEmailError("");
                      }}
                      style={{
                        width: "100%", padding: "8px 12px", fontSize: "0.8125rem",
                        border: `1px solid ${(submitted && !form[field.key as keyof typeof form]) || (field.key === "email" && emailError) ? "#EF4444" : "#E5E7EB"}`,
                        borderRadius: 8, outline: "none", transition: "border 200ms",
                        background: "#FAFAFA", boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#1288FF")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                    {field.key === "email" && emailError && (
                      <p style={{ fontSize: "0.6875rem", color: "#EF4444", marginTop: 4 }}>{emailError}</p>
                    )}
                  </div>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ marginTop: 3, accentColor: "#1288FF" }} />
                <span style={{ fontSize: "0.75rem", color: "#6B7280", lineHeight: 1.4 }}>
                  {t("onb.welcome.newsletter")}
                </span>
              </label>

              <button
                onClick={handleSubmit}
                style={{
                  marginTop: 16, width: "100%", padding: "10px",
                  background: "#1288FF", color: "#fff", border: "none",
                  borderRadius: 9999, fontFamily: "var(--font-display)",
                  fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
                  transition: "background 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0A6FDB")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1288FF")}
              >
                {t("onb.welcome.continue")}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.6875rem", color: "#9CA3AF", marginTop: 10 }}>
                {t("onb.welcome.disclaimer")}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", opacity: 0.4 }}>
              <PoweredByTrueOmni variant="dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
