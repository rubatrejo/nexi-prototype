"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useI18n } from "@/lib/i18n";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { SearchIcon } from "@/components/ui/Icons";

export default function CheckinLookup() {
  const { navigate, goBack } = useKiosk();
  const { t } = useI18n();
  const [method, setMethod] = useState<"confirmation" | "name" | "qr">("confirmation");
  const [query, setQuery] = useState("");

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      {/* Progress bar step 1/8 */}
      <div style={{ height: 4, background: "var(--border)", position: "relative" }}>
        <div style={{ height: "100%", width: `${(1/8)*100}%`, background: "var(--primary)", borderRadius: 2, transition: "width 500ms ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 48px", gap: 32 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)" }}>
            {t("cki.lookup.title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 8, lineHeight: 1.6 }}>
            {t("cki.lookup.subtitle")}
          </p>
        </div>

        {/* Method Tabs */}
        <div style={{ display: "flex", gap: 4, background: "var(--bg-elevated)", padding: 4, borderRadius: "var(--radius-full)" }}>
          {(["confirmation", "name", "qr"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { if (m === "qr") { navigate("CKI-01q" as any); return; } setMethod(m); }}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                background: method === m ? "var(--primary)" : "transparent",
                color: method === m ? "#fff" : "var(--text-secondary)",
                transition: "all 200ms",
              }}
            >
              {m === "confirmation" ? t("cki.lookup.confirmation") : m === "name" ? t("cki.lookup.name") : t("cki.lookup.qr")}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
            }}
          >
            <SearchIcon size={18} color="var(--text-tertiary)" />
            <input
              type="text"
              data-kiosk-keyboard
              inputMode="none"
              placeholder={method === "confirmation" ? t("cki.lookup.placeholder.confirmation") : method === "name" ? t("cki.lookup.placeholder.name") : ""}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.9375rem",
                color: "var(--text)",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => goBack()}
            className="btn btn-ghost"
          >
            {t("common.back")}
          </button>
          <button
            onClick={() => navigate("CKI-02a")}
            className="btn btn-primary"
          >
            {t("cki.lookup.search")}
          </button>
        </div>
      </div>
    </div>
  );
}
