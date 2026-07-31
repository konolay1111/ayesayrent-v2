import Link from "next/link";
import type { ReactNode } from "react";
import { Button, getButtonClassName, type ButtonVariant } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { publicCardClass } from "@/lib/public-ui";

type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
};

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        publicCardClass,
        "flex flex-col items-center px-6 py-16 text-center sm:px-10 sm:py-20",
        className,
      )}
      aria-live="polite"
    >
      {icon ? (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
          {icon}
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {action ? (
            action.href ? (
              <Link
                href={action.href}
                className={getButtonClassName(action.variant ?? "primary", "md")}
              >
                {action.label}
              </Link>
            ) : (
              <Button variant={action.variant ?? "primary"} onClick={action.onClick}>
                {action.label}
              </Button>
            )
          ) : null}
          {secondaryAction ? (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className={getButtonClassName(secondaryAction.variant ?? "secondary", "md")}
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <Button
                variant={secondaryAction.variant ?? "secondary"}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )
          ) : null}
        </div>
      )}
    </section>
  );
}
