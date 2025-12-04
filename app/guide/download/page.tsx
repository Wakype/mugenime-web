import {
  Download,
  Package,
  FileVideo,
  HardDrive,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "Panduan Download - Mugenime",
  description:
    "Cara mudah mendownload anime per episode atau batch di Mugenime.",
};

export default function DownloadGuidePage() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-10 max-w-5xl">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
              <Download className="w-3.5 h-3.5" />
              Guide
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
              Panduan <span className="text-indigo-600">Download</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Bingung cara donwload anime? Ikuti langkah berikut untuk
              mendownload episode satuan maupun batch.
            </p>
          </div>
        </div>

        {/* --- CONTENT STEPS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STEP 1: PER EPISODE */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm">
                1
              </span>
              Download Per Episode
            </h2>

            <div className="space-y-4">
              <StepCard
                icon={<FileVideo className="w-5 h-5 text-indigo-600" />}
                title="Buka Halaman Nonton"
                desc="Pilih anime dan episode yang ingin kamu tonton. Scroll ke bawah player video."
              />
              <StepCard
                icon={<HardDrive className="w-5 h-5 text-indigo-600" />}
                title="Pilih Format & Resolusi"
                desc="Tersedia format MP4 (Ringan) dan MKV (Kualitas Tinggi). Pilih resolusi 360p, 480p, 720p, atau 1080p."
              />
              <StepCard
                icon={<Download className="w-5 h-5 text-indigo-600" />}
                title="Pilih Server Download"
                desc="Klik tombol server (misal: Google Drive, Zippyshare). Kamu akan diarahkan ke halaman file."
              />
            </div>
          </div>

          {/* STEP 2: BATCH */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm">
                2
              </span>
              Download Batch (Tamat)
            </h2>

            <div className="space-y-4">
              <StepCard
                icon={<Package className="w-5 h-5 text-indigo-600" />}
                title="Cek Status Anime"
                desc="Pastikan anime sudah berstatus 'Completed' atau Tamat. Fitur batch tidak tersedia untuk anime Ongoing."
              />
              <StepCard
                icon={<AlertCircle className="w-5 h-5 text-indigo-600" />}
                title="Buka Menu Batch"
                desc="Di halaman Detail Anime, klik tombol dropdown 'Download Batch' yang ada di bawah daftar episode."
              />
              <StepCard
                icon={<Download className="w-5 h-5 text-indigo-600" />}
                title="Download Batch (Zip/Rar)"
                desc="Pilih kualitas yang diinginkan. File akan berbentuk .zip atau .rar yang berisi semua episode."
              />
            </div>
          </div>
        </div>

        {/* --- TIPS SECTION --- */}
        <Alert className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
          <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <AlertTitle className="text-indigo-800 dark:text-indigo-300 font-bold">
            Tips Penting!
          </AlertTitle>
          <AlertDescription className="text-indigo-700/80 dark:text-indigo-400/80 text-xs md:text-sm mt-1">
            Jika link download mati atau error (404), silakan gunakan server
            alternatif yang tersedia atau laporkan melalui halaman &quot;Lapor
            Link Rusak&quot; di footer. Gunakan aplikasi seperti{" "}
            <b>VLC Player</b> atau <b>MX Player</b> untuk memutar file MKV
            dengan subtitle yang lancar.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

function StepCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="border-l-4 border-l-indigo-500 border-y-zinc-200 border-r-zinc-200 dark:border-y-zinc-800 dark:border-r-zinc-800 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shrink-0">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base font-bold text-zinc-800 dark:text-zinc-200">
              {title}
            </CardTitle>
            <CardDescription className="text-xs mt-1 leading-relaxed">
              {desc}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
