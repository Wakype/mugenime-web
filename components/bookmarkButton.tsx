"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore, BookmarkItem } from "@/lib/store";

interface BookmarkButtonProps {
  data?: BookmarkItem;
  className?: string;
}

export default function BookmarkButton({
  data,
  className,
}: Readonly<BookmarkButtonProps>) {
  const [mounted, setMounted] = useState(false);
  const { bookmarks, addBookmark, removeBookmark } = useStore();

  useEffect(() => {
    useStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !data) {
    return (
      <Button
        disabled
        variant="outline"
        size="lg"
        className={cn("w-full rounded-xl gap-2", className)}
      >
        <Bookmark className="w-5 h-5" />
        Bookmark
      </Button>
    );
  }

  const isBookmarked = bookmarks.some((b) => b.slug === data.slug);

  const handleToggle = () => {
    if (isBookmarked) {
      removeBookmark(data.slug);
      toast.info("Dihapus dari Bookmark", {
        description: `${data.title} telah dihapus dari daftar simpan.`,
      });
    } else {
      addBookmark(data);
      toast.success("Ditambahkan ke Bookmark", {
        description: `${data.title} berhasil disimpan.`,
      });
    }
  };

  return (
    <Button
      onClick={handleToggle}
      size="lg"
      variant={isBookmarked ? "default" : "outline"}
      className={cn(
        "w-full rounded-xl transition-all duration-300 gap-2 shadow-sm cursor-pointer",
        isBookmarked && "shadow-lg shadow-primary/20",
        !isBookmarked && "hover:bg-secondary",
        className,
      )}
    >
      <Bookmark
        className={cn(
          "w-5 h-5 transition-transform duration-300",
          isBookmarked ? "fill-current scale-110" : "fill-transparent",
        )}
      />
      <span className="font-semibold">
        {isBookmarked ? "Tersimpan" : "Bookmark"}
      </span>
    </Button>
  );
}
