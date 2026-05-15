import { Tags } from "lucide-react";

export default function GenreAnimeLoading() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-[220px] flex items-center">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
              <Tags className="w-3.5 h-3.5 text-transparent" />
              <div className="h-4 w-24 bg-muted-foreground/20 rounded-md" />
            </div>
            <div className="h-10 md:h-14 w-1/2 bg-muted animate-pulse rounded-xl" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
          </div>
        </div>

        {/* --- GENRE GRID SKELETON --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {[...new Array(24)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full rounded-xl bg-muted animate-pulse border border-border"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
