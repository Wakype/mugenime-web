export interface BaseResponse<T> {
  status: string;
  data: T;
}

export interface Chapter {
  chapterIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenreData {
  name: string;
  description: string;
}

export interface Genre {
  id: number;
  data: GenreData;
  createdAt: string;
  updatedAt: string;
}

export interface HeroKomik {
  title: string;
  nativeTitle: string;
  author: string;
  slug: string;
  format: string;
  backgroundImage: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

export interface KomikItem {
  title: string;
  slug: string;
  cover: string;
  backgroundImage: string;
  rating: string;
  type: string;
  isHot: boolean;
  isRecommended: boolean;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  author: string;
  format: string;
  nativeTitle: string;
  releaseDate: string;
  genres: Genre[];
}

export interface KomikHomeData {
  hero: HeroKomik[];
  popular: KomikItem[];
  newest: KomikItem[];
}

export interface ReadChapter {
  id: number;
  chapterIndex: number;
  slug: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendedKomik {
  cover: string;
  title: string;
  nativeTitle: string;
  slug: string;
  author: string;
  rating: string;
  status: string;
  format: string;
  type: string;
  isHot: boolean;
  totalChapters: string;
}

export interface KomikDetail {
  title: string;
  slug: string;
  cover: string;
  backgroundImage: string;
  rating: string;
  type: string;
  isHot: boolean;
  isRecommended: boolean;
  isAnimeAdapted: boolean;
  author: string;
  format: string;
  nativeTitle: string;
  releaseDate: string;
  synopsis: string;
  totalChapters: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
  readChapter: ReadChapter[];
  recommended: RecommendedKomik[];
}

export interface ReadChapterData {
  id: number;
  chapterIndex: number;
  komikTitle: string;
  komikSlug: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  prevChapterId: number | null;
  nextChapterId: number | null;
  chapterList: ReadChapter[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface LatestKomikData {
  data: KomikItem[];
  meta: PaginationMeta;
}

export interface AdvanceSearchKomikData {
  page: number;
  hasNextPage: boolean;
  meta: PaginationMeta;
  data: KomikItem[];
}

export interface PopularKomikInnerData {
  slug: string;
  type: string;
  isHot: boolean;
  title: string;
  author: string;
  format: string;
  rating: number;
  status: string;
  genreIds: number[];
  coverImage: string;
  animeStatus: string | null;
  nativeTitle: string;
  totalChapters: string;
  animeAdaptation: boolean;
  backgroundImage: string;
  genres: Genre[];
}

export interface PopularKomikItem {
  id: number;
  data: PopularKomikInnerData;
  createdAt: string;
  updatedAt: string;
  weightedScore: number | null;
  priorityScore: number | null;
}

export interface PopularKomikPaginatedData {
  data: PopularKomikItem[];
  meta: PaginationMeta & { take?: number };
}

export type KomikHomeResponse = BaseResponse<KomikHomeData>;
export type KomikDetailResponse = BaseResponse<KomikDetail>;
export type ReadKomikChapterResponse = BaseResponse<ReadChapterData>;
export type LatestKomikResponse = BaseResponse<LatestKomikData>;
export type AdvanceSearchKomikResponse = BaseResponse<AdvanceSearchKomikData>;
export type PopularKomikResponse = BaseResponse<PopularKomikPaginatedData>;
export type GenresResponse = BaseResponse<Genre[]>;
