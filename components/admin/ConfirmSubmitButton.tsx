"use client";

type ConfirmSubmitButtonProps = {
  message: string;
  children: React.ReactNode;
  className?: string;
};

export function ConfirmSubmitButton({
  message,
  children,
  className,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
