"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReadChapter } from "@/lib/komikTypes";

interface ReaderNavProps {
  slug: string;
  chapterIndex: number;
  prevChapterId: number | null;
  nextChapterId: number | null;
  chapterList: ReadChapter[];
}

export default function ReaderNav({
  slug,
  chapterIndex,
  prevChapterId,
  nextChapterId,
  chapterList,
}: Readonly<ReaderNavProps>) {
  const router = useRouter();

  // Find actual chapter index based on API IDs
  const prevChapter = chapterList.find((c) => c.id === prevChapterId);
  const nextChapter = chapterList.find((c) => c.id === nextChapterId);

  const prevHref = prevChapter
    ? `/komik/${slug}/chapter-${prevChapter.chapterIndex}`
    : null;
  const nextHref = nextChapter
    ? `/komik/${slug}/chapter-${nextChapter.chapterIndex}`
    : null;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChapterIndex = e.target.value;
    if (selectedChapterIndex) {
      router.push(`/komik/${slug}/chapter-${selectedChapterIndex}`);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-card border border-border rounded-xl shadow-sm">
      {/* Prev Button */}
      {prevHref ? (
        <Button
          asChild
          variant="outline"
          size="icon"
          className="shrink-0 rounded-lg"
        >
          <Link href={prevHref} prefetch={false} title="Chapter Sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-lg opacity-50"
          disabled
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}

      {/* Select Dropdown */}
      <div className="flex-1 max-w-[250px]">
        <select
          className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          value={chapterIndex}
          onChange={handleSelectChange}
        >
          {/* Mapping reversed so newest chapter appears at the top if needed, 
              assuming chapterList from API is ascending or descending */}
          {chapterList.map((ch) => (
            <option key={ch.id} value={ch.chapterIndex}>
              Chapter {ch.chapterIndex}
            </option>
          ))}
        </select>
      </div>

      {/* Next Button */}
      {nextHref ? (
        <Button
          asChild
          variant="outline"
          size="icon"
          className="shrink-0 rounded-lg"
        >
          <Link href={nextHref} prefetch={false} title="Chapter Selanjutnya">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-lg opacity-50"
          disabled
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
