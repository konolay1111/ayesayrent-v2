"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SHORTLIST_CHANGE_EVENT,
  addToShortlist,
  isInShortlist,
  removeFromShortlist,
} from "@/lib/shortlist";

type ShortlistButtonProps = {
  propertyCode: string;
  className?: string;
};

const defaultClassName =
  "inline-flex h-11 flex-1 flex-col items-center justify-center rounded-xl border border-emerald-200 bg-white text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50";

export function ShortlistButton({
  propertyCode,
  className = defaultClassName,
}: ShortlistButtonProps) {
  const [added, setAdded] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  const syncState = useCallback(() => {
    setAdded(isInShortlist(propertyCode));
  }, [propertyCode]);

  useEffect(() => {
    syncState();

    const handleChange = () => syncState();
    window.addEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [syncState]);

  const handleClick = () => {
    if (added) {
      if (showRemove) {
        removeFromShortlist(propertyCode);
        setShowRemove(false);
      } else {
        setShowRemove(true);
      }
      return;
    }

    addToShortlist(propertyCode);
  };

  if (added && showRemove) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${className} border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100`}
        aria-label={`Remove ${propertyCode} from shortlist`}
      >
        <span>ဖယ်ရှားရန်</span>
        <span className="text-xs font-normal text-red-600/80">Remove</span>
      </button>
    );
  }

  if (added) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${className} border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100`}
        aria-pressed="true"
        aria-label={`${propertyCode} is in your shortlist. Click to remove.`}
      >
        <span>ရွေးချယ်ပြီး</span>
        <span className="text-xs font-normal text-emerald-600/80">Added</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-pressed="false"
      aria-label={`Add ${propertyCode} to shortlist`}
    >
      <span>ရွေးချယ်စာရင်းသို့ ထည့်ရန်</span>
      <span className="text-xs font-normal text-emerald-600/70">
        Add to Shortlist
      </span>
    </button>
  );
}
