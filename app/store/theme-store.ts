"use client";

import { create } from "zustand";

type Theme = "dark" | "light";

const STORAGE_KEY = "wavelength-theme";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  /** Called once on mount by ThemeToggle to pick up a stored preference.
   *  Deliberately NOT read at store-creation time — this module is
   *  imported by a client component that Next also renders on the
   *  server, where localStorage doesn't exist. Keeping the initial
   *  state a fixed "dark" on both server and client avoids a hydration
   *  mismatch; syncing happens after mount instead. */
  syncFromStorage: () => void;
}

function applyClass(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",

  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
    applyClass(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage can throw in private-browsing/blocked-storage
      // contexts — theme switching still works for the session either way.
    }
  },

  syncFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        set({ theme: stored });
        applyClass(stored);
      }
    } catch {
      // ignore — fall back to the default "dark" state
    }
  },
}));