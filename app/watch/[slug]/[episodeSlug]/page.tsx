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
    const data = await fetchAnime<EpisodeDetail>(
      `anime/episode/${episodeSlug}`,
    );
    return {
      title: `Nonton ${data.title} - Mugenime`,
      description: `Streaming ${data.title} subtitle Indonesia gratis.`,
    };
  } catch {
    return { title: "Episode Not Found" };
  }
}

export default async function WatchPage({ params }: Readonly<Props>) {
  const { episodeSlug, slug } = await params;

  let episodeData: EpisodeDetail | null = null;
  let animeData: AnimeDetail | null = null;
  let batchData: BatchResponse | null = null;

  episodeData = await fetchAnime<EpisodeDetail>(
    `anime/episode/${episodeSlug}`,
  ).catch((error) => {
    console.error("Error fetching episode data:", error);
    return null;
  });

  if (!episodeData) {
    throw new Error(
      "Gagal memuat video episode. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  try {
    animeData = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`).catch(
      () => null,
    );

    if (animeData?.batch?.batchId) {
      batchData = await fetchAnime<BatchResponse>(
        `anime/batch/${animeData.batch.batchId}`,
      ).catch(() => null);
    }
  } catch (err) {
    console.warn(`[Sidebar Info] Gagal fetch detail anime: ${slug}`, err);
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <WatchView
        episode={episodeData}
        animeDetail={animeData}
        batchData={batchData}
        slug={slug}
        episodeSlug={episodeSlug}
      />
    </div>
  );
}
