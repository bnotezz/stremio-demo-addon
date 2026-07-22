export interface TmdbCatalogItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genres: string[];
}

export interface TmdbMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{ english_name: string; iso_639_1: string; name: string }>;
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  images: {
    backdrops: Array<{ file_path: string }>;
    logos: Array<{ file_path: string }>;
    posters: Array<{ file_path: string }>;
  };
  credits: {
    cast: Array<{
      id: number;
      name: string;
      original_name: string;
      character: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      original_name: string;
      department: string;
      job: string;
    }>;
  };
  videos: {
    results: Array<{
      iso_639_1: string;
      iso_3166_1: string;
      name: string;
      key: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
      id: string;
      published_at: string;
    }>;
  };
  external_ids: {
    imdb_id: string | null;
    wikidata_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  };
}

export interface BlenderFilm {
  title: string;
  year: string;
  description: string;
  poster: string;
  url: string;
  backdrop: string;
  logo: string;
  subtitle: string;
  youtube: string;
}

export interface MdbListItem {
  id: number;
  title: string;
  year: number;
  released: string;
  description: string;
  tagline: string | null;
  runtime: number;
  budget: number | null;
  revenue: number | null;
  score: number;
  score_average: number;
  ids: {
    imdb: string | null;
    trakt: number | null;
    tmdb: number | null;
    tvdb: number | null;
    mal: number | null;
    mdblist: string | null;
  };
  type: string;
  updated: string;
  ratings: Array<{
    source: string;
    value: number | null;
    score: number | null;
    votes: number | null;
    url: string | null | number;
  }>;
  genres: Array<{ id: number; title: string }>;
  streams: any[];
  watch_providers: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string }>;
  language: string;
  spoken_language: string;
  country: string;
  certification: string;
  commonsense: string | null;
  age_rating: number | null;
  commonsense_media: any;
  awards: string | null;
  status: string;
  trailer: string | null;
  poster: string | null;
  backdrop: string | null;
}

export interface RawStream {
  name?: string;
  type?: string;
  quality?: string;
  url?: string;
  uri?: string;
  ytId?: string;
}

export interface StreamsEntry {
  tmdb_id: number;
  trailer_url?: string;
  streams: RawStream[];
}
