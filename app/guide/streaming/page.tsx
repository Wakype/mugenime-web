import {
  MonitorPlay,
  WifiOff,
  Settings,
  RefreshCcw,
  Play,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Panduan Streaming - Mugenime",
  description: "Cara menonton anime dan mengatasi masalah video error.",
};

export default function StreamingGuidePage() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-10 max-w-5xl">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
              <MonitorPlay className="w-3.5 h-3.5" />
              Guide
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
              Panduan{" "}
              <span className="text-indigo-600">
                Streaming
              </span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Video tidak bisa diputar? Buffering terus? Jangan panik. Pelajari
              cara menggunakan player di Mugenime dengan maksimal.
            </p>
          </div>
        </div>

        {/* --- TROUBLESHOOTING GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuideCard
            icon={<Layers className="w-6 h-6" />}
            title="Pilih Server Terbaik"
            content="Mugenime menyediakan banyak server (VidHide, StreamWish, dll). Jika Server 1 lemot atau mati, langsung klik tab server lain di bawah player."
          />
          <GuideCard
            icon={<Settings className="w-6 h-6" />}
            title="Resolusi Video"
            content="Koneksi lambat? Pilih tab resolusi yang lebih rendah (360p atau 480p) untuk menghemat kuota dan mengurangi buffering."
          />
          <GuideCard
            icon={<RefreshCcw className="w-6 h-6" />}
            title="Refresh Halaman"
            content="Terkadang player mengalami 'timeout'. Coba refresh halaman browser kamu atau bersihkan cache jika video stuck."
          />
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Masalah Umum (FAQ)
          </h2>

          <div className="grid gap-4">
            <FAQItem
              q="Video muncul tulisan 'Sandbox' atau 'Forbidden'?"
              a="Ini biasanya terjadi karena proteksi dari pihak ketiga. Solusinya: Klik tombol 'Buka Tab Baru' di atas player untuk membuka video langsung di sumber aslinya."
            />
            <FAQItem
              q="Apakah streaming di sini boros kuota?"
              a="Tergantung resolusi yang kamu pilih. Untuk hemat kuota, gunakan resolusi 360p atau 480p. Resolusi 720p dan 1080p memakan data lebih besar namun gambarnya jernih."
            />
            <FAQItem
              q="Kenapa subtitlenya tidak muncul?"
              a="Semua video di Mugenime sudah Hardsub (subtitle menempel di video). Jika tidak muncul, kemungkinan itu kesalahan server. Silakan lapor ke admin."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-indigo-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {content}
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950">
      <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-start gap-2">
        <span className="text-indigo-600">Q:</span> {q}
      </h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 ml-6">{a}</p>
    </div>
  );
}
