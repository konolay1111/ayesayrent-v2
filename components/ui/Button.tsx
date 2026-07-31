import { cn } from "@/lib/cn";
import {
  publicBtnDestructiveClass,
  publicBtnGhostClass,
  publicBtnLgClass,
  publicBtnOutlineClass,
  publicBtnPrimaryClass,
  publicBtnSecondaryClass,
  publicBtnSmClass,
} from "@/lib/public-ui";

const variantClasses = {
  primary: publicBtnPrimaryClass,
  secondary: publicBtnSecondaryClass,
  outline: publicBtnOutlineClass,
  ghost: publicBtnGhostClass,
  destructive: publicBtnDestructiveClass,
} as const;

const sizeClasses = {
  sm: publicBtnSmClass,
  md: "",
  lg: publicBtnLgClass,
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

function Spinner() {
  return (
    <span
      className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        loading && "cursor-wait opacity-80",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function SubmitButton({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: Omit<ButtonProps, "type"> & { type?: "submit" | "button" }) {
  return (
    <button
      type="submit"
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        loading && "cursor-wait opacity-80",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function getButtonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string,
) {
  return cn(variantClasses[variant], sizeClasses[size], extra);
}
