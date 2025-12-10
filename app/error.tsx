"use client"; // Error components must be Client Components

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
    // Log error ke layanan reporting (opsional)
    console.error("Next.js Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Icon & Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 shadow-lg shadow-red-500/10">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-heading">
              Terjadi Kesalahan
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Maaf, sistem mengalami kendala saat memproses permintaanmu.
              Mungkin server sedang sibuk atau koneksi terputus.
            </p>
          </div>
        </div>

        {/* Error Details (Hanya tampilkan pesan error yang aman) */}
        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 break-all">
          Error: {error.message || "Unknown Error"}
          {error.digest && (
            <div className="mt-1 pt-1 border-t border-zinc-200 dark:border-zinc-700 text-zinc-400">
              Digest: {error.digest}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
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
