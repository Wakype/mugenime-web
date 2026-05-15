import { Info, Download, Share2, BookmarkPlus } from "lucide-react";

export default function BatchDetailLoading() {
  return (
    <div className="relative min-h-screen bg-background pb-20 overflow-hidden">
      {/* --- HERO BACKGROUND SKELETON --- */}
      <div className="absolute top-0 left-0 z-0 w-full h-[40vh] md:h-[50vh] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-muted/30 animate-pulse" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background opacity-100" />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 pt-[5vh] md:pt-[10vh] relative z-10">
        {/* MOBILE LAYOUT SKELETON */}
        <div className="flex flex-col gap-8 lg:hidden">
          {/* Poster (16:9 Aspect Ratio) */}
          <div className="aspect-video w-full rounded-2xl bg-muted animate-pulse shadow-2xl ring-1 ring-border" />

          {/* Header */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded-full" />
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded-xl" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            </div>
          </div>

          {/* Info Block */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-4 h-64 animate-pulse">
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

          {/* Action Buttons */}
          <div className="space-y-3 w-full">
            <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-muted animate-pulse rounded-lg" />
              <div className="h-10 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-4">
            <div className="h-6 w-24 bg-muted animate-pulse rounded-lg mx-auto" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-4/5 bg-muted animate-pulse rounded mx-auto" />
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT SKELETON */}
        <div className="hidden lg:grid grid-cols-12 gap-10">
          {/* CONTENT AREA (Kiri) */}
          <div className="col-span-8 space-y-10">
            {/* Poster (16:9 Aspect Ratio) */}
            <div className="aspect-video w-full rounded-2xl bg-muted animate-pulse shadow-2xl ring-1 ring-border" />

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

            {/* Download Links Box */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <span className="w-1 h-6 bg-muted animate-pulse rounded-full" />
                <div className="h-6 w-48 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="h-16 w-full bg-muted animate-pulse rounded-xl" />
              <div className="h-32 w-full bg-muted animate-pulse rounded-xl mt-4" />
            </div>
          </div>

          {/* SIDEBAR AREA (Kanan) */}
          <div className="col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Info Block */}
            <div className="bg-card rounded-2xl p-5 border border-border space-y-4 h-72 animate-pulse">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground/30" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
              <div className="h-px bg-border w-full" />
              <div className="space-y-4 pt-2">
                {[...new Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 w-16 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Block */}
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-center gap-2 h-12 w-full bg-muted animate-pulse rounded-xl">
                <Download className="w-5 h-5 text-muted-foreground/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center gap-2 h-10 bg-muted animate-pulse rounded-lg">
                  <Share2 className="w-4 h-4 text-muted-foreground/30" />
                </div>
                <div className="flex items-center justify-center gap-2 h-10 bg-muted animate-pulse rounded-lg">
                  <BookmarkPlus className="w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
