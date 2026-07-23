"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiMiniPlay } from "react-icons/hi2";
import { useAlbum } from "../../hooks/use-deezer";
import { toPlayableTrack } from "../../types/deezer";
import { TrackRow } from "../../components/track-row";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { usePlayerStore } from "../../store/player-store";
import { formatDuration } from "../../lib/utils";

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { data: album, isLoading, isError } = useAlbum(id);
  const playQueue = usePlayerStore((s) => s.playQueue);

  if (isLoading) {
    return (
      <div className="pt-6 space-y-6">
        <div className="flex items-end gap-6">
          <Skeleton className="h-56 w-56 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !album) {
    return (
      <p className="pt-10 text-sm text-red-400">
        Couldn&apos;t load this album. It may not exist, or the catalog lookup failed.
      </p>
    );
  }

  const tracks = album.tracks?.data ?? [];
  const playableTracks = tracks.map(toPlayableTrack);
  const totalSeconds = tracks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg bg-base-800 shadow-xl sm:h-56 sm:w-56">
          <Image
            src={album.cover_big ?? album.cover_medium ?? "/placeholder-cover.svg"}
            alt={album.title}
            fill
            sizes="224px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Album
          </p>
          <h1 className="mt-2 truncate font-display text-3xl font-bold text-white sm:text-4xl">
            {album.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-neutral-400">
            {album.artist && (
              <Link href={`/artist/${album.artist.id}`} className="font-medium text-white hover:underline">
                {album.artist.name}
              </Link>
            )}
            <span>·</span>
            <span>{tracks.length} tracks</span>
            <span>·</span>
            <span>{formatDuration(totalSeconds)}</span>
          </div>
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
        Play
      </Button>

      <div className="flex flex-col">
        {playableTracks.map((track, i) => (
          <TrackRow
            key={track.id}
            track={track}
            index={i}
            queue={playableTracks}
            showCover={false}
          />
        ))}
      </div>
    </div>
  );
}