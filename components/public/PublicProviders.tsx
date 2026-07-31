"use client";

import { ThemeProvider } from "@/components/public/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/types";

type PublicProvidersProps = {
  children: React.ReactNode;
  initialLocale: Locale;
};

export function PublicProviders({
  children,
  initialLocale,
}: PublicProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <ToastProvider>{children}</ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
