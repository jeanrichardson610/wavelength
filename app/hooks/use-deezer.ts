import { useQuery } from "@tanstack/react-query";
import { deezer } from "../lib/deezer";

export function useChart() {
  return useQuery({
    queryKey: ["chart"],
    queryFn: () => deezer.chart(20),
  });
}

export function useSearchTracks(query: string) {
  return useQuery({
    queryKey: ["search", "tracks", query],
    queryFn: () => deezer.searchTracks(query),
    enabled: query.trim().length > 0,
  });
}

export function useSearchAlbums(query: string) {
  return useQuery({
    queryKey: ["search", "albums", query],
    queryFn: () => deezer.searchAlbums(query),
    enabled: query.trim().length > 0,
  });
}

export function useSearchArtists(query: string) {
  return useQuery({
    queryKey: ["search", "artists", query],
    queryFn: () => deezer.searchArtists(query),
    enabled: query.trim().length > 0,
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: ["album", id],
    queryFn: () => deezer.album(id),
    enabled: !!id,
  });
}

export function useArtist(id: string) {
  return useQuery({
    queryKey: ["artist", id],
    queryFn: () => deezer.artist(id),
    enabled: !!id,
  });
}

export function useArtistTopTracks(id: string) {
  return useQuery({
    queryKey: ["artist", id, "top"],
    queryFn: () => deezer.artistTopTracks(id, 10),
    enabled: !!id,
  });
}

export function useArtistAlbums(id: string) {
  return useQuery({
    queryKey: ["artist", id, "albums"],
    queryFn: () => deezer.artistAlbums(id, 20),
    enabled: !!id,
  });
}