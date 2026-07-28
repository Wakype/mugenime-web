"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Tags } from "lucide-react";

type Genre = { genreId: string; title: string };

export function GenreClient({ genres }: Readonly<{ genres: Genre[] }>) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "a-h" | "i-p" | "q-z">("all");

  const sorted = useMemo(
    () => [...genres].sort((a, b) => a.title.localeCompare(b.title)),
    [genres],
  );

  const filtered = useMemo(() => {
    const ranges: Record<string, [string, string]> = {
      "a-h": ["a", "h"],
      "i-p": ["i", "p"],
      "q-z": ["q", "z"],
    };
    return sorted.filter((g) => {
      const c = g.title[0].toLowerCase();
      const inRange =
        filter === "all" || (c >= ranges[filter][0] && c <= ranges[filter][1]);
      const matchesQuery = g.title
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      return inRange && matchesQuery;
    });
  }, [sorted, filter, query]);

  const filterTabs: { label: string; value: typeof filter }[] = [
    { label: "Semua", value: "all" },
    { label: "A – H", value: "a-h" },
    { label: "I – P", value: "i-p" },
    { label: "Q – Z", value: "q-z" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

        .genre-card { position: relative; overflow: hidden; display: block; }
        .genre-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: hsl(var(--primary));
          transform: translateY(100%);
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .genre-card:hover::before { transform: translateY(0); }
        .genre-card:hover .gc-num   { color: hsl(var(--primary-foreground) / 0.4); }
        .genre-card:hover .gc-title { color: hsl(var(--primary-foreground)); }
        .genre-card:hover .gc-arrow { opacity: 1; }

        .gc-num, .gc-title, .gc-arrow {
          position: relative;
          z-index: 1;
          transition: color 0.18s, opacity 0.18s;
        }
        .gc-arrow { opacity: 0; }

        .filter-tab {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border: 1.5px solid hsl(var(--border));
          background: transparent;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          border-radius: 6px;
        }
        .filter-tab:hover {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
        }
        .filter-tab.active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }

        .gp-search { font-family: 'DM Mono', monospace; }
        .gp-search:focus { outline: none; }
        .gp-search::placeholder { color: hsl(var(--muted-foreground)); }

        .gp-mono { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="min-h-screen pb-20 py-10 bg-background">
        <div className="container mx-auto px-4 space-y-8">
          {/* ── HEADER (original, preserved) ── */}
          <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Tags className="w-3.5 h-3.5" />
                List Genre
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Cari <span className="text-primary">Genre Anime</span>
              </h1>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                Temukan anime favoritmu berdasarkan genre. Mulai comedy,
                fantasy, drama, action hingga romance.
              </p>
            </div>
          </div>

          {/* ── SEARCH + FILTERS ── */}
          <div className="space-y-3">
            {/* Search */}
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 h-12 focus-within:border-primary transition-colors">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="gp-search bg-transparent flex-1 text-sm text-foreground"
                type="text"
                placeholder="cari genre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* Count badge */}
              <span className="gp-mono text-[11px] text-muted-foreground shrink-0">
                {filtered.length} genre
              </span>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`filter-tab${filter === tab.value ? " active" : ""}`}
                  onClick={() => setFilter(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── GENRE GRID ── */}
          {filtered.length === 0 ? (
            <p className="gp-mono text-center py-16 text-sm text-muted-foreground">
              Tidak ada genre ditemukan.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
                gap: 2,
                background: "hsl(var(--border))",
                border: "2px solid hsl(var(--border))",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {filtered.map((genre, i) => (
                <Link
                  key={genre.genreId}
                  href={`/genre-anime/${genre.genreId}`}
                  prefetch={false}
                  className="genre-card"
                  style={{
                    background: "hsl(var(--card))",
                    padding: "1rem 1rem 1.1rem",
                    textDecoration: "none",
                  }}
                >
                  {/* Index */}
                  <div
                    className="gc-num gp-mono"
                    style={{
                      fontSize: 10,
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: 5,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Name */}
                  <div
                    className="gc-title"
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: "hsl(var(--foreground))",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {genre.title}
                  </div>

                  {/* Arrow */}
                  <svg
                    className="gc-arrow"
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      color: "hsl(var(--primary-foreground))",
                    }}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
