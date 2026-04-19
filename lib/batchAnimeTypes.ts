// Base response fields shared across endpoints
export interface KS_BaseResponse {
  status: string;
  creator: string;
  source: string;
}

// Genre structure used in both list and detail
export interface KS_Genre {
  name: string;
  slug: string;
}

// ----------------------------------------------------
// Types for Latest Anime Endpoint (Home)
// ----------------------------------------------------

export interface KS_AnimeItem {
  title: string;
  slug: string;
  poster: string;
  genres: KS_Genre[];
  released: string;
}

export interface KS_LatestResponse extends KS_BaseResponse {
  anime_list: KS_AnimeItem[];
}

// ----------------------------------------------------
// Types for Search Endpoint
// ----------------------------------------------------

export interface KS_SearchResponse extends KS_BaseResponse {
  anime_list: KS_AnimeItem[];
}

// ----------------------------------------------------
// Types for Anime Detail Endpoint
// ----------------------------------------------------

export interface KS_AnimeInfo {
  japanese: string;
  producers: string;
  type: string;
  status: string;
  total_episode: string;
  score: string;
  duration: string;
  released: string;
}

export interface KS_DownloadLink {
  host: string;
  url: string;
}

export interface KS_DownloadResolution {
  resolution: string;
  links: KS_DownloadLink[];
}

export interface KS_AnimeDetail {
  title: string;
  poster: string;
  info: KS_AnimeInfo;
  genres: KS_Genre[]; 
  synopsis: string;
  download_links: KS_DownloadResolution[];
}

export interface KS_DetailResponse extends KS_BaseResponse {
  detail: KS_AnimeDetail;
}