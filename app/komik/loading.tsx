import { Megaphone } from "lucide-react";

export default function KomikHomeLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      {/* ─── HERO SECTION SKELETON ─── */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-muted animate-pulse">
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
        <div className="container mx-auto relative z-10 w-full h-full px-4 flex items-end pb-16 md:pb-20">
          <div className="max-w-3xl space-y-4 w-full">
            <div className="h-6 w-24 bg-muted-foreground/20 rounded-full" />
            <div className="h-12 md:h-16 w-3/4 bg-muted-foreground/20 rounded-xl" />
            <div className="h-4 w-1/2 bg-muted-foreground/20 rounded-md" />
            <div className="h-12 w-40 bg-muted-foreground/20 rounded-full mt-4" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-12">
        {/* ─── ANNOUNCEMENT SKELETON ─── */}
        <div className="space-y-4 container mx-auto mt-14 lg:mt-7">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
            <Megaphone className="w-4 h-4 text-muted-foreground/30" />
            <span className="text-muted-foreground/30">Pengumuman</span>
          </div>
          <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
        </div>

        <div className="container mx-auto relative z-20 space-y-12 mt-8 md:mt-12">
          {/* ─── POPULAR SECTION SKELETON ─── */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
                <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-muted animate-pulse rounded-full hidden sm:block" />
                <div className="h-9 w-9 bg-muted animate-pulse rounded-full hidden sm:block" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded-full ml-1 sm:ml-2" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[...new Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[20%]"
                >
                  <div className="aspect-[3/4.2] rounded-xl bg-muted animate-pulse" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                    <div className="h-3 w-2/3 bg-muted animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── NEWEST SECTION SKELETON ─── */}
          <section className="space-y-6 pt-4">
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
                <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-muted animate-pulse rounded-full hidden sm:block" />
                <div className="h-9 w-9 bg-muted animate-pulse rounded-full hidden sm:block" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded-full ml-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-5 gap-x-3 gap-y-6 pt-2">
              {[...new Array(10)].map((_, i) => (
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
    </div>
  );
}
