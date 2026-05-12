"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  { id: "trending", label: "Trending" },
  { id: "best-manga", label: "Best Manga" },
  { id: "best-manhwa", label: "Best Manhwa" },
  { id: "best-manhua", label: "Best Manhua" },
  { id: "anime-adaptations", label: "Anime Adaptations" },
];

export default function PopularFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "trending";

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === currentCategory) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    params.set("category", categoryId);

    router.push(`/popular-komik?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-5 rounded-2xl bg-card border border-border shadow-sm w-full">
      <div className="flex items-center gap-2.5 text-sm font-bold text-foreground capitalize tracking-wider whitespace-nowrap">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm shadow-primary/20">
          <Flame className="w-4 h-4 text-white" />{" "}
        </div>
        Filter Kategori Populer:
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {CATEGORY_OPTIONS.map((cat) => {
          const isSelected = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "px-3.5 py-1.5 text-sm md:text-base font-semibold transition-all cursor-pointer border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-background text-muted-foreground border-border hover:bg-secondary hover:text-foreground hover:border-primary/50",
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 mr-1.5" />}
                {cat.label}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
