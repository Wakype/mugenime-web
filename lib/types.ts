export interface Anime {
  title: string;
  slug: string;
  poster: string;
  current_episode?: string;
  release_day?: string;
  newest_release_date?: string;
  otakudesu_url?: string;
  episode_count?: string;
  rating?: string;
  last_release_date?: string;
  genres?: Genre[];
  synopsis?: string;
  season?: string;
  studio?: string;
}

export interface Genre {
  name: string;
  slug: string;
  url?: string;
  otakudesu_url?: string;
}

export interface HomeData {
  ongoing_anime: Anime[];
  complete_anime: Anime[];
}

export interface StreamServer {
  name: string;
  id: string;
}

export interface QualityGroup {
  quality: string;
  servers: StreamServer[];
}

export interface DownloadLink {
  provider: string;
  url: string;
}

export interface DownloadFormat {
  resolution: string;
  urls: DownloadLink[];
}

export interface DownloadData {
  mp4?: DownloadFormat[];
  mkv?: DownloadFormat[];
}

export interface EpisodeDetail {
  episode: string;
  anime: {
    slug: string;
    otakudesu_url: string;
  };
  has_next_episode: boolean;
  next_episode: {
    slug: string;
    otakudesu_url: string;
  } | null;
  has_previous_episode: boolean;
  previous_episode: {
    slug: string;
    otakudesu_url: string;
  } | null;
  stream_url: string;
  stream_servers: QualityGroup[];
  download_urls: DownloadData;
}

export interface EpisodeList {
  episode: string;
  episode_number: number;
  slug: string;
  otakudesu_url: string;
}

export interface Batch {
  slug: string;
  otakudesu_url: string;
  uploaded_at: string;
}

export interface AnimeDetail {
  title: string;
  slug: string;
  japanese_title: string;
  poster: string;
  rating: string;
  produser: string;
  type: string;
  status: string;
  episode_count: string;
  duration: string;
  release_date: string;
  studio: string;
  genres: Genre[];
  synopsis: string;
  batch: Batch | null;
  episode_lists: EpisodeList[];
  recommendations: Anime[];
}

export interface BatchResponse {
  title: string;
  animeId: string;
  poster: string;
  status: string;
  downloadUrl: {
    formats: {
      title: string;
      qualities: {
        title: string;
        size: string;
        urls: {
          title: string;
          url: string;
        }[];
      }[];
    }[];
  };
}

export interface ScheduleAnime {
  anime_name: string;
  url: string;
  slug: string;
  poster: string;
}

export interface ScheduleDay {
  day: string;
  anime_list: ScheduleAnime[];
}

export interface ScheduleResponse {
  data: ScheduleDay[];
}

export interface PaginationData {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number | null;
  has_previous_page: boolean;
  previous_page: number | null;
}

export interface OngoingResponse {
  paginationData: PaginationData;
  ongoingAnimeData: Anime[];
}

export interface CompleteAnimeResponse {
  paginationData: PaginationData; // Kita reuse interface PaginationData yang sudah ada
  completeAnimeData: Anime[];
}

export type GenreListResponse = Genre[];

export interface GenreDetailResponse {
  anime: Anime[];
  pagination: PaginationData; // Perhatikan: API ini menggunakan key "pagination"
}

export interface AnimeListItem {
  title: string;
  animeId: string;
  href: string;
  otakudesuUrl: string;
}

export interface AnimeListGroup {
  startWith: string;
  animeList: AnimeListItem[];
}

export interface AnimeListResponse {
  list: AnimeListGroup[];
}