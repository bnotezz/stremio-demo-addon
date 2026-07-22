import fs from 'fs';
import path from 'path';
import type { MetaPreview } from '@stremio-addon/sdk';

import { loadJsonFile } from './utils/data-loader.js';
import { buildMetaDetail } from './builders/meta-builder.js';
import { buildStreams } from './builders/stream-builder.js';
import { buildManifest } from './builders/manifest-builder.js';

import type {
  TmdbCatalogItem,
  TmdbMovieDetail,
  BlenderFilm,
  MdbListItem,
  StreamsEntry
} from './types/data-sources.js';

const DIST_DIR = path.resolve(process.cwd(), 'dist/stremio');
const CATALOG_DIR = path.join(DIST_DIR, 'catalog/movie');
const META_DIR = path.join(DIST_DIR, 'meta/movie');
const STREAM_DIR = path.join(DIST_DIR, 'stream/movie');

function ensureDirs() {
  [DIST_DIR, CATALOG_DIR, META_DIR, STREAM_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function writeJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function main() {
  console.log('🚀 Starting Stremio static addon generation...');
  ensureDirs();

  // 1. Load Data
  const tmdbCatalog = loadJsonFile<TmdbCatalogItem[]>('data/blender.movies.tmdb.json');
  const blenderFilms = loadJsonFile<BlenderFilm[]>('data/blender_films.json');
  const mdblist = loadJsonFile<MdbListItem[]>('data/blender.movies.mdblist.json');
  const streamsData = loadJsonFile<StreamsEntry[]>('data/blender.movies.streams.json');
  const baseManifest = loadJsonFile<any>('stremio-manifest.json');

  // Lookup maps
  const mdblistMap = new Map(mdblist.map(item => [item.ids.tmdb, item]));
  const streamsMap = new Map(streamsData.map(item => [item.tmdb_id, item]));

  const metasPreview: MetaPreview[] = [];
  const uniqueGenres = new Set<string>();

  // 2. Process each movie
  for (const item of tmdbCatalog) {
    console.log(`Processing: ${item.title} (TMDB: ${item.id})`);
    
    let detail: TmdbMovieDetail | undefined;
    try {
      detail = loadJsonFile<TmdbMovieDetail>(`data/tmdb/${item.id}.json`);
    } catch (e) {
      console.warn(`⚠️ Warning: Missing detail file for TMDB ID ${item.id}`);
    }

    const mdblistItem = mdblistMap.get(item.id);
    const streamEntry = streamsMap.get(item.id);

    // Build rich meta
    const metaDetail = buildMetaDetail(item, detail, mdblistItem, blenderFilms);
    metaDetail.genres?.forEach(g => uniqueGenres.add(g));

    // Save meta
    writeJson(path.join(META_DIR, `tmdb-${item.id}.json`), { meta: metaDetail });
    
    // Also save aliases for IMDB ID if available (for better compatibility)
    if (metaDetail.imdbRating) { // We used imdbRating condition for links earlier, let's use the actual imdbId
       const imdbId = mdblistItem?.ids?.imdb || detail?.external_ids?.imdb_id;
       if (imdbId) {
         writeJson(path.join(META_DIR, `${imdbId}.json`), { meta: metaDetail });
       }
    }

    // Prepare catalog preview
    metasPreview.push({
      id: metaDetail.id,
      type: metaDetail.type,
      name: metaDetail.name,
      poster: metaDetail.poster,
      posterShape: metaDetail.posterShape,
      background: metaDetail.background,
      logo: metaDetail.logo,
      description: metaDetail.description,
      trailers: metaDetail.trailers,
      // Cinemeta extra fields
      imdbRating: metaDetail.imdbRating,
      year: metaDetail.releaseInfo,
      moviedb_id: item.id,
      runtime: metaDetail.runtime,
      genres: metaDetail.genres,
      imdb_id: mdblistItem?.ids?.imdb || detail?.external_ids?.imdb_id
    } as any);

    // Build and save streams
    const streams = buildStreams(item.title, detail, blenderFilms, streamEntry);
    writeJson(path.join(STREAM_DIR, `tmdb-${item.id}.json`), { streams });
    
    // Alias streams by IMDB ID
    const imdbId = mdblistItem?.ids?.imdb || detail?.external_ids?.imdb_id;
    if (imdbId) {
      writeJson(path.join(STREAM_DIR, `${imdbId}.json`), { streams });
    }
  }

  // 3. Generate Catalog
  // Sort movies by release year descending, then by title
  metasPreview.sort((a, b) => {
    // We don't have release year in preview, so we just sort by ID to be deterministic, 
    // or we could extract it from full meta. Let's just use name for now.
    return a.name.localeCompare(b.name);
  });
  
  writeJson(path.join(CATALOG_DIR, 'blender_studio_catalog.json'), { metas: metasPreview });

  // 4. Generate Manifest
  const manifest = buildManifest(baseManifest, Array.from(uniqueGenres));
  writeJson(path.join(DIST_DIR, 'manifest.json'), manifest);

  console.log('✅ Generation complete!');
  console.log(`- Created ${metasPreview.length} movie entries`);
  console.log(`- Detected ${uniqueGenres.size} unique genres`);
  console.log(`- Output located in ${DIST_DIR}`);
}

main();
