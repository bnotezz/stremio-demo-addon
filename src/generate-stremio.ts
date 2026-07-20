import * as fs from 'fs';
import * as path from 'path';
import { OPEN_MOVIES } from './data/movies';

const STREMIO_DIR = path.join(__dirname, '../dist/stremio');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath: string, data: any) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateStremioAddon() {
  console.log('🚀 Generating Static Stremio Addon files...');

  // 1. Копіюємо та адаптуємо manifest.json
  const rawManifest = fs.readFileSync(
    path.join(__dirname, '../stremio-manifest.json'),
    'utf-8'
  );
  const manifest = JSON.parse(rawManifest);
  writeJson(path.join(STREMIO_DIR, 'manifest.json'), manifest);

  // 2. Генерація каталогу: catalog/movie/blender_studio_catalog.json
  const catalogMetas = OPEN_MOVIES.map((m) => ({
    id: m.id,
    type: m.type,
    name: m.name,
    poster: m.poster,
    background: m.background,
    logo: m.logo,
    description: m.description,
    genres: m.genres,
    releaseInfo: m.year ? m.year.toString() : undefined,
    imdbRating: m.rating,
  }));

  writeJson(
    path.join(STREMIO_DIR, 'catalog/movie/blender_studio_catalog.json'),
    { metas: catalogMetas }
  );

  // 3. Генерація Meta та Stream ендпоінтів для кожного відео
  OPEN_MOVIES.forEach((movie) => {
    // meta/movie/{id}.json
    const metaPayload = {
      meta: {
        id: movie.id,
        tmdbId: movie.tmdbId, // TMDB ID mapping for compatibility
        type: movie.type,
        name: movie.name,
        poster: movie.poster,
        background: movie.background,
        logo: movie.logo,
        description: movie.description,
        genres: movie.genres,
        releaseInfo: movie.year ? movie.year.toString() : undefined,
        director: movie.director ? [movie.director] : [],
        cast: movie.cast || [],
        imdbRating: movie.rating,
        runtime: movie.duration,
      },
    };
    writeJson(
      path.join(STREMIO_DIR, `meta/movie/${movie.id}.json`),
      metaPayload
    );

    // stream/movie/{id}.json
    const streamPayload = {
      streams: movie.streams.map((s) => ({
        name: `Blender Studio\n[${s.quality || 'HD'}]`,
        title: s.title,
        url: s.url,
        ytId: s.ytId,
        infoHash: s.infoHash,
        behaviorHints: {
          notResponseLocation: true,
          proxyHeaders: {
            request: {
              'User-Agent': 'Stremio-Static-Addon/1.0',
            },
          },
        },
      })),
    };
    writeJson(
      path.join(STREMIO_DIR, `stream/movie/${movie.id}.json`),
      streamPayload
    );
  });

  console.log('✅ Static Stremio Addon successfully generated in dist/stremio!');
}

generateStremioAddon();