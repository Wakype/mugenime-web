import { Tags } from "lucide-react";

export default function GenreKomikLoading() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SKELETON --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden h-[220px] flex items-center">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit animate-pulse">
              <Tags className="w-3.5 h-3.5 text-transparent" />
              <div className="h-4 w-28 bg-muted-foreground/20 rounded-md" />
            </div>
            <div className="h-10 md:h-14 w-3/4 bg-muted animate-pulse rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-4/5 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>

        {/* --- INTERACTIVE GENRE FILTER SKELETON --- */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            <div className="h-5 w-32 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...new Array(14)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 sm:w-24 bg-muted animate-pulse rounded-full"
              />
            ))}
          </div>
        </div>

        {/* --- RESULT TITLE SKELETON --- */}
        <div className="flex items-center justify-between border-b border-border pb-2 pt-4">
          <div className="h-7 w-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded-md" />
        </div>

        {/* --- GRID CONTENT SKELETON --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
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
      </div>
    </div>
  );
}
