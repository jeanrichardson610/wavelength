"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight, HiOutlineSearch } from "react-icons/hi";
import { PiWaveformBold } from "react-icons/pi";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ThemeToggle } from "../../components/layout/theme-toggle";

export function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 bg-base-950/80 backdrop-blur px-6 py-3">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="icon"
          size="icon"
          className="bg-base-900 md:hidden"
        >
          <Link href="/" aria-label="Go to home">
            <PiWaveformBold className="h-5 w-5 text-signal" />
          </Link>
        </Button>
        <Button
          variant="icon"
          size="icon"
          className="bg-base-900"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <HiChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="icon"
          size="icon"
          className="hidden bg-base-900 md:inline-flex"
          onClick={() => router.forward()}
          aria-label="Go forward"
        >
          <HiChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 max-w-md">
        <div className="relative">
          <HiOutlineSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to hear?"
            className="pl-10"
          />
        </div>
      </form>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}