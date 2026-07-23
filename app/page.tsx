"use client";

import { useChart } from "./hooks/use-deezer";
import { Shelf } from "./components/shelf";
import { MediaCard } from "./components/media-card";
import { Skeleton } from "./components/ui/skeleton";
import { usePlayerStore } from "./store/player-store";
import { toPlayableTrack } from "./types/deezer";
import { TrackRow } from "./components/track-row";

function ShelfSkeleton() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-40 sm:w-44 shrink-0 space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, isError } = useChart();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const topTracks = data?.tracks?.data ?? [];
  const playableTracks = topTracks.map(toPlayableTrack);

  return (
    <div className="flex flex-col gap-10 pt-4">
      <section>
        <h1 className="font-display text-3xl text-white">Good listening</h1>
        <p className="mt-1 text-neutral-400">
          Global charts, pulled live — nothing here comes from a database.
        </p>
      </section>

      {isError && (
        <p className="text-sm text-red-400">
          Couldn&apos;t reach the catalog right now. Try again in a moment.
        </p>
      )}

      <Shelf title="Top tracks right now">
        {isLoading
          ? <ShelfSkeleton />
          : data?.tracks.data.slice(0, 12).map((t, i) => (
              <MediaCard
                key={t.id}
                href={`/album/${t.album.id}`}
                title={t.title}
                subtitle={t.artist.name}
                image={t.album.cover_medium ?? "/placeholder-cover.svg"}
                priority={i === 0}
                onPlay={() => {
                  const idx = playableTracks.findIndex((pt) => pt.id === t.id);
                  playQueue(playableTracks, idx === -1 ? 0 : idx);
                }}
              />
            ))}
      </Shelf>

      <Shelf title="Popular albums">
        {isLoading
          ? <ShelfSkeleton />
          : data?.albums.data.slice(0, 12).map((a) => (
              <MediaCard
                key={a.id}
                href={`/album/${a.id}`}
                title={a.title}
                subtitle={a.artist?.name}
                image={a.cover_medium ?? "/placeholder-cover.svg"}
              />
            ))}
      </Shelf>

      <Shelf title="Artists on the rise">
        {isLoading
          ? <ShelfSkeleton />
          : data?.artists.data.slice(0, 12).map((a) => (
              <MediaCard
                key={a.id}
                href={`/artist/${a.id}`}
                title={a.name}
                subtitle="Artist"
                image={a.picture_medium ?? "/placeholder-cover.svg"}
                round
              />
            ))}
      </Shelf>

      <section className="flex flex-col gap-2 pb-4">
        <h2 className="font-display text-xl text-white">Chart, in order</h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {playableTracks.slice(0, 10).map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={playableTracks} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}