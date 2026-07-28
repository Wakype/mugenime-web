"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  CloudOff,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import KomikCard from "@/components/komikCard";
import { KomikItem } from "@/lib/komikTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewestKomikSection({
  newestList,
}: {
  readonly newestList: KomikItem[];
}) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // --- ERROR / EMPTY STATE UI ---
  if (!newestList || newestList.length === 0) {
    return (
      <section className="space-y-6 pt-4 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5" />
              <span>Update Komik</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Chapter Terbaru
            </h2>
          </div>
        </div>

        {/* BOX ERROR FALLBACK */}
        <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-border rounded-3xl bg-muted/10 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative flex items-center justify-center w-20 h-20 mb-5">
            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping opacity-50" />
            <div className="relative p-4 bg-background border-2 border-destructive/30 text-destructive rounded-full shadow-lg shadow-destructive/10">
              <CloudOff className="w-8 h-8" />
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 tracking-tight">
            Gagal Memuat Data
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-8 text-[13.5px] leading-relaxed">
            Kami tidak dapat mengambil daftar komik terbaru saat ini. Server API
            mungkin sedang sibuk atau mengalami gangguan sementara.
          </p>

          <Button
            onClick={() => globalThis.location.reload()}
            className="rounded-full shadow-lg shadow-primary/20 font-semibold px-8 cursor-pointer transition-all"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Muat Ulang
          </Button>
        </div>
      </section>
    );
  }

  // --- MAIN UI ---
  return (
    <section className="space-y-6 pt-4 relative">
      {/* STICKY HEADER */}
      <div className="sticky top-16 md:top-[65px] z-30 bg-background pt-4 pb-4 border-b border-border transition-all">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5" />
              <span>Update Komik</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Chapter Terbaru
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewType === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewType("grid")}
                    className={`rounded-full h-9 w-9 cursor-pointer transition-colors ${
                      viewType === "grid"
                        ? ""
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium">
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewType === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewType("list")}
                    className={`rounded-full h-9 w-9 cursor-pointer transition-colors ${
                      viewType === "list"
                        ? ""
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium">
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              asChild
              className="rounded-full border-border hover:bg-secondary group h-9 px-4 text-xs font-semibold ml-2 cursor-pointer"
            >
              <Link href="/update-komik" prefetch={false}>
                Lihat Semua{" "}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT: Switches based on viewType */}
      {viewType === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-5 gap-x-3 gap-y-6 items-stretch pt-2">
          {newestList.map((comic, idx) => (
            <KomikCard
              key={comic.slug}
              comic={comic}
              index={idx}
              showChaptersList={true}
              viewType="grid"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {newestList.map((comic, idx) => (
            <KomikCard
              key={comic.slug}
              comic={comic}
              index={idx}
              showChaptersList={true}
              viewType="list"
            />
          ))}
        </div>
      )}
    </section>
  );
}
