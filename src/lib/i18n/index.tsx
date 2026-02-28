"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Locale } from "./types";
import en from "./en";
import es from "./es";
import fr from "./fr";
import ja from "./ja";

const dictionaries: Record<Locale, Record<string, string>> = { en, es, fr, ja };

interface I18nContext {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nContext>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (key: string): string => {
      return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}

export { LOCALES } from "./types";
export type { Locale } from "./types";
