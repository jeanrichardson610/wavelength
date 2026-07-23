"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useSearchTracks,
  useSearchAlbums,
  useSearchArtists,
} from "../hooks/use-deezer";
import { toPlayableTrack } from "../types/deezer";
import { TrackRow } from "../components/track-row";
import { MediaCard } from "../components/media-card";
import { Shelf } from "../components/shelf";
import { Skeleton } from "../components/ui/skeleton";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const tracksQuery = useSearchTracks(q);
  const albumsQuery = useSearchAlbums(q);
  const artistsQuery = useSearchArtists(q);

  const playableTracks = (tracksQuery.data?.data ?? []).map(toPlayableTrack);

  if (!q) {
    return (
      <div className="pt-10 text-neutral-400">
        <p>Start typing in the search bar above to look up tracks, albums, and artists.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pt-4">
      <h1 className="font-display text-2xl text-white">
        Results for &ldquo;{q}&rdquo;
      </h1>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-xl text-white">Tracks</h2>
        {tracksQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : playableTracks.length === 0 ? (
          <p className="text-sm text-neutral-500">No tracks found.</p>
        ) : (
          <div className="flex flex-col">
            {playableTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={playableTracks} />
            ))}
          </div>
        )}
      </section>

      <Shelf title="Albums">
        {albumsQuery.isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-40 sm:w-44 shrink-0 space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : albumsQuery.data?.data.length
          ? albumsQuery.data.data.map((a) => (
              <MediaCard
                key={a.id}
                href={`/album/${a.id}`}
                title={a.title}
                subtitle={a.artist?.name}
                image={a.cover_medium ?? "/placeholder-cover.svg"}
              />
            ))
          : <p className="text-sm text-neutral-500">No albums found.</p>}
      </Shelf>

      <Shelf title="Artists">
        {artistsQuery.isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-40 sm:w-44 shrink-0 space-y-3">
                <Skeleton className="aspect-square w-full rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : artistsQuery.data?.data.length
          ? artistsQuery.data.data.map((a) => (
              <MediaCard
                key={a.id}
                href={`/artist/${a.id}`}
                title={a.name}
                subtitle="Artist"
                image={a.picture_medium ?? "/placeholder-cover.svg"}
                round
              />
            ))
          : <p className="text-sm text-neutral-500">No artists found.</p>}
      </Shelf>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-10 text-neutral-500">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}