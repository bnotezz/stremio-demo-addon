export interface StremioStream {
  title: string;
  url: string;
  quality?: string;
  format?: 'hls' | 'mp4' | 'dash';
  headers?: Record<string, string>;
}

export interface StremioMovie {
  id: string; // IMDb ID (e.g., tt1254207) or custom ID
  tmdbId?: string; // TMDB ID for metadata matching
  type: 'movie';
  name: string;
  poster: string;
  background: string;
  logo?: string; // Logo image for Stremio UI
  description: string;
  year: number;
  genres: string[];
  director?: string;
  cast?: string[];
  rating?: string;
  duration?: string;
  streams: StremioStream[];
}

export interface StremioMetaSummary {
  id: string;
  type: string;
  name: string;
  poster: string;
  background?: string;
  logo?: string;
  description?: string;
  genres?: string[];
  year?: number;
}