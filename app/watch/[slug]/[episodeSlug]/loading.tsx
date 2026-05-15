import { Play, Home } from "lucide-react";

export default function WatchLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-6 overflow-hidden">
      {/* --- BREADCRUMB SKELETON --- */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center gap-2">
          <Home className="w-3.5 h-3.5 text-muted-foreground/30" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded-md" />
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-8 lg:gap-y-8">
        {/* ==================== VIDEO PLAYER SKELETON ==================== */}
        <div className="lg:col-start-1 lg:col-span-8 lg:row-start-1 aspect-video rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-muted animate-pulse flex items-center justify-center">
          <Play className="w-12 h-12 text-muted-foreground/30" />
        </div>

        {/* ==================== LEFT CONTENT SKELETON ==================== */}
        <div className="flex flex-col gap-6 lg:col-start-1 lg:col-span-8 lg:row-start-2">
          {/* Player Controls Skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted animate-pulse rounded-lg" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-10 w-28 bg-muted animate-pulse rounded-lg" />
                <div className="h-10 w-28 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>

          {/* Server Tabs Skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="flex gap-2 overflow-hidden">
              <div className="h-10 w-24 bg-muted animate-pulse rounded-lg shrink-0" />
              <div className="h-10 w-24 bg-muted animate-pulse rounded-lg shrink-0" />
              <div className="h-10 w-24 bg-muted animate-pulse rounded-lg shrink-0" />
            </div>
          </div>

          {/* Anime Info Card Skeleton */}
          <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="w-20 sm:w-28 aspect-3/4 rounded-lg bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT CONTENT SKELETON (SIDEBAR) ==================== */}
        <div className="flex flex-col gap-6 lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-2">
          {/* Episode List Skeleton */}
          <div className="border border-border rounded-xl bg-card p-4 h-[400px] flex flex-col gap-3">
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="space-y-2 overflow-hidden">
              {[...new Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-muted animate-pulse rounded-lg shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Download Accordion Skeleton */}
          <div className="border border-border rounded-xl bg-card p-4 space-y-3">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded-lg" />
            <div className="h-12 w-full bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
