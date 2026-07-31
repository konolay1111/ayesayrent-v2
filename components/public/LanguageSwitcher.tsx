"use client";

import { useTranslation } from "@/lib/i18n/locale-provider";
import { useToast } from "@/components/ui/Toast";
import type { Locale } from "@/lib/i18n/types";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useTranslation();
  const toast = useToast();

  const buttonClass = (active: boolean) =>
    `min-h-9 min-w-9 rounded-lg px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
      active
        ? "bg-primary text-primary-foreground"
        : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
    }`;

  const set = (next: Locale) => {
    if (next !== locale) {
      setLocale(next);
      toast.success(t("toast.languageChanged"));
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="group"
      aria-label={t("lang.switch")}
    >
      <button
        type="button"
        className={buttonClass(locale === "en")}
        aria-pressed={locale === "en"}
        onClick={() => set("en")}
      >
        {t("lang.en")}
      </button>
      <button
        type="button"
        className={buttonClass(locale === "my")}
        aria-pressed={locale === "my"}
        onClick={() => set("my")}
      >
        {t("lang.my")}
      </button>
    </div>
  );
}
