import WatchView from "@/components/watchView";
import { fetchAnime } from "@/lib/api";
import { AnimeDetail, EpisodeDetail, BatchResponse } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type Props = {
  params: Promise<{ episodeSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { episodeSlug } = await params;
  try {
    const data = await fetchAnime<EpisodeDetail>(`anime/episode/${episodeSlug}`);
    return {
      title: `Nonton ${data.title} - Mugenime`,
      description: `Streaming ${data.title} subtitle Indonesia gratis.`,
    };
  } catch {
    return { title: "Episode Not Found" };
  }
}

export default async function WatchPage({ params }: Props) {
  const { episodeSlug, slug } = await params;

  let episodeData: EpisodeDetail | null = null;
  let animeData: AnimeDetail | null = null;
  let batchData: BatchResponse | null = null; // Tambahkan variabel batch

  try {
    // 1. Fetch Data Episode
    episodeData = await fetchAnime<EpisodeDetail>(`anime/episode/${episodeSlug}`);

    try {
      // 2. Fetch Data Anime Detail
      animeData = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);

      // 3. Fetch Batch (Jika ada batchId di animeDetail)
      // Logika dipindah ke Server Side agar lebih stabil
      if (animeData?.batch?.batchId) {
        try {
          batchData = await fetchAnime<BatchResponse>(
            `anime/batch/${animeData.batch.batchId}`
          );
        } catch (batchErr) {
          console.warn("[WatchPage] Gagal fetch batch:", batchErr);
        }
      }

    } catch (err) {
      console.warn(`[Sidebar Info] Gagal fetch detail anime: ${slug}`, err);
    }
  } catch (error) {
    console.error("Error fetching episode data:", error);
    return notFound();
  }

  if (!episodeData) {
    return notFound();
  }

  return (
    <div className="min-h-screen pb-20 pt-8 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <WatchView
          episode={episodeData}
          animeDetail={animeData}
          batchData={batchData} // Lempar data batch ke Client Component
          slug={slug}
          episodeSlug={episodeSlug}
        />
      </div>
    </div>
  );
}