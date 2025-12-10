export interface Anime {
  title: string;
  animeId: string;
  poster: string;
  // current_episode?: string;
  releaseDay?: string;
  latestReleaseDate?: string;
  otakudesu_url?: string;
  episodes?: string;
  score?: string;
  lastReleaseDate?: string;
  genres?: Genre[];
  synopsis?: string;
  season?: string;
  studios?: string;
}

export interface Genre {
  title: string;
  genreId: string;
  href?: string;
  otakudesUrl?: string;
}

export interface HomeData {
  ongoing: {
    animeList: Anime[];
    href?: string;
    otakudesuUrl?: string;
  };
  completed: {
    animeList: Anime[];
    href?: string;
    otakudesuUrl?: string;
  };
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
  title: string;
  url: string;
}

export interface DownloadQuality {
  title: string; // ex: "Mp4_360p"
  size: string;
  urls: DownloadLink[];
}

export interface DownloadFormat {
  resolution: string;
  urls: DownloadLink[];
}

export interface DownloadData {
  qualities?: DownloadQuality[];
  formats?: DownloadFormatGroup[];
}

export interface DownloadFormatGroup {
  title: string;
  qualities: DownloadQuality[];
}

export interface ServerItem {
  title: string;
  serverId: string;
  href: string;
}

export interface ServerQuality {
  title: string; // ex: "360p"
  serverList: ServerItem[];
}

export interface ServerData {
  qualities: ServerQuality[];
}

export interface EpisodeInfo {
  credit: string;
  encoder: string;
  duration: string;
  type: string;
  genreList: Genre[];
  episodeList: EpisodeList[];
}

export interface EpisodeDetail {
  title: string;
  animeId: string;
  releaseTime: string;
  defaultStreamingUrl: string;
  hasPrevEpisode: boolean;
  prevEpisode: {
    title: string;
    episodeId: string;
    href: string;
    otakudesuUrl: string;
  } | null;
  hasNextEpisode: boolean;
  nextEpisode: {
    title: string;
    episodeId: string;
    href: string;
    otakudesuUrl: string;
  } | null;
  server: ServerData;
  downloadUrl: DownloadData;
  info: EpisodeInfo; // Properti baru dari API
}

export interface EpisodeList {
  title: string;
  date: string;
  eps: number;
  episodeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface Batch {
  title: string;
  batchId: string;
  otakudesu_url: string;
  uploaded_at: string;
  href: string;
  otakudesuUrl: string;
}

export interface AnimeDetail {
  title: string;
  slug: string;
  japanese: string;
  score: string;
  poster: string;
  producers: string;
  type: string;
  status: string;
  episodes: string;
  duration: string;
  aired: string;
  studios: string;
  studio?: string;
  genreList: Genre[];
  synopsis:
    | {
        paragraphs: string[];
        connections: AnimeConnection[];
      }
    | string;
  batch: Batch | null;
  episodeList: EpisodeList[];
  recommendations: Anime[];
}

export interface AnimeConnection {
  title: string;
  animeId: string;
  href: string;
  otakudesuUrl: string;
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
  title: string;
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
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number; // Menggantikan last_visible_page
}

export interface OngoingResponse {
  pagination: PaginationData;
  animeList: Anime[];
}

export interface CompleteAnimeResponse {
  pagination: PaginationData;
  animeList: Anime[];
}

export interface GenreListResponse {
  genreList: Genre[];
}

export interface GenreDetailResponse {
  animeList: Anime[];
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

export interface BatchLink {
  title: string;
  url: string;
}

export interface BatchQuality {
  title: string;
  size: string;
  urls: BatchLink[];
}

export interface BatchFormat {
  title: string;
  qualities: BatchQuality[];
}

export interface BatchResponse {
  title: string;
  animeId: string;
  poster: string;
  downloadUrl: {
    formats: BatchFormat[];
  };
}

export interface SearchResult {
  title: string;
  slug: string;
  poster: string;
  genres: Genre[];
  status: string;
  rating: string;
  url: string;
}

export interface SearchResponse {
  data: SearchResult[];
}
