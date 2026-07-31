"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { useToast } from "@/components/ui/Toast";

type ThemeOption = "light" | "dark" | "system";

const options: ThemeOption[] = ["light", "dark", "system"];

function ThemeIcon({ mode }: { mode: ThemeOption }) {
  if (mode === "light") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    );
  }

  if (mode === "dark") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-2.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v8.25A2.25 2.25 0 0 0 5.25 17.25h13.5A2.25 2.25 0 0 0 21 15.75Z" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={`inline-flex h-9 w-[7.5rem] rounded-lg border border-border bg-card ${className}`}
        aria-hidden="true"
      />
    );
  }

  const active = (theme ?? "system") as ThemeOption;

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 ${className}`}
      role="group"
      aria-label={t("theme.switch")}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
            active === option
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-pressed={active === option}
          aria-label={t(`theme.${option}`)}
          title={t(`theme.${option}`)}
          onClick={() => {
            if (active !== option) {
              setTheme(option);
              toast.success(t("toast.themeChanged"));
            }
          }}
        >
          <ThemeIcon mode={option} />
          <span className="sr-only">
            {t(`theme.${option}`)}
            {option === "system" && resolvedTheme ? ` (${resolvedTheme})` : ""}
          </span>
        </button>
      ))}
    </div>
  );
}
