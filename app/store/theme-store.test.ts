import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "../store/theme-store";

const STORAGE_KEY = "wavelength-theme";

// This store is a module-level singleton (by design — see the comment in
// theme-store.ts), so its state and side effects (the DOM class, localStorage)
// all persist across test cases unless explicitly reset here first.
beforeEach(() => {
  useThemeStore.setState({ theme: "dark" });
  document.documentElement.className = "";
  localStorage.clear();
});

describe("useThemeStore", () => {
  it("defaults to dark with no 'light' class applied", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("toggle() switches from dark to light and applies the class", () => {
    useThemeStore.getState().toggle();

    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("toggle() switches back from light to dark and removes the class", () => {
    useThemeStore.getState().toggle(); // dark -> light
    useThemeStore.getState().toggle(); // light -> dark

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("toggle() persists the new value to localStorage", () => {
    useThemeStore.getState().toggle();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("syncFromStorage() picks up a previously-saved 'light' preference", () => {
    localStorage.setItem(STORAGE_KEY, "light");

    useThemeStore.getState().syncFromStorage();

    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("syncFromStorage() leaves the default dark theme alone when nothing is stored", () => {
    useThemeStore.getState().syncFromStorage();

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("syncFromStorage() ignores a garbage/unexpected stored value", () => {
    localStorage.setItem(STORAGE_KEY, "solarized");

    useThemeStore.getState().syncFromStorage();

    expect(useThemeStore.getState().theme).toBe("dark");
  });
});