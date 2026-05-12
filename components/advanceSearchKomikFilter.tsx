"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  SlidersHorizontal,
  Check,
  RotateCcw,
  X,
  ChevronRight,
} from "lucide-react";
import { Genre } from "@/lib/komikTypes";
import { cn } from "@/lib/utils";

interface AdvanceSearchFilterProps {
  genres: Genre[];
}

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru", desc: "Paling baru diupdate" },
  { value: "popularity", label: "Terpopuler", desc: "Paling banyak dibaca" },
  { value: "rating", label: "Rating Tertinggi", desc: "Skor tertinggi" },
];

const ORDER_OPTIONS = [
  { value: "desc", label: "Menurun", icon: "↓" },
  { value: "asc", label: "Menaik", icon: "↑" },
];

const STATUS_OPTIONS = [
  { value: "ongoing", label: "Ongoing", color: "bg-emerald-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
  { value: "hiatus", label: "Hiatus", color: "bg-amber-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-rose-500" },
];

const FORMAT_OPTIONS = [
  { value: "manga", label: "Manga", flag: "🇯🇵" },
  { value: "manhwa", label: "Manhwa", flag: "🇰🇷" },
  { value: "manhua", label: "Manhua", flag: "🇨🇳" },
  { value: "mangatoon", label: "Mangatoon", flag: "📱" },
];

// Section wrapper with subtle divider
function FilterSection({
  title,
  badge,
  children,
}: Readonly<{
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {title}
        </span>
        {badge}
      </div>
      {children}
    </div>
  );
}

export default function AdvanceSearchFilter({
  genres,
}: Readonly<AdvanceSearchFilterProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreSearch, setGenreSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(searchParams.get("search") || "");
      setSort(searchParams.get("sort") || "latest");
      setSortOrder(searchParams.get("sortOrder") || "desc");
      setSelectedStatus(searchParams.getAll("status"));
      setSelectedFormats(searchParams.getAll("format"));
      setSelectedGenres(searchParams.getAll("genreIds"));
    }
  }, [searchParams, isOpen]);

  const toggleArrayItem = (
    array: string[],
    setArray: (val: string[]) => void,
    value: string,
  ) => {
    setArray(
      array.includes(value)
        ? array.filter((item) => item !== value)
        : [...array, value],
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (sort !== "latest") params.set("sort", sort);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    selectedStatus.forEach((s) => params.append("status", s));
    selectedFormats.forEach((f) => params.append("format", f));
    selectedGenres.forEach((g) => params.append("genreIds", g));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSort("latest");
    setSortOrder("desc");
    setSelectedStatus([]);
    setSelectedFormats([]);
    setSelectedGenres([]);
    setGenreSearch("");
    router.push(pathname, { scroll: true });
    setIsOpen(false);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (sort === "latest" ? 0 : 1) +
    (sortOrder === "desc" ? 0 : 1) +
    selectedStatus.length +
    selectedFormats.length +
    selectedGenres.length;

  const filteredGenres = genres.filter((g) =>
    g.data.name.toLowerCase().includes(genreSearch.toLowerCase()),
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="relative gap-2 shadow-lg cursor-pointer pr-4 pl-3.5 h-9 rounded-xl font-medium text-sm transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filter</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4.5 w-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary-foreground text-[9px] font-black text-primary leading-none px-1">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border/50 p-0 sm:max-w-sm bg-background"
        style={{ boxShadow: "-20px 0 60px -10px rgba(0,0,0,0.15)" }}
      >
        {/* ── Header ── */}
        <SheetHeader className="shrink-0 px-6 pt-6 pb-5 text-left border-b border-border/50">
          {/* Active filter chips row */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {searchQuery && (
                <ActiveChip
                  label={`"${searchQuery}"`}
                  onRemove={() => setSearchQuery("")}
                />
              )}
              {sort !== "latest" && (
                <ActiveChip
                  label={
                    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort
                  }
                  onRemove={() => setSort("latest")}
                />
              )}
              {sortOrder !== "desc" && (
                <ActiveChip
                  label="Menaik ↑"
                  onRemove={() => setSortOrder("desc")}
                />
              )}
              {selectedStatus.map((s) => (
                <ActiveChip
                  key={s}
                  label={STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s}
                  onRemove={() =>
                    toggleArrayItem(selectedStatus, setSelectedStatus, s)
                  }
                />
              ))}
              {selectedFormats.map((f) => (
                <ActiveChip
                  key={f}
                  label={FORMAT_OPTIONS.find((o) => o.value === f)?.label ?? f}
                  onRemove={() =>
                    toggleArrayItem(selectedFormats, setSelectedFormats, f)
                  }
                />
              ))}
              {selectedGenres.slice(0, 3).map((g) => (
                <ActiveChip
                  key={g}
                  label={g}
                  onRemove={() =>
                    toggleArrayItem(selectedGenres, setSelectedGenres, g)
                  }
                />
              ))}
              {selectedGenres.length > 3 && (
                <span className="text-[10px] text-muted-foreground px-1 self-center">
                  +{selectedGenres.length - 3} genre
                </span>
              )}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-base font-bold tracking-tight">
                Filter Pencarian
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5 text-muted-foreground/70">
                Temukan komik yang tepat untukmu
              </SheetDescription>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-0.5 shrink-0"
              >
                <RotateCcw className="w-3 h-3" /> Reset semua
              </button>
            )}
          </div>
        </SheetHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent">
          {/* Search */}
          <FilterSection title="Judul">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <Input
                placeholder="Cari judul komik..."
                className="pl-9 h-9 text-sm bg-muted/40 border-border/50 focus-visible:ring-1 focus-visible:bg-background rounded-lg transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </FilterSection>

          {/* Sort + Order in card grid */}
          <FilterSection title="Pengurutan">
            <div className="grid grid-cols-2 gap-2">
              {/* Sort */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground/60 pl-0.5">
                  Kriteria
                </p>
                <div className="flex flex-col gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all",
                        sort === opt.value
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                          sort === opt.value
                            ? "bg-primary-foreground"
                            : "bg-muted-foreground/30",
                        )}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground/60 pl-0.5">
                  Arah
                </p>
                <div className="flex flex-col gap-1">
                  {ORDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortOrder(opt.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all",
                        sortOrder === opt.value
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="font-mono text-[11px]">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Format */}
          <FilterSection title="Format">
            <div className="grid grid-cols-2 gap-1.5">
              {FORMAT_OPTIONS.map((fmt) => {
                const isSelected = selectedFormats.includes(fmt.value);
                return (
                  <button
                    key={fmt.value}
                    onClick={() =>
                      toggleArrayItem(
                        selectedFormats,
                        setSelectedFormats,
                        fmt.value,
                      )
                    }
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all border",
                      isSelected
                        ? "bg-primary/10 border-primary/40 text-primary font-medium shadow-sm"
                        : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border/50",
                    )}
                  >
                    <span className="text-base leading-none">{fmt.flag}</span>
                    <span className="text-xs font-medium">{fmt.label}</span>
                    {isSelected && (
                      <Check className="w-3 h-3 ml-auto shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Status">
            <div className="grid grid-cols-2 gap-1.5">
              {STATUS_OPTIONS.map((st) => {
                const isSelected = selectedStatus.includes(st.value);
                return (
                  <button
                    key={st.value}
                    onClick={() =>
                      toggleArrayItem(
                        selectedStatus,
                        setSelectedStatus,
                        st.value,
                      )
                    }
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all border",
                      isSelected
                        ? "bg-primary/10 border-primary/40 text-primary font-semibold shadow-sm"
                        : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border/50",
                    )}
                  >
                    <span
                      className={cn("w-2 h-2 rounded-full shrink-0", st.color)}
                    />
                    {st.label}
                    {isSelected && (
                      <Check className="w-3 h-3 ml-auto shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Genre */}
          <FilterSection
            title="Genre"
            badge={
              selectedGenres.length > 0 ? (
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full tabular-nums">
                  {selectedGenres.length} dipilih
                </span>
              ) : undefined
            }
          >
            {/* Genre search */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50" />
              <Input
                placeholder="Cari genre..."
                className="pl-7 h-8 text-xs bg-muted/40 border-border/40 focus-visible:ring-1 rounded-lg"
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 pr-1">
              {filteredGenres.map((genre) => {
                const genreValue = genre.data.name;
                const isSelected = selectedGenres.includes(genreValue);
                return (
                  <button
                    key={genre.id}
                    onClick={() =>
                      toggleArrayItem(
                        selectedGenres,
                        setSelectedGenres,
                        genreValue,
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 shrink-0" />}
                    {genreValue}
                  </button>
                );
              })}
              {filteredGenres.length === 0 && (
                <p className="text-xs text-muted-foreground/50 py-2 w-full text-center">
                  Genre tidak ditemukan
                </p>
              )}
            </div>
          </FilterSection>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-border/50 bg-muted/20 px-6 py-4 flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-foreground h-9 px-3 rounded-lg"
            onClick={resetFilters}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            className="flex-1 h-9 rounded-lg font-semibold shadow-md text-sm gap-2 hover:shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            onClick={applyFilters}
          >
            Terapkan Filter
            {activeFiltersCount > 0 && (
              <span className="bg-primary-foreground/20 text-primary-foreground text-[10px] font-black px-1.5 py-0.5 rounded-md tabular-nums leading-none">
                {activeFiltersCount}
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Small helper: active filter chip ──
function ActiveChip({
  label,
  onRemove,
}: Readonly<{
  label: string;
  onRemove: () => void;
}>) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20 max-w-[120px]">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        className="shrink-0 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}
