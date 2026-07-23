import {
  DeezerAlbumDetail,
  DeezerArtistDetail,
  DeezerChartResponse,
  DeezerSearchResponse,
  DeezerTrack,
  DeezerAlbum,
  DeezerArtist,
} from "../types/deezer";

async function proxied<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const search = new URLSearchParams({ path, ...toStringRecord(params) });
  const res = await fetch(`/api/deezer?${search.toString()}`);
  if (!res.ok) {
    throw new Error(`Deezer request failed: ${res.status}`);
  }
  return res.json();
}

function toStringRecord(params: Record<string, string | number>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) out[k] = String(v);
  return out;
}

export const deezer = {
  chart: (limit = 20) =>
    proxied<DeezerChartResponse>("/chart", { limit }),

  searchTracks: (q: string, limit = 25) =>
    proxied<DeezerSearchResponse<DeezerTrack>>("/search", { q, limit }),

  searchAlbums: (q: string, limit = 12) =>
    proxied<DeezerSearchResponse<DeezerAlbum>>("/search/album", { q, limit }),

  searchArtists: (q: string, limit = 12) =>
    proxied<DeezerSearchResponse<DeezerArtist>>("/search/artist", { q, limit }),

  album: (id: number | string) =>
    proxied<DeezerAlbumDetail>(`/album/${id}`),

  artist: (id: number | string) =>
    proxied<DeezerArtistDetail>(`/artist/${id}`),

  artistTopTracks: (id: number | string, limit = 10) =>
    proxied<DeezerSearchResponse<DeezerTrack>>(`/artist/${id}/top`, { limit }),

  artistAlbums: (id: number | string, limit = 20) =>
    proxied<DeezerSearchResponse<DeezerAlbum>>(`/artist/${id}/albums`, { limit }),
};