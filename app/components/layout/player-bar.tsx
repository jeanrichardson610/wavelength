"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiMiniPlay,
  HiMiniPause,
  HiMiniBackward as HiBackward,
  HiMiniForward as HiForward,
  HiMiniSpeakerWave,
  HiMiniSpeakerXMark,
} from "react-icons/hi2";
import { usePlayerStore } from "../../store/player-store";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { formatDuration, cn } from "../../lib/utils";

function Equalizer({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-4 w-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full bg-signal",
            active ? "animate-bar-bounce" : "h-1"
          )}
          style={active ? { animationDelay: `${i * 0.15}s` } : undefined}
        />
      ))}
    </div>
  );
}

export function PlayerBar() {
  const {
    current,
    isPlaying,
    isLoading,
    progress,
    volume,
    toggle,
    next,
    previous,
    seek,
    setVolume,
  } = usePlayerStore();

  const duration = current ? Math.min(current.duration, 30) : 30;

  return (
    <div className="h-[90px] shrink-0 border-t border-base-700 bg-base-950 px-4">
      <div className="grid h-full grid-cols-3 items-center">
        {/* Now playing */}
        <div className="flex items-center gap-3 min-w-0">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 min-w-0"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-base-800">
                  <Image
                    src={current.cover}
                    alt={current.albumTitle}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 hidden sm:block">
                  <Link
                    href={`/album/${current.albumId}`}
                    className="block truncate text-sm font-medium text-white hover:underline"
                  >
                    {current.title}
                  </Link>
                  <Link
                    href={`/artist/${current.artistId}`}
                    className="block truncate text-xs text-neutral-400 hover:underline hover:text-white"
                  >
                    {current.artistName}
                  </Link>
                </div>
              </motion.div>
            ) : (
              <span className="text-sm text-neutral-500 hidden sm:block">
                Nothing playing yet — search for a track
              </span>
            )}
          </AnimatePresence>
        </div>

        {/* Transport */}
        <div className="flex flex-col items-center gap-1.5 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="icon"
              size="icon"
              onClick={previous}
              disabled={!current}
              suppressHydrationWarning
              aria-label="Previous track"
            >
              <HiBackward className="h-5 w-5" />
            </Button>
            <Button
              variant="primary"
              size="icon"
              onClick={toggle}
              disabled={!current || isLoading}
              suppressHydrationWarning
              aria-label={isPlaying ? "Pause" : "Play"}
              className="h-9 w-9"
            >
              {isLoading ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              ) : isPlaying ? (
                <HiMiniPause className="h-5 w-5" />
              ) : (
                <HiMiniPlay className="h-5 w-5 translate-x-[1px]" />
              )}
            </Button>
            <Button
              variant="icon"
              size="icon"
              onClick={next}
              disabled={!current}
              suppressHydrationWarning
              aria-label="Next track"
            >
              <HiForward className="h-5 w-5" />
            </Button>
            <Equalizer active={isPlaying} />
          </div>

          <div className="flex w-full items-center gap-2 text-[11px] mono-num text-neutral-500">
            <span className="w-9 text-right">{formatDuration(progress)}</span>
            <Slider
              value={[Math.min(progress, duration)]}
              max={duration || 30}
              step={0.1}
              onValueChange={([v]) => seek(v)}
              disabled={!current}
            />
            <span className="w-9">{formatDuration(duration)}</span>
          </div>
          {current && (
            <span className="text-[10px] uppercase tracking-wider text-neutral-600 hidden sm:block">
              30-second preview
            </span>
          )}
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center justify-end gap-2 ">
          <Button
            variant="icon"
            size="icon"
            onClick={() => setVolume(volume > 0 ? 0 : 0.6)}
            aria-label={volume > 0 ? "Mute" : "Unmute"}
          >
            {volume > 0 ? (
              <HiMiniSpeakerWave className="h-5 w-5" />
            ) : (
              <HiMiniSpeakerXMark className="h-5 w-5" />
            )}
          </Button>
          <Slider
            className="w-24"
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={([v]) => setVolume(v)}
          />
        </div>
      </div>
    </div>
  );
}