"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  Check,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Genre } from "@/lib/komikTypes";
import { cn } from "@/lib/utils";

interface AdvanceSearchFilterProps {
  genres: Genre[];
}

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru" },
  { value: "popularity", label: "Terpopuler" },
  { value: "rating", label: "Rating Tertinggi" },
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

// Breakpoint used to decide whether the panel should default to open.
// Matches the `md` grid breakpoint already used further down.
const DESKTOP_QUERY = "(min-width: 768px)";

interface FilterState {
  search: string;
  sort: string;
  sortOrder: string;
  status: string[];
  format: string[];
  genres: string[];
}

export default function AdvanceSearchFilter({
  genres,
}: Readonly<AdvanceSearchFilterProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Controlled states for filter options
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreSearch, setGenreSearch] = useState("");

  // Panel starts closed (matches the server-rendered markup) so there is no
  // hydration mismatch; on mount we open it automatically on wider screens.
  const [isExpanded, setIsExpanded] = useState(false);
  const [readyForMotion, setReadyForMotion] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSort(searchParams.get("sort") || "latest");
    setSortOrder(searchParams.get("sortOrder") || "desc");
    setSelectedStatus(searchParams.getAll("status"));
    setSelectedFormats(searchParams.getAll("format"));
    setSelectedGenres(searchParams.getAll("genreIds"));
  }, [searchParams]);

  // Decide the initial open/closed state once, on the client only.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    setIsExpanded(mq.matches);
    // Defer enabling the collapse animation until after this first paint,
    // so the initial state doesn't visibly animate in.
    const raf = requestAnimationFrame(() => setReadyForMotion(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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

  const buildParams = useCallback(
    (overrides: Partial<FilterState> = {}) => {
      const state: FilterState = {
        search: overrides.search ?? searchQuery,
        sort: overrides.sort ?? sort,
        sortOrder: overrides.sortOrder ?? sortOrder,
        status: overrides.status ?? selectedStatus,
        format: overrides.format ?? selectedFormats,
        genres: overrides.genres ?? selectedGenres,
      };

      const params = new URLSearchParams();
      params.set("page", "1");
      if (state.search.trim()) params.set("search", state.search.trim());
      if (state.sort !== "latest") params.set("sort", state.sort);
      if (state.sortOrder !== "desc") params.set("sortOrder", state.sortOrder);
      state.status.forEach((s) => params.append("status", s));
      state.format.forEach((f) => params.append("format", f));
      state.genres.forEach((g) => params.append("genreIds", g));
      return params;
    },
    [
      searchQuery,
      sort,
      sortOrder,
      selectedStatus,
      selectedFormats,
      selectedGenres,
    ],
  );

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router],
  );

  const applyFilters = () => navigate(buildParams());

  const resetFilters = () => {
    setSearchQuery("");
    setSort("latest");
    setSortOrder("desc");
    setSelectedStatus([]);
    setSelectedFormats([]);
    setSelectedGenres([]);
    setGenreSearch("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Chips reflect filters that are already applied, so removing one should
  // update the URL immediately instead of waiting for another "Terapkan" click.
  const removeSearch = () => {
    setSearchQuery("");
    navigate(buildParams({ search: "" }));
  };
  const removeSort = () => {
    setSort("latest");
    navigate(buildParams({ sort: "latest" }));
  };
  const removeSortOrder = () => {
    setSortOrder("desc");
    navigate(buildParams({ sortOrder: "desc" }));
  };
  const removeStatus = (value: string) => {
    const next = selectedStatus.filter((s) => s !== value);
    setSelectedStatus(next);
    navigate(buildParams({ status: next }));
  };
  const removeFormat = (value: string) => {
    const next = selectedFormats.filter((f) => f !== value);
    setSelectedFormats(next);
    navigate(buildParams({ format: next }));
  };
  const removeGenre = (value: string) => {
    const next = selectedGenres.filter((g) => g !== value);
    setSelectedGenres(next);
    navigate(buildParams({ genres: next }));
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
    <div className="w-full rounded-3xl bg-card border border-border/80 shadow-md p-4 sm:p-6 space-y-4 transition-all">
      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
                Filter Pencarian
              </h2>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground px-1.5 shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
              {isPending && (
                <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              )}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Pilih kriteria untuk mempersempit hasil pencarian komik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 px-2.5 rounded-lg"
            >
              <RotateCcw className="w-3 h-3 sm:mr-1.5" />
              <span className="hidden sm:inline">Reset All</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
            aria-controls="advance-filter-panel"
            className="h-8 text-xs font-semibold px-2.5 rounded-lg border-border/70 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Sembunyikan Panel</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Buka Panel Filter</span>
              </>
            )}
            <span className="sm:hidden">Filter</span>
          </Button>
        </div>
      </div>

      {/* ── ACTIVE CHIPS BAR ── */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mr-1">
            Aktif:
          </span>
          {searchQuery && (
            <ActiveChip label={`"${searchQuery}"`} onRemove={removeSearch} />
          )}
          {sort !== "latest" && (
            <ActiveChip
              label={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort}
              onRemove={removeSort}
            />
          )}
          {sortOrder !== "desc" && (
            <ActiveChip label="Menaik ↑" onRemove={removeSortOrder} />
          )}
          {selectedStatus.map((s) => (
            <ActiveChip
              key={s}
              label={STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s}
              onRemove={() => removeStatus(s)}
            />
          ))}
          {selectedFormats.map((f) => (
            <ActiveChip
              key={f}
              label={FORMAT_OPTIONS.find((o) => o.value === f)?.label ?? f}
              onRemove={() => removeFormat(f)}
            />
          ))}
          {selectedGenres.map((g) => (
            <ActiveChip key={g} label={g} onRemove={() => removeGenre(g)} />
          ))}
        </div>
      )}

      {/* ── ALWAYS-VISIBLE SEARCH BAR ── */}
      <div className="space-y-1.5 pt-1">
        <label
          htmlFor="komik-search-input"
          className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5 text-primary" />
          Kata Kunci Judul
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              id="komik-search-input"
              placeholder="Cari judul komik..."
              className="pl-9 h-10 text-sm bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:bg-background rounded-xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Hapus kata kunci"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={applyFilters}
            disabled={isPending}
            className="lg:hidden flex h-10 px-5 rounded-xl font-bold text-sm shadow-md gap-1.5 cursor-pointer shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Filter className="w-3.5 h-3.5" />
            )}
            <span>Terapkan</span>
          </Button>
        </div>
      </div>

      {/* ── COLLAPSIBLE ADVANCED FILTERS ── */}
      {/* Grid-rows trick animates height smoothly (incl. to/from 0) without JS measuring. */}
      <div
        id="advance-filter-panel"
        className={cn(
          "grid",
          readyForMotion &&
            "transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 pt-2">
            {/* GRID FILTERS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Pengurutan & Arah */}
              <div className="space-y-2 bg-muted/20 p-3.5 rounded-2xl border border-border/40">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                  Pengurutan
                </label>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground/60">
                    Kriteria:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSort(opt.value)}
                        aria-pressed={sort === opt.value}
                        className={cn(
                          "cursor-pointer px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                          sort === opt.value
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-background/80 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-semibold text-muted-foreground/60">
                    Arah Urutan:
                  </span>
                  <div className="flex gap-1">
                    {ORDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortOrder(opt.value)}
                        aria-pressed={sortOrder === opt.value}
                        className={cn(
                          "cursor-pointer flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                          sortOrder === opt.value
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-background/80 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <span className="font-mono">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Format & Status */}
              <div className="space-y-3 bg-muted/20 p-3.5 rounded-2xl border border-border/40">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    Format Komik
                  </label>
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
                          aria-pressed={isSelected}
                          className={cn(
                            "cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                            isSelected
                              ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-xs"
                              : "bg-background/80 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <span className="text-sm">{fmt.flag}</span>
                          <span>{fmt.label}</span>
                          {isSelected && (
                            <Check className="w-3 h-3 ml-auto text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    Status
                  </label>
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
                          aria-pressed={isSelected}
                          className={cn(
                            "cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                            isSelected
                              ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-xs"
                              : "bg-background/80 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              st.color,
                            )}
                          />
                          <span>{st.label}</span>
                          {isSelected && (
                            <Check className="w-3 h-3 ml-auto text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Genre Selector */}
              <div className="space-y-2 bg-muted/20 p-3.5 rounded-2xl border border-border/40 md:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    Genre Komik
                  </label>
                  {selectedGenres.length > 0 && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {selectedGenres.length} Dipilih
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50" />
                  <Input
                    placeholder="Cari genre..."
                    className="pl-7 h-7 text-xs bg-background/80 border-border/50 focus-visible:ring-1 rounded-lg"
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                  />
                  {genreSearch && (
                    <button
                      onClick={() => setGenreSearch("")}
                      aria-label="Hapus pencarian genre"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1 pt-1">
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
                        aria-pressed={isSelected}
                        className={cn(
                          "cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-background/80 text-muted-foreground border-border/40 hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {isSelected && (
                          <Check className="w-2.5 h-2.5 shrink-0" />
                        )}
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
              </div>
            </div>

            {/* FOOTER ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 text-xs text-muted-foreground hover:text-foreground px-3 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Filter
              </Button>

              <Button
                onClick={applyFilters}
                disabled={isPending}
                className="h-9 px-6 rounded-xl font-bold text-xs shadow-md gap-1.5 hover:shadow-primary/20 transition-all cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Filter className="w-3.5 h-3.5" />
                )}
                Terapkan Filter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-primary/20 max-w-[140px] shadow-2xs">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        aria-label={`Hapus filter ${label}`}
        className="shrink-0 hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
