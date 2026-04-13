"use client";

import { useState, useEffect, useCallback } from "react";
import { KioskProvider } from "@/lib/kiosk-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import KioskFrame from "@/components/layout/KioskFrame";
import ScreenRouter from "@/components/ScreenRouter";
import ScreenNav from "@/components/ui/ScreenNav";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingSlides from "@/components/onboarding/OnboardingSlides";
import OrientationSelect from "@/components/onboarding/OrientationSelect";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";
import ROICalculator from "@/components/onboarding/ROICalculator";
import type { HotelConfig } from "@/lib/hotel-config";

// Steps: 0=Welcome, 1=Slide1, 2=Slide2, 3=Slide3, 4=Orientation, 5=Demo, 6=ROI Calculator
const TOTAL_STEPS = 6;

export default function Home() {
  const [step, setStep] = useState(0);
  const [leadName, setLeadName] = useState("");
  const [leadData, setLeadData] = useState<{ name: string; email: string; hotel: string; rooms: string; title: string } | null>(null);

  // CMS dynamic branding: when ?client={slug} is present on first load, fetch
  // the matching HotelConfig from KV and apply it to the kiosk ThemeProvider.
  // This is what makes shareable demo links work — a sales engineer can save
  // a "hilton-miami" config in /admin and send the boss a link that goes
  // straight into the kiosko already branded as Hilton.
  const [clientConfig, setClientConfig] = useState<HotelConfig | null>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientSlug, setClientSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = new URLSearchParams(window.location.search).get("client");
    if (!slug) return;
    setClientSlug(slug);
    setClientLoading(true);
    setStep(5); // skip onboarding entirely for shared demo links
    fetch(`/api/admin/configs/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) setClientConfig(data.config as HotelConfig);
      })
      .catch(() => {
        /* fall back to default hotelConfig on any error */
      })
      .finally(() => setClientLoading(false));
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const goPrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  // Keyboard navigation for onboarding steps only (not demo or ROI)
  useEffect(() => {
    if (step >= 5) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step, goNext, goPrev]);

  // Demo mode
  if (step === 5) {
    // Still fetching a ?client={slug} config → minimal loading splash.
    if (clientLoading) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#E8E8E3",
            fontFamily: "'Inter', sans-serif",
            color: "#6B7280",
            fontSize: "0.875rem",
            letterSpacing: "0.5px",
          }}
        >
          Loading kiosk configuration{clientSlug ? ` for "${clientSlug}"` : ""}…
        </div>
      );
    }
    return (
      <ThemeProvider config={clientConfig ?? undefined}>
        <I18nProvider>
          <KioskProvider guestNameOverride={leadName}>
            <KioskFrame
              onBackToSelection={clientSlug ? undefined : () => setStep(4)}
              onGoToROI={clientSlug ? undefined : () => setStep(6)}
            >
              <ScreenRouter />
            </KioskFrame>
            <ScreenNav />
          </KioskProvider>
        </I18nProvider>
      </ThemeProvider>
    );
  }

  // ROI Calculator (after demo)
  if (step === 6) {
    return (
      <I18nProvider>
        <ROICalculator
          leadName={leadName}
          onBack={() => setStep(5)}
          onBookDemo={() => window.open("https://trueomni.com/book_a_demo/", "_blank")}
        />
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      {step === 0 && (
        <OnboardingWelcome
          onNext={(name: string, data?: { name: string; email: string; hotel: string; rooms: string; title: string }) => {
            setLeadName(name);
            if (data) setLeadData(data);
            goNext();
          }}
        />
      )}
      {step === 1 && <OnboardingSlides slide={0} onClick={goNext} />}
      {step === 2 && <OnboardingSlides slide={1} onClick={goNext} />}
      {step === 3 && (
        <OnboardingSlides
          slide={2}
          onComplete={goNext}
          onClick={goNext}
        />
      )}
      {step === 4 && (
        <OrientationSelect name={leadName} onSelect={() => setStep(5)} />
      )}
      <OnboardingFooter
        currentStep={step}
        totalSteps={5}
        onStepClick={(s) => setStep(s)}
        hint={step > 0 && step <= 4 ? "Use arrow keys to navigate" : undefined}
        dark={step !== 4}
      />
    </I18nProvider>
  );
}
