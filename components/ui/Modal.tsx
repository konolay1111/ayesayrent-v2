"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { getButtonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  loading?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = "default",
  loading = false,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "fixed inset-0 z-[110] m-auto w-[min(100%,28rem)] max-h-[90dvh] overflow-auto",
        "rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "open:animate-fade-in-up",
      )}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          handleClose();
        }
      }}
    >
      <div className="p-6 sm:p-8">
        <h2 id={titleId} className="text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </h2>
        {description ? (
          <p id={descId} className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className={getButtonClassName("secondary", "md", "w-full sm:w-auto")}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={getButtonClassName(
              variant === "destructive" ? "destructive" : "primary",
              "md",
              cn("w-full sm:w-auto", loading && "cursor-wait opacity-80"),
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
