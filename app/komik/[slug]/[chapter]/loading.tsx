import { Loader2 } from "lucide-react";

export default function ReadKomikLoading() {
  return (
    <div className="relative min-h-screen bg-background pb-20 flex flex-col items-center">
      {/* ─── FAKE PAGES SKELETON ─── */}
      <div className="w-full max-w-[800px] flex flex-col gap-2 mt-4 px-4 sm:px-0">
        {/* Halaman 1 dengan spinner */}
        <div className="w-full aspect-[1/1.4] bg-muted animate-pulse rounded-lg flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground/40" />
          <span className="text-sm font-medium text-muted-foreground/60">
            Memuat gambar chapter...
          </span>
        </div>
        {/* Halaman 2 */}
        <div className="w-full aspect-[1/1.5] bg-muted animate-pulse rounded-lg" />
        {/* Halaman 3 */}
        <div className="w-full aspect-[1/1.4] bg-muted animate-pulse rounded-lg" />
      </div>

      {/* ─── FLOATING UI DOCK SKELETON ─── */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <div className="bg-background/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
          {/* Top Row Skeleton */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex flex-col gap-2 w-1/2 sm:w-1/3">
              <div className="h-3 w-full bg-muted animate-pulse rounded-full" />
              <div className="h-4 w-2/3 bg-muted animate-pulse rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
              <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
            </div>
          </div>

          {/* Bottom Row Skeleton */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-24 bg-muted animate-pulse rounded-xl" />
            <div className="flex items-center gap-1 bg-secondary/30 border border-border/40 p-1 rounded-xl">
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-muted animate-pulse rounded-lg" />
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-muted animate-pulse rounded-lg" />
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="h-10 w-28 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
