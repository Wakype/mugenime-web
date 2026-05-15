import { Compass } from "lucide-react";

export default function ExploreKomikLoading() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-[220px] flex items-center">
          <div className="space-y-4 w-full max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
              <Compass className="w-3.5 h-3.5 text-transparent" />
              <div className="h-4 w-32 bg-muted-foreground/20 rounded-md" />
            </div>
            <div className="h-10 md:h-14 w-1/2 bg-muted animate-pulse rounded-xl" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
          </div>
        </div>

        {/* --- MAIN LAYOUT SKELETON --- */}
        <section className="w-full space-y-6">
          {/* Header & Filter Trigger Skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-40 bg-muted animate-pulse rounded-lg" />
              <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
            </div>
            {/* Filter Button Skeleton */}
            <div className="h-10 w-32 bg-muted animate-pulse rounded-xl" />
          </div>

          {/* Grid Content Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {[...new Array(18)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[3/4.2] rounded-xl bg-muted animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                  <div className="h-3 w-2/3 bg-muted animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
