"use client";

import { Howl } from "howler";
import { create } from "zustand";
import { PlayableTrack } from "../types/deezer";

interface PlayerState {
  queue: PlayableTrack[];
  queueIndex: number;
  current: PlayableTrack | null;
  isPlaying: boolean;
  progress: number; // seconds
  volume: number; // 0..1
  isLoading: boolean;

  playQueue: (tracks: PlayableTrack[], startIndex?: number) => void;
  playNow: (track: PlayableTrack) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  tick: (seconds: number) => void;
}

let howl: Howl | null = null;
let rafId: number | null = null;

function stopTicking() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function loadAndPlay(
  track: PlayableTrack,
  get: () => PlayerState,
  set: (partial: Partial<PlayerState>) => void
) {
  if (howl) {
    howl.unload();
    howl = null;
  }
  stopTicking();

  set({ current: track, progress: 0, isLoading: true });

  howl = new Howl({
    src: [track.preview],
    html5: true,
    volume: get().volume,
    onplay: () => {
      set({ isPlaying: true, isLoading: false });
      const step = () => {
        if (howl) {
          set({ progress: howl.seek() as number });
        }
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    },
    onpause: () => set({ isPlaying: false }),
    onend: () => {
      stopTicking();
      get().next();
    },
    onloaderror: () => set({ isLoading: false, isPlaying: false }),
    onplayerror: () => set({ isLoading: false, isPlaying: false }),
  });

  howl.play();
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  queueIndex: -1,
  current: null,
  isPlaying: false,
  progress: 0,
  volume: 0.5,
  isLoading: false,

  playQueue: (tracks, startIndex = 0) => {
    if (tracks.length === 0) return;
    set({ queue: tracks, queueIndex: startIndex });
    loadAndPlay(tracks[startIndex], get, set);
  },

  playNow: (track) => {
    set({ queue: [track], queueIndex: 0 });
    loadAndPlay(track, get, set);
  },

  toggle: () => {
    if (!howl) return;
    if (howl.playing()) {
      howl.pause();
    } else {
      howl.play();
    }
  },

  next: () => {
    const { queue, queueIndex } = get();
    if (queue.length === 0) return;
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      // end of queue: stop cleanly rather than looping silently
      set({ isPlaying: false, progress: 0 });
      return;
    }
    set({ queueIndex: nextIndex });
    loadAndPlay(queue[nextIndex], get, set);
  },

  previous: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;
    // restart current track if more than 3s in, otherwise go back
    if (progress > 3 || queueIndex === 0) {
      if (howl) howl.seek(0);
      return;
    }
    const prevIndex = queueIndex - 1;
    set({ queueIndex: prevIndex });
    loadAndPlay(queue[prevIndex], get, set);
  },

  seek: (seconds) => {
    if (!howl) return;
    howl.seek(seconds);
    set({ progress: seconds });
  },

  setVolume: (v) => {
    set({ volume: v });
    if (howl) howl.volume(v);
  },

  tick: (seconds) => set({ progress: seconds }),
}));