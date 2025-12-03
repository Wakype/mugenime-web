import { fetchAnime } from "@/lib/api";
import { ScheduleDay } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Info } from "lucide-react";
import ScheduleCard from "@/components/scheduleCard";

export const revalidate = 3600;

export default async function JadwalPage() {
  const scheduleData = await fetchAnime<ScheduleDay[]>("anime/schedule");

  const daysMap: { [key: number]: string } = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    0: "Minggu",
  };
  const todayIndex = new Date().getDay();
  const currentDayName = daysMap[todayIndex];

  const defaultTab = scheduleData.find((d) => d.day === currentDayName)
    ? currentDayName
    : "Senin";

  return (
    <div className="min-h-screen pb-20 py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SECTION (PREMIUM) --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* 1. BACKGROUND DECORATION */}
          {/* Grid Pattern Halus */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

          {/* Gradient Blobs (Kiri & Kanan) */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* --- KIRI: KONTEN UTAMA --- */}
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                {/* Label Kecil */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                  <Calendar className="w-3.5 h-3.5" />
                  Weekly Update
                </div>

                {/* Judul dengan Gradient Text */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                  <span className="text-indigo-600">Jadwal Rilis</span> Anime
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                  Pantau jadwal tayang anime terbaru yang diperbarui secara
                  otomatis setiap minggu. Arahkan kursor ke poster untuk melihat
                  detail genre dan durasi.
                </p>
              </div>

              {/* Modern Alert Box */}
              <div className="flex gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 backdrop-blur-sm">
                <div className="shrink-0">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Catatan
                  </p>
                  <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
                    Terkadang anime yang statusnya sudah{" "}
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      Completed (Tamat)
                    </span>{" "}
                    masih muncul di daftar jadwal{" "}
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      Ongoing (Sedang Tayang)
                    </span>{" "}
                    ini karena bug pada sistem. Harap maklum! 🙏
                  </p>
                </div>
              </div>
            </div>

            {/* --- KANAN: WIDGET HARI (Calendar Style) --- */}
            <div className="shrink-0 w-full lg:w-auto">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden lg:min-w-[200px]">
                {/* Dekorasi Background Halus */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/10" />

                {/* Label Atas */}
                <div className="relative z-10 flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  <Calendar className="w-3 h-3" />
                  HARI INI
                </div>

                {/* Nama Hari Besar */}
                <div className="relative z-10">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-indigo-600">
                    {currentDayName}
                  </span>
                </div>

                {/* Tanggal Lengkap (Formatted) */}
                <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <Tabs defaultValue={defaultTab} className="w-full space-y-8">
          {/* TABS NAVIGATION (Scrollable on mobile) */}
          <div className="sticky top-16 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:backdrop-blur-none">
            <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 no-scrollbar">
              {scheduleData.map((item, idx) => (
                <TabsTrigger
                  key={idx}
                  value={item.day}
                  className="px-6 py-2.5 min-w-[100px] text-sm font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
                >
                  {item.day}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {scheduleData.map((dayData, idx) => (
            <TabsContent
              key={idx}
              value={dayData.day}
              className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 bg-indigo-600 rounded-full" />
                  <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                    Anime Hari {dayData.day}
                  </h2>
                  <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    {dayData.anime_list.length} Anime
                  </span>
                </div>

                {dayData.anime_list.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                    {dayData.anime_list.map((anime) => (
                      <ScheduleCard key={anime.slug} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <p>Tidak ada jadwal untuk hari ini.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
