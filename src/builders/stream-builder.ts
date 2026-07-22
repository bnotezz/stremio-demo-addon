import type { Stream } from '@stremio-addon/sdk';
import type { TmdbMovieDetail, BlenderFilm, StreamsEntry, RawStream } from '../types/data-sources.js';
import { matchBlenderFilm } from '../utils/data-loader.js';

export function buildStreams(
  tmdbTitle: string,
  tmdbDetail: TmdbMovieDetail | undefined,
  blenderFilms: BlenderFilm[],
  streamEntry: StreamsEntry | undefined
): Stream[] {
  const streams: Stream[] = [];
  const bf = matchBlenderFilm(tmdbTitle, blenderFilms);
  
  // Track unique ytIds to avoid duplicates
  const seenYtIds = new Set<string>();
  
  // 1. Process explicit streams from blender.movies.streams.json
  if (streamEntry?.streams) {
    for (const raw of streamEntry.streams) {
      const stream: Stream = {
        name: raw.name || "Blender Studio",
        description: raw.quality ? `${raw.quality} ${raw.type || ''}`.trim() : (raw.type || 'Unknown Format')
      };

      // Type specific mapping
      if (raw.type === 'youtube' && raw.ytId) {
        stream.ytId = raw.ytId;
        stream.title = raw.name || tmdbTitle;
        stream.externalUrl = `https://www.youtube.com/watch?v=${raw.ytId}`;
        seenYtIds.add(raw.ytId);
      } else if (raw.type === 'torrent' && raw.url) {
        stream.infoHash = raw.url;
        stream.title = raw.name || tmdbTitle;
        stream.behaviorHints = { notWebReady: true }; // BitTorrent needs specific engines
      } else if (raw.url || raw.uri) {
        stream.url = raw.url || raw.uri;
        stream.title = raw.name || tmdbTitle;
        
        // Formats that are typically web-ready vs not
        if (raw.type === 'mkv' || raw.type === 'avi' || raw.type === 'mov') {
          stream.behaviorHints = { notWebReady: true };
        }
      }
      
      streams.push(stream);
    }
  }

  // 2. Add YouTube stream from blender_films.json
  if (bf?.youtube && !seenYtIds.has(bf.youtube)) {
    streams.push({
      name: "YouTube",
      title: `${bf.title} - Blender Studio`,
      ytId: bf.youtube,
      description: "Official Release",
      externalUrl: `https://www.youtube.com/watch?v=${bf.youtube}`
    });
    seenYtIds.add(bf.youtube);
  }

  // 3. Add trailers from TMDB detail if they haven't been added yet
  if (tmdbDetail?.videos?.results) {
    const tmdbTrailers = tmdbDetail.videos.results.filter(v => v.site === "YouTube");
    for (const t of tmdbTrailers) {
      if (!seenYtIds.has(t.key)) {
        streams.push({
          name: "YouTube",
          title: t.name || `${tmdbTitle} Trailer`,
          ytId: t.key,
          description: t.type, // "Trailer", "Teaser", "Clip"
          externalUrl: `https://www.youtube.com/watch?v=${t.key}`
        });
        seenYtIds.add(t.key);
      }
    }
  }

  return streams;
}
