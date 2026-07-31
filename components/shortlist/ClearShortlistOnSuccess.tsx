"use client";

import { useEffect } from "react";
import { clearShortlist } from "@/lib/shortlist";

export function ClearShortlistOnSuccess() {
  useEffect(() => {
    clearShortlist();
  }, []);

  return null;
}
