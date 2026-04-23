"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteComment } from "@/app/admin/actions";
import { useState } from "react";

export function AdminDeleteButton({
  commentId,
}: Readonly<{ commentId: string }>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await adminDeleteComment(commentId);

    if (res.error) {
      toast.error("Gagal menghapus komentar.");
    } else {
      toast.success("Komentar berhasil dihapus!");
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isLoading}
      className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
