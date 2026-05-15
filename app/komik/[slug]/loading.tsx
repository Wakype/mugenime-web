import { Info, Share2, BookmarkPlus } from "lucide-react";

export default function KomikDetailLoading() {
  return (
    <div className="relative min-h-screen bg-background pb-20 overflow-hidden">
      {/* HERO BACKGROUND SKELETON */}
      <div className="absolute top-0 left-0 z-0 w-full h-[50vh] md:h-[60vh] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-muted/30 animate-pulse" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background opacity-100" />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 pt-[5vh] md:pt-[15vh] relative z-10">
        {/* MOBILE SKELETON LAYOUT */}
        <div className="flex flex-col gap-6 lg:hidden">
          {/* Poster Skeleton */}
          <div className="max-w-[200px] w-full mx-auto">
            <div className="aspect-3/4 rounded-2xl bg-muted animate-pulse shadow-2xl ring-1 ring-border" />
          </div>

          {/* Header Skeleton */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded-full" />
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded-xl" />
            <div className="flex gap-2 pt-2">
              <div className="h-7 w-16 bg-muted animate-pulse rounded-full" />
              <div className="h-7 w-20 bg-muted animate-pulse rounded-full" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="space-y-3 w-full">
            <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-muted animate-pulse rounded-lg" />
              <div className="h-10 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </div>

        {/* DESKTOP SKELETON LAYOUT */}
        <div className="hidden lg:grid grid-cols-12 gap-10">
          {/* SIDEBAR (Left) */}
          <div className="col-span-3 space-y-6">
            <div className="aspect-3/4 rounded-2xl bg-muted animate-pulse shadow-2xl ring-1 ring-border" />

            <div className="space-y-3 w-full">
              <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center gap-2 h-10 bg-muted animate-pulse rounded-lg">
                  <Share2 className="w-4 h-4 text-muted-foreground/30" />
                </div>
                <div className="flex items-center justify-center gap-2 h-10 bg-muted animate-pulse rounded-lg">
                  <BookmarkPlus className="w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border space-y-4 shadow-sm h-64 animate-pulse">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground/30" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
              <div className="h-px bg-border w-full" />
              <div className="space-y-4 pt-2">
                {[...new Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 w-16 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT AREA (Right) */}
          <div className="col-span-9 space-y-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="h-4 w-40 bg-muted animate-pulse rounded-full" />
              <div className="h-14 w-2/3 bg-muted animate-pulse rounded-xl" />
              <div className="h-6 w-1/3 bg-muted animate-pulse rounded-lg" />
              <div className="flex gap-2 pt-2">
                <div className="h-7 w-20 bg-muted animate-pulse rounded-full" />
                <div className="h-7 w-24 bg-muted animate-pulse rounded-full" />
                <div className="h-7 w-16 bg-muted animate-pulse rounded-full" />
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-6 bg-muted animate-pulse rounded-full" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Episodes */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-muted animate-pulse rounded-full" />
                  <div className="h-6 w-32 bg-muted animate-pulse rounded-lg" />
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...new Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-3 h-16 bg-card border border-border rounded-lg animate-pulse"
                  >
                    <div className="h-2 w-12 bg-muted rounded mb-2" />
                    <div className="h-4 w-8 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
