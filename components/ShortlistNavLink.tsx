"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { SHORTLIST_CHANGE_EVENT, readShortlist } from "@/lib/shortlist";
import { publicNavLinkClass } from "@/lib/public-ui";

type ShortlistNavLinkProps = {
  className?: string;
  onNavigate?: boolean;
};

export function ShortlistNavLink({
  className = "",
  onNavigate = false,
}: ShortlistNavLinkProps) {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(0);

  const syncCount = useCallback(() => {
    setCount(readShortlist().length);
  }, []);

  useEffect(() => {
    syncCount();

    const handleChange = () => syncCount();
    window.addEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [syncCount]);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 400);
      prevCount.current = count;
      return () => window.clearTimeout(timer);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <Link
      href="/shortlist"
      className={`relative inline-flex min-h-10 items-center gap-2 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/25 ${
        onNavigate ? "text-primary" : publicNavLinkClass
      } ${className}`}
      aria-current={onNavigate ? "page" : undefined}
    >
      {t("nav.shortlist")}
      {count > 0 ? (
        <span
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-[11px] font-bold text-primary-foreground ${
            pulse ? "animate-badge-pop" : ""
          }`}
          aria-label={`${count} ${t("shortlist.itemCount")}`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
