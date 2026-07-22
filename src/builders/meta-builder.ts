import type { MetaDetail, MetaLink, MetaVideo, Stream } from '@stremio-addon/sdk';
import type { TmdbCatalogItem, TmdbMovieDetail, BlenderFilm, MdbListItem } from '../types/data-sources.js';
import { buildTmdbImageUrl, slugify, formatRuntime, toIsoDate, matchBlenderFilm } from '../utils/data-loader.js';

export function buildMetaDetail(
  tmdbItem: TmdbCatalogItem,
  tmdbDetail: TmdbMovieDetail | undefined,
  mdblistItem: MdbListItem | undefined,
  blenderFilms: BlenderFilm[]
): MetaDetail {
  const bf = matchBlenderFilm(tmdbItem.title, blenderFilms);
  const tmdbId = tmdbItem.id;
  
  // Basic properties
  const id = `tmdb-${tmdbId}`;
  const type = "movie";
  const name = tmdbItem.title || bf?.title || "";
  const description = tmdbDetail?.overview || bf?.description || bf?.subtitle || tmdbItem.overview || "";
  
  // Images
  const poster = buildTmdbImageUrl(tmdbItem.poster_path) || bf?.poster;
  const background = buildTmdbImageUrl(tmdbItem.backdrop_path) || bf?.backdrop;
  const logo = bf?.logo || buildTmdbImageUrl(tmdbDetail?.images?.logos?.[0]?.file_path);
  
  // Metadata
  const genres = tmdbDetail?.genres?.map(g => g.name) || mdblistItem?.genres?.map(g => g.title) || tmdbItem.genres || [];
  
  const releaseYear = tmdbItem.release_date ? tmdbItem.release_date.substring(0, 4) : (bf?.year || "");
  const releaseInfo = releaseYear;
  const released = mdblistItem?.released ? toIsoDate(mdblistItem.released) : toIsoDate(tmdbItem.release_date);
  
  const runtime = formatRuntime(tmdbDetail?.runtime || mdblistItem?.runtime || null);
  
  // Credits
  const cast = tmdbDetail?.credits?.cast?.slice(0, 10).map(c => c.name);
  const director = tmdbDetail?.credits?.crew?.filter(c => c.job === "Director").map(c => c.name);
  
  // Ratings
  const imdbRatingObj = mdblistItem?.ratings?.find(r => r.source === "imdb");
  const imdbRating = imdbRatingObj?.value?.toString() || (tmdbItem.vote_average ? tmdbItem.vote_average.toFixed(1) : undefined);
  
  // Details
  const country = tmdbDetail?.production_countries?.[0]?.name || mdblistItem?.country;
  const language = tmdbDetail?.spoken_languages?.[0]?.english_name;
  const website = tmdbDetail?.homepage || bf?.url;
  const awards = mdblistItem?.awards || undefined;
  
  // Trailers (deprecated in cinemeta, but we still populate them for compatibility)
  const trailers: Array<{source: string, type: "Trailer" | "Clip"}> = [];
  const trailerStreams: Stream[] = [];
  
  if (tmdbDetail?.videos?.results && tmdbDetail.videos.results.some(v => v.type === "Trailer" && v.site === "YouTube")) {
    const tmdbTrailers = tmdbDetail.videos.results.filter(v => v.type === "Trailer" && v.site === "YouTube");
    for (const t of tmdbTrailers) {
      trailers.push({ source: t.key, type: "Trailer" });
      trailerStreams.push({ ytId: t.key, title: t.name || name });
    }
  } else if (bf?.youtube) {
    trailers.push({ source: bf.youtube, type: "Trailer" });
    trailerStreams.push({ ytId: bf.youtube, title: `${name} Trailer` });
  } else if (mdblistItem?.trailer) {
    try {
      const url = new URL(mdblistItem.trailer);
      const v = url.searchParams.get("v");
      if (v) {
        trailers.push({ source: v, type: "Trailer" });
        trailerStreams.push({ ytId: v, title: `${name} Trailer` });
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  }

  // Links
  const links: MetaLink[] = [];
  
  // IMDb
  const imdbId = mdblistItem?.ids?.imdb || tmdbDetail?.external_ids?.imdb_id;
  if (imdbId && imdbRating) {
    links.push({
      name: imdbRating,
      category: "imdb",
      url: `https://imdb.com/title/${imdbId}`
    });
  }
  
  // Share link
  const slug = slugify(name, tmdbId);
  links.push({
    name: name,
    category: "share",
    url: `https://www.strem.io/s/movie/${slug}`
  });
  
  // Genres
  for (const genre of genres) {
    links.push({
      name: genre,
      category: "Genres",
      url: `stremio:///discover/https%3A%2F%2Fv3-cinemeta.strem.io%2Fmanifest.json/movie/top?genre=${encodeURIComponent(genre)}`
    });
  }
  
  // Cast
  if (cast) {
    for (const actor of cast) {
      links.push({
        name: actor,
        category: "Cast",
        url: `stremio:///search?search=${encodeURIComponent(actor)}`
      });
    }
  }
  
  // Writers
  const writers = tmdbDetail?.credits?.crew?.filter(c => c.job === "Screenplay" || c.job === "Author" || c.department === "Writing");
  if (writers) {
    const uniqueWriters = [...new Set(writers.map(w => w.name))];
    for (const writer of uniqueWriters) {
      links.push({
        name: writer,
        category: "Writers",
        url: `stremio:///search?search=${encodeURIComponent(writer)}`
      });
    }
  }
  
  // Directors
  if (director) {
    for (const d of director) {
      links.push({
        name: d,
        category: "Directors",
        url: `stremio:///search?search=${encodeURIComponent(d)}`
      });
    }
  }
  
  // Website
  if (website) {
    links.push({
      name: "Website",
      category: "Website",
      url: website
    });
  }
  
  const meta: MetaDetail = {
    id,
    type,
    name,
    description,
    poster,
    background,
    logo,
    genres,
    releaseInfo,
    released,
    runtime,
    director,
    cast,
    imdbRating,
    country,
    language,
    awards,
    website,
    trailers,
    links,
    // Add trailer streams to meta (modern approach)
    // Actually the SDK types for MetaDetail might not explicitly include trailerStreams (it's not in the MD docs)
    // but the cinemeta sample has it, so we can cast or add it dynamically if not typed
    ...({ trailerStreams } as any),
    behaviorHints: {
      defaultVideoId: id,
      hasScheduledVideos: false
    }
  };

  // Clean up undefined properties
  return Object.fromEntries(Object.entries(meta).filter(([_, v]) => v !== undefined)) as MetaDetail;
}
