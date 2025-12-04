import { Hammer } from "lucide-react";

export default function CommentSection() {
  return (
    <div className="relative w-full max-h-full min-h-[500px] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm group">
      {/* Blur Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-20 animate-pulse group-hover:opacity-30 transition-opacity"></div>
      </div>

      {/* Content Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center mb-6 ring-1 ring-zinc-100 dark:ring-zinc-700">
          <Hammer className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Fitur Komentar Segera Hadir!
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
          Fitur komentar lagi dibikin. Harap tunggu ya!
        </p>

        <div className="mt-6">
          <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-800 dark:text-indigo-300 ring-1 ring-inset ring-indigo-600/20">
            Under Construction
          </span>
        </div>
      </div>
    </div>
  );
}
