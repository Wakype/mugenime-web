import { Moon } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 overflow-hidden">
      {/* 1. BACKGROUND DECORATION (Konsisten dengan page lain) */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 2. LOADING CONTENT */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated Icon Wrapper */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Ring Luar Berputar */}
          <div className="absolute inset-0 border-4 border-indigo-100 dark:border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />

          {/* Logo Tengah (M) */}
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 group-hover:text-indigo-700 transition-colors">
            <Moon className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight animate-pulse">
            Memuat Mugenime...
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Nonton anime gratis tanpa iklan, sabar yaa...
          </p>
        </div>
      </div>
    </div>
  );
}
