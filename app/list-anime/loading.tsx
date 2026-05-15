import { Library } from "lucide-react";

export default function ListAnimeLoading() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-auto md:h-[220px] flex items-center">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 w-full">
            <div className="space-y-4 max-w-2xl flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
                <Library className="w-3.5 h-3.5 text-transparent" />
                <div className="h-4 w-24 bg-muted-foreground/20 rounded-md" />
              </div>
              <div className="h-10 md:h-14 w-3/4 bg-muted animate-pulse rounded-xl" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
            </div>
            <div className="shrink-0">
              <div className="w-40 h-32 bg-muted animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>

        {/* --- STICKY NAV SKELETON --- */}
        <div className="flex justify-center">
          <div className="bg-card border border-border rounded-2xl p-2 md:p-3 w-full max-w-5xl">
            <div className="flex gap-2 overflow-hidden px-1 py-1">
              {[...new Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 md:h-9 md:w-9 bg-muted animate-pulse rounded-lg shrink-0"
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- LIST CONTENT SKELETON --- */}
        <div className="space-y-12">
          {[...new Array(3)].map((_, sectionIdx) => (
            <div key={sectionIdx} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                <div className="h-px flex-1 bg-border" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...new Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-full rounded-xl bg-muted animate-pulse border border-border"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
