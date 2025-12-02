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
}

export interface Genre {
  name: string;
  slug: string;
  url?: string;
}

export interface HomeData {
  ongoing_anime: Anime[];
  complete_anime: Anime[];
}

export interface EpisodeData {
  episode: string;
  slug: string;
  otakudesu_url: string;
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
  stream_servers: {
    quality: string;
    servers: {
      name: string;
      id: string;
    }[];
  }[];
  download_urls: {
    [format: string]: {
      // mp4, mkv
      resolution: string;
      urls: {
        provider: string;
        url: string;
      }[];
    }[];
  };
}
