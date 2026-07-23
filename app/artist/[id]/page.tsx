"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { HiMiniPlay } from "react-icons/hi2";
import { useArtist, useArtistTopTracks, useArtistAlbums } from "../../hooks/use-deezer";
import { toPlayableTrack } from "../../types/deezer";
import { TrackRow } from "../../components/track-row";
import { MediaCard } from "../../components/media-card";
import { Shelf } from "../../components/shelf";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { usePlayerStore } from "../../store/player-store";

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { data: artist, isLoading, isError } = useArtist(id);
  const topTracksQuery = useArtistTopTracks(id);
  const albumsQuery = useArtistAlbums(id);
  const playQueue = usePlayerStore((s) => s.playQueue);

  if (isLoading) {
    return (
      <div className="pt-6 space-y-6">
        <div className="flex items-end gap-6">
          <Skeleton className="h-56 w-56 rounded-full" />
          <Skeleton className="h-10 w-72" />
        </div>
      </div>
    );
  }

  if (isError || !artist) {
    return (
      <p className="pt-10 text-sm text-red-400">
        Couldn&apos;t load this artist. It may not exist, or the catalog lookup failed.
      </p>
    );
  }

  const topTracks = topTracksQuery.data?.data ?? [];
  const playableTracks = topTracks.map(toPlayableTrack);

  return (
    <div className="flex flex-col gap-8 pt-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full bg-base-800 shadow-xl sm:h-56 sm:w-56">
          <Image
            src={artist.picture_xl ?? artist.picture_big ?? "/placeholder-cover.svg"}
            alt={artist.name}
            fill
            sizes="224px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Artist
          </p>
          <h1 className="mt-2 truncate font-display text-3xl font-bold text-white sm:text-5xl">
            {artist.name}
          </h1>
          {typeof artist.nb_fan === "number" && (
            <p className="mt-3 text-sm text-neutral-400">
              {artist.nb_fan.toLocaleString("en-US")} fans
            </p>
          )}
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-fit"
        onClick={() => playQueue(playableTracks, 0)}
        disabled={playableTracks.length === 0}
      >
        <HiMiniPlay className="h-5 w-5" />
        Play top tracks
      </Button>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-xl text-white">Popular</h2>
        {topTracksQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {playableTracks.slice(0, 5).map((track, i) => (
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
          : albumsQuery.data?.data.map((a) => (
              <MediaCard
                key={a.id}
                href={`/album/${a.id}`}
                title={a.title}
                subtitle={a.release_date?.slice(0, 4)}
                image={a.cover_medium ?? "/placeholder-cover.svg"}
              />
            ))}
      </Shelf>
    </div>
  );
}