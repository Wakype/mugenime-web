import { Calendar, Info } from "lucide-react";

export default function JadwalLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-auto flex items-center">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 w-full">
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
                  <Calendar className="w-3.5 h-3.5 text-transparent" />
                  <div className="h-4 w-24 bg-muted-foreground/20 rounded-md" />
                </div>
                <div className="h-10 md:h-14 w-3/4 bg-muted animate-pulse rounded-xl" />
                <div className="h-4 w-full bg-muted animate-pulse rounded-md mt-2" />
                <div className="h-4 w-4/5 bg-muted animate-pulse rounded-md" />
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-muted animate-pulse border border-border w-full max-w-md">
                <Info className="w-5 h-5 text-muted-foreground/30" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-20 bg-muted-foreground/20 rounded" />
                  <div className="h-3 w-full bg-muted-foreground/20 rounded" />
                  <div className="h-3 w-4/5 bg-muted-foreground/20 rounded" />
                </div>
              </div>
            </div>
            <div className="shrink-0 w-full lg:w-auto">
              <div className="w-full lg:w-[200px] h-32 bg-muted animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>

        {/* --- TABS SKELETON --- */}
        <div className="flex gap-2 overflow-x-hidden pt-4 pb-2">
          {[...new Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 bg-muted animate-pulse rounded-lg shrink-0"
            />
          ))}
        </div>

        {/* --- GRID SKELETON --- */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-40 bg-muted animate-pulse rounded-lg" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {[...new Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-3/4 rounded-xl bg-muted animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                  <div className="h-3 w-2/3 bg-muted animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
