"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  pageUrlTemplate?: string; // String template e.g. "/explore-komik?sort=latest&page={page}"
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  pageUrlTemplate,
  onPageChange,
  className,
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  const hasPrev = hasPrevPage ?? currentPage > 1;
  const hasNext = hasNextPage ?? currentPage < totalPages;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const getPageUrl = (page: number): string => {
    if (!pageUrlTemplate) return "#";
    return pageUrlTemplate
      .replace(/\{page\}/g, page.toString())
      .replace(/%7Bpage%7D/gi, page.toString());
  };

  // Generate page numbers array with ellipses
  const generatePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  };

  const pages = generatePages();

  const renderPageItem = (page: number | string, idx: number) => {
    if (page === "...") {
      return (
        <span
          key={`ellipsis-${idx}`}
          className="px-2 text-muted-foreground/60 text-xs font-semibold select-none shrink-0"
        >
          ...
        </span>
      );
    }

    const pageNum = page as number;
    const isCurrent = pageNum === currentPage;

    if (isCurrent) {
      return (
        <Button
          key={pageNum}
          variant="default"
          size="sm"
          className="h-9 min-w-9 px-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 pointer-events-none shrink-0"
        >
          {pageNum}
        </Button>
      );
    }

    if (pageUrlTemplate) {
      return (
        <Button
          key={pageNum}
          variant="ghost"
          size="sm"
          asChild
          className="h-9 min-w-9 px-3 rounded-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition-colors"
        >
          <Link href={getPageUrl(pageNum)} prefetch={false}>
            {pageNum}
          </Link>
        </Button>
      );
    }

    return (
      <Button
        key={pageNum}
        variant="ghost"
        size="sm"
        onClick={() => onPageChange?.(pageNum)}
        className="h-9 min-w-9 px-3 rounded-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition-colors"
      >
        {pageNum}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 sm:gap-3 w-full py-4",
        className,
      )}
    >
      {/* Tombol Sebelumnya */}
      <Button
        variant="outline"
        size="default"
        disabled={!hasPrev}
        asChild={hasPrev && !!pageUrlTemplate}
        onClick={() => {
          if (hasPrev && onPageChange && !pageUrlTemplate) {
            onPageChange(prevPage);
          }
        }}
        className="h-10 px-3.5 sm:px-4 rounded-xl border-border/70 hover:bg-muted font-semibold text-xs sm:text-sm text-foreground transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {hasPrev && pageUrlTemplate ? (
          <Link
            href={getPageUrl(prevPage)}
            prefetch={false}
            className="inline-flex items-center justify-center gap-1.5"
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>Sebelumnya</span>
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5">
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>Sebelumnya</span>
          </span>
        )}
      </Button>

      {/* Container Angka Halaman */}
      <div className="flex items-center gap-1 bg-card/80 backdrop-blur-md p-1 rounded-2xl border border-border/70 shadow-xs max-w-full overflow-x-auto no-scrollbar">
        {pages.map((page, idx) => renderPageItem(page, idx))}
      </div>

      {/* Tombol Selanjutnya */}
      <Button
        variant="outline"
        size="default"
        disabled={!hasNext}
        asChild={hasNext && !!pageUrlTemplate}
        onClick={() => {
          if (hasNext && onPageChange && !pageUrlTemplate) {
            onPageChange(nextPage);
          }
        }}
        className="h-10 px-3.5 sm:px-4 rounded-xl border-border/70 hover:bg-muted font-semibold text-xs sm:text-sm text-foreground transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {hasNext && pageUrlTemplate ? (
          <Link
            href={getPageUrl(nextPage)}
            prefetch={false}
            className="inline-flex items-center justify-center gap-1.5"
            aria-label="Halaman Selanjutnya"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5">
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </span>
        )}
      </Button>
    </div>
  );
}
