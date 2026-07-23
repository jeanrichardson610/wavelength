"use client";

import { useEffect } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useThemeStore } from "../../store/theme-store";
import { Button } from "../../components/ui/button";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const syncFromStorage = useThemeStore((s) => s.syncFromStorage);

  // Runs once after hydration completes — safe to touch localStorage here.
  // The blocking script in app/layout.tsx already applied the right CSS
  // class before first paint, so there's no visual flash; this just
  // brings React's own state in step with it for the icon.
  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  return (
    <Button
      variant="icon"
      size="icon"
      className="bg-base-900"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <HiOutlineSun className="h-5 w-5" />
      ) : (
        <HiOutlineMoon className="h-5 w-5" />
      )}
    </Button>
  );
}