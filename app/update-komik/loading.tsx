import { Zap } from "lucide-react";

export default function UpdateKomikLoading() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-[250px] flex items-center">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
              <Zap className="w-3.5 h-3.5 text-transparent" />
              <div className="h-4 w-24 bg-muted-foreground/20 rounded-md" />
            </div>
            <div className="h-10 md:h-14 w-3/4 bg-muted animate-pulse rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-4/5 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>

        {/* --- GRID SKELETON --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {[...new Array(15)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4.2] rounded-xl bg-muted animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                <div className="h-3 w-2/3 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
