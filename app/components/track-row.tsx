
"use client";

import Image from "next/image";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";
import { PlayableTrack } from "../types/deezer";
import { usePlayerStore } from "../store/player-store";
import { formatDuration, cn } from "../lib/utils";

interface TrackRowProps {
  track: PlayableTrack;
  index: number;
  queue: PlayableTrack[];
  showCover?: boolean;
}

export function TrackRow({ track, index, queue, showCover = true }: TrackRowProps) {
  const { current, isPlaying, playQueue, toggle } = usePlayerStore();
  const isCurrent = current?.id === track.id;

  function handleClick() {
    if (isCurrent) {
      toggle();
    } else {
      const i = queue.findIndex((t) => t.id === track.id);
      playQueue(queue, i === -1 ? 0 : i);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group grid w-full grid-cols-[2rem,1fr,auto] items-center gap-3 rounded-md py-2 pl-6 pr-3 text-left transition-colors hover:bg-white/5 sm:pl-5 md:pl-3",
        isCurrent && "bg-white/5"
      )}
    >
      <div className="flex items-center justify-center text-sm text-neutral-500">
        <span className="group-hover:hidden tabular-nums">
          {isCurrent && isPlaying ? (
            <span className="flex items-end gap-[2px] h-3">
              <span className="w-[2px] h-2 bg-signal animate-bar-bounce" />
              <span className="w-[2px] h-3 bg-signal animate-bar-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="w-[2px] h-2 bg-signal animate-bar-bounce" style={{ animationDelay: "0.3s" }} />
            </span>
          ) : (
            index + 1
          )}
        </span>
        <span className="hidden group-hover:block text-white">
          {isCurrent && isPlaying ? (
            <HiMiniPause className="h-4 w-4" />
          ) : (
            <HiMiniPlay className="h-4 w-4" />
          )}
        </span>
      </div>

      <div className="flex items-center gap-3 min-w-0">
        {showCover && (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-base-800">
            <Image src={track.cover} alt={track.albumTitle} fill sizes="40px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className={cn("truncate text-sm font-medium", isCurrent ? "text-signal-dim" : "text-white")}>
            {track.title}
          </p>
          <p className="truncate text-xs text-neutral-400">{track.artistName}</p>
        </div>
      </div>

      <span className="shrink-0 pl-6 pr-2 text-xs mono-num text-neutral-500 sm:pl-5 md:pl-3">
        {formatDuration(track.duration)}
      </span>
    </button>
  );
}
