import { PackageOpen } from "lucide-react";

export default function BatchAnimeLoading() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-auto md:h-[220px] flex items-center">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
            <div className="space-y-4 max-w-2xl flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
                <PackageOpen className="w-3.5 h-3.5 text-transparent" />
                <div className="h-4 w-28 bg-muted-foreground/20 rounded-md" />
              </div>
              <div className="h-10 md:h-14 w-3/4 bg-muted animate-pulse rounded-xl" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
            </div>
            <div className="shrink-0">
              <div className="w-[120px] h-20 bg-muted animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>

        {/* --- GRID SKELETON (16:9 Aspect Ratio) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...new Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
              <div className="space-y-2 px-1">
                <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
