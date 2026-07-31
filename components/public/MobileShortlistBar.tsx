"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IconHeartFilled, IconList } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { SHORTLIST_CHANGE_EVENT, readShortlist } from "@/lib/shortlist";
import { getButtonClassName } from "@/components/ui/Button";

export function MobileShortlistBar() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

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

  if (count === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 p-3 backdrop-blur-lg lg:hidden"
      role="region"
      aria-label={t("nav.shortlist")}
    >
      <Link
        href="/shortlist"
        className={getButtonClassName("primary", "md", "w-full shadow-lg shadow-primary/20")}
      >
        <IconHeartFilled size={18} className="text-primary-foreground" />
        {t("nav.shortlist")}
        <span className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-foreground/20 px-2 text-xs font-bold">
          {count}
        </span>
        <IconList size={18} className="ml-auto opacity-80" />
      </Link>
    </div>
  );
}
