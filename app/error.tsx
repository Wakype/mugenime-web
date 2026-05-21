"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
      {/* Glow Error biasanya merah (destructive) atau primary */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Icon & Title */}
        <div className="flex flex-col items-center gap-4">
          {/* Menggunakan variable destructive untuk nuansa error */}
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-lg shadow-destructive/10">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground font-heading">
              Terjadi Kesalahan
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maaf, sistem mengalami kendala saat memproses permintaanmu.
              Mungkin server sedang sibuk atau koneksi terputus.
            </p>
          </div>
        </div>

        {/* Error Details */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border text-xs font-mono text-muted-foreground break-all">
          Error: {error.message || "Unknown Error"}
          {error.digest && (
            <div className="mt-1 pt-1 border-t border-border/50 text-muted-foreground/70">
              Digest: {error.digest}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
