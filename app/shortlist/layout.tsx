import { Suspense } from "react";

export default function ShortlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-white px-4 py-16 text-sm text-zinc-500">
          Loading shortlist...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
