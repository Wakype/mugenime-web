import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden bg-white dark:bg-zinc-950">
      {/* 1. BACKGROUND DECORATION */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Glow Effect di tengah */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* 2. CONTENT */}
      <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">
        {/* Angka 404 Besar */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-indigo-500/80 to-transparent select-none opacity-80 dark:opacity-80">
            404
          </h1>

          {/* Ilustrasi Teks di atas angka */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/30">
              Page Not Found
            </span>
          </div>
        </div>

        <div className="space-y-2 -mt-10">
          <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            Ara ara... Kamu Tersesat?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            Sepertinya kamu gagal masuk ke isekai lain 🗿
          </p>
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
          >
            <Link href="/ongoing-anime">
              <Search className="w-4 h-4 mr-2" />
              Cari Anime Lain
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 text-xs text-zinc-400 dark:text-zinc-600 font-mono">
        ERROR_CODE: 404_GAGAL_MASUK_ISEKAI
      </div>
    </div>
  );
}
