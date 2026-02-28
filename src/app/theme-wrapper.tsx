"use client";

import { ThemeProvider } from "@/lib/theme-provider";
import { I18nProvider } from "@/lib/i18n";

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
