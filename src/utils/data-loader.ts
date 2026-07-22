import fs from 'fs';
import path from 'path';
import type { BlenderFilm } from '../types/data-sources.js';

/**
 * Type-safe JSON loader
 */
export function loadJsonFile<T>(filePath: string): T {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(content) as T;
}

/**
 * Build TMDB image URL
 */
export function buildTmdbImageUrl(imagePath: string | null | undefined, size: string = 'original'): string | undefined {
  if (!imagePath) return undefined;
  return `https://image.tmdb.org/t/p/${size}${imagePath}`;
}

/**
 * Creates a URL-friendly slug
 */
export function slugify(title: string, tmdbId: number): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${sanitized}-${tmdbId}`;
}

/**
 * Formats runtime in minutes to a string "X min"
 */
export function formatRuntime(minutes: number | null): string | undefined {
  if (minutes === null || minutes === undefined) return undefined;
  return `${minutes} min`;
}

/**
 * Converts date string "YYYY-MM-DD" to ISO 8601 "YYYY-MM-DDT00:00:00.000Z"
 */
export function toIsoDate(dateStr: string | null): string | undefined {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Fuzzy matches a TMDB title to a BlenderFilm title.
 * Handles cases like "Agent 327" vs "Agent 327: Operation Barbershop",
 * "Cosmos Laundromat: First Cycle" vs "Cosmos Laundromat".
 */
export function matchBlenderFilm(tmdbTitle: string, blenderFilms: BlenderFilm[]): BlenderFilm | undefined {
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normTmdb = normalize(tmdbTitle);
  
  // Exact match after normalization
  let match = blenderFilms.find(f => normalize(f.title) === normTmdb);
  if (match) return match;
  
  // Contains match (either direction)
  match = blenderFilms.find(f => {
    const normBf = normalize(f.title);
    return normTmdb.includes(normBf) || normBf.includes(normTmdb);
  });
  
  return match;
}
