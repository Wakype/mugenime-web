import { fetchKomik } from "@/lib/api";
import { KomikHomeResponse } from "@/lib/komikTypes";
import { Megaphone, MessageCircle } from "lucide-react";
import { FadeInWrapper } from "@/components/homeSection";
import ApiStatusUpdater from "@/components/apiStatusUpdater";
import KomikHero from "@/components/komikHero";
import PopularSlider from "@/components/popularKomikSlider";
import CommentSection from "@/components/commentSection";
import NewestKomikSection from "@/components/newestKomikSection";
import AnnouncementSlider from "@/components/announcementSlider";

export const revalidate = 1800;

export default async function KomikHomePage() {
  const response = await fetchKomik<KomikHomeResponse>("home").catch((err) => {
    console.error("Failed to fetch komik home:", err);
    return null;
  });

  const data = response?.data;

  if (!data) {
    throw new Error(
      "Gagal memuat beranda komik. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  const heroComics = data.hero ?? [];
  const popularList = data.popular ?? [];
  const newestList = data.newest ?? [];

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/30">
      <ApiStatusUpdater isDown={false} />

      {/* --- HERO SECTION --- */}
      {heroComics.length > 0 && <KomikHero heroes={heroComics} />}

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-12">
        {/* --- ANNOUNCEMENT SECTION --- */}
        <div className="space-y-4 container mx-auto mt-14 lg:mt-7">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Pengumuman</span>
          </div>

          <AnnouncementSlider />
        </div>

        <div className="container mx-auto relative z-20 space-y-12 mt-8 md:mt-12">
          {/* --- POPULAR SECTION --- */}
          {popularList.length > 0 && (
            <section>
              <PopularSlider comics={popularList} />
            </section>
          )}

          {/* --- NEWEST SECTION --- */}
          {newestList.length > 0 && (
            <section>
              <NewestKomikSection newestList={newestList} />
            </section>
          )}

          {/* --- COMMENT SECTION --- */}
          <section className="space-y-6 pt-10">
            <FadeInWrapper>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <MessageCircle className="w-5 h-5" />
                  <span>Komunitas</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  General Chat
                </h2>
              </div>

              <CommentSection identifier="general" page_url="/komik" />
            </FadeInWrapper>
          </section>
        </div>
      </div>
    </div>
  );
}
