export interface DeezerArtist {
  id: number;
  name: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
  nb_fan?: number;
  nb_album?: number;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover_medium?: string;
  cover_big?: string;
  cover_xl?: string;
  release_date?: string;
  nb_tracks?: number;
  artist?: DeezerArtist;
}

export interface DeezerTrack {
  id: number;
  title: string;
  title_short?: string;
  duration: number; // seconds
  preview: string; // 30s mp3 preview URL
  track_position?: number;
  rank?: number;
  artist: DeezerArtist;
  album: DeezerAlbum;
}

export interface DeezerSearchResponse<T> {
  data: T[];
  total: number;
  next?: string;
}

export interface DeezerAlbumDetail extends DeezerAlbum {
  tracks: {
    data: DeezerTrack[];
  };
}

export type DeezerArtistDetail = DeezerArtist;

export interface DeezerChartResponse {
  tracks: { data: DeezerTrack[] };
  albums: { data: DeezerAlbum[] };
  artists: { data: DeezerArtist[] };
  // Not currently rendered anywhere in the app — typed as unknown[]
  // rather than any[] since we never read its contents.
  playlists: { data: unknown[] };
}

/** A normalized shape our player/queue works with, regardless of source endpoint. */
export interface PlayableTrack {
  id: number;
  title: string;
  artistName: string;
  artistId: number;
  albumTitle: string;
  albumId: number;
  cover: string;
  duration: number;
  preview: string;
}

export function toPlayableTrack(t: DeezerTrack): PlayableTrack {
  return {
    id: t.id,
    title: t.title,
    artistName: t.artist?.name ?? "Unknown artist",
    artistId: t.artist?.id ?? 0,
    albumTitle: t.album?.title ?? "",
    albumId: t.album?.id ?? 0,
    cover:
      t.album?.cover_big ??
      t.album?.cover_medium ??
      "/placeholder-cover.svg",
    duration: t.duration,
    preview: t.preview,
  };
}