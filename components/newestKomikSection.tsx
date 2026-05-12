"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
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

  return (
    <section className="space-y-6 pt-4 relative">
      {/* STICKY HEADER */}
      {/* top-16 assuming your navbar is ~64px height. Adjust if needed */}
      <div className="sticky top-16 md:top-[65px] z-30 bg-background pt-4 pb-4 border-b border-border transition-all">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5" />
              <span>Update Terbaru</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Rilis Baru
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
              className="rounded-full border-border hover:bg-secondary group h-9 px-4 text-xs font-semibold ml-2"
            >
              <Link href="/update-komik">
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
