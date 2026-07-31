"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

export function SuccessToastOnMount({ message }: { message: string }) {
  const toast = useToast();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success(message);
  }, [message, toast]);

  return null;
}
