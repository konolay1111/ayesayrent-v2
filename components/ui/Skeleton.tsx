import { cn } from "@/lib/cn";
import { publicSkeletonClass, publicSkeletonShimmerClass } from "@/lib/public-ui";

type SkeletonProps = {
  className?: string;
  shimmer?: boolean;
};

export function Skeleton({ className, shimmer = true }: SkeletonProps) {
  return (
    <div
      className={cn(shimmer ? publicSkeletonShimmerClass : publicSkeletonClass, className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}
