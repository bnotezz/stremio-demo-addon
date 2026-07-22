import type { Manifest } from '@stremio-addon/sdk';

export function buildManifest(
  baseManifest: any,
  uniqueGenres: string[]
): Manifest {
  // Deep clone to avoid mutating base
  const manifest = JSON.parse(JSON.stringify(baseManifest)) as Manifest;

  // Add behavior hints
  manifest.behaviorHints = {
    configurable: false,
    configurationRequired: false
  };

  // Enhance catalog with genre filtering
  if (manifest.catalogs && manifest.catalogs.length > 0) {
    manifest.catalogs[0].extra = [
      {
        name: "genre",
        isRequired: false,
        options: uniqueGenres.sort()
      },
      {
        name: "skip",
        isRequired: false
      }
    ];
  }

  // Ensure resources use proper objects with idPrefixes if applicable
  // Our primary prefix is tmdb- but we can also match tt for IMDB
  const prefixes = manifest.idPrefixes || ["tmdb-", "tt"];
  
  // Clean up global idPrefixes as we define them per resource
  delete manifest.idPrefixes;

  manifest.resources = [
    "catalog",
    { 
      name: "meta", 
      types: ["movie"], 
      idPrefixes: prefixes 
    },
    { 
      name: "stream", 
      types: ["movie"], 
      idPrefixes: prefixes 
    }
  ] as any; // Cast as any because the type definition might not fully support this array structure

  return manifest;
}
