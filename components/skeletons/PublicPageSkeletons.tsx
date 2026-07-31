import { Skeleton } from "@/components/ui/Skeleton";
import {
  publicCardClass,
  publicContainerClass,
  publicPageClass,
  publicSearchPanelClass,
  publicSectionClass,
} from "@/lib/public-ui";

export function PropertyCardSkeleton() {
  return (
    <article className={`${publicCardClass} overflow-hidden`}>
      <Skeleton className="h-48 w-full rounded-none sm:h-52" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </article>
  );
}

export function HomePageSkeleton() {
  return (
    <div className={publicPageClass}>
      <Skeleton className="h-[4.25rem] w-full rounded-none" />
      <main className="flex-1">
        <section className={`${publicSectionClass} bg-card`}>
          <div className={`${publicContainerClass} space-y-6 text-center`}>
            <Skeleton className="mx-auto h-12 w-3/4 max-w-lg" />
            <Skeleton className="mx-auto h-6 w-full max-w-xl" />
            <Skeleton className="mx-auto h-6 w-2/3 max-w-md" />
            <div className="flex justify-center gap-3 pt-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </section>
        <section className={publicSectionClass}>
          <div className={publicContainerClass}>
            <Skeleton className="mx-auto mb-10 h-8 w-48" />
            <div className={publicSearchPanelClass}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-12" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Skeleton className="h-64 w-full rounded-none" />
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className={publicPageClass}>
      <Skeleton className="h-[4.25rem] w-full rounded-none" />
      <main className="flex-1">
        <section className="border-b border-border bg-card px-4 py-12">
          <div className={`${publicContainerClass} space-y-4`}>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-16 w-full max-w-3xl" />
          </div>
        </section>
        <div className={`${publicContainerClass} space-y-8 px-4 py-8`}>
          <div className={publicSearchPanelClass}>
            <Skeleton className="mb-6 h-6 w-32" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12" />
              ))}
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ShortlistPageSkeleton() {
  return (
    <div className={publicPageClass}>
      <Skeleton className="h-[4.25rem] w-full rounded-none" />
      <main className="flex-1">
        <section className="border-b border-border bg-card px-4 py-12">
          <div className={`${publicContainerClass} space-y-4`}>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-16 w-full max-w-2xl" />
          </div>
        </section>
        <div className={`${publicContainerClass} grid gap-8 px-4 py-8 lg:grid-cols-5`}>
          <div className="space-y-4 lg:col-span-2">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
          <div className={`${publicCardClass} space-y-4 p-8 lg:col-span-3`}>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
