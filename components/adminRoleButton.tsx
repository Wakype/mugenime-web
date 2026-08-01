"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/app/admin/actions";
import { useState } from "react";

export function AdminRoleButton({
  userId,
  currentRole,
}: Readonly<{ userId: string; currentRole: string }>) {
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = currentRole === "admin";
  const newRole = isAdmin ? "user" : "admin";

  const handleToggle = async () => {
    setIsLoading(true);
    const res = await updateUserRole(userId, newRole);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(
        isAdmin ? "Role admin berhasil dicabut." : "Berhasil dijadikan admin!",
      );
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant={isAdmin ? "destructive" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className="h-8 text-xs cursor-pointer font-semibold min-w-[120px] gap-1.5"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isAdmin ? (
        <>
          <ShieldOff className="w-3.5 h-3.5" />
          Cabut Admin
        </>
      ) : (
        <>
          <ShieldCheck className="w-3.5 h-3.5" />
          Jadikan Admin
        </>
      )}
    </Button>
  );
}
