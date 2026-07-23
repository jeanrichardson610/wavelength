"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { HiOutlineHome, HiHome, HiOutlineSearch } from "react-icons/hi";
import { PiWaveformBold } from "react-icons/pi";
import { BsVinylFill } from "react-icons/bs";

const nav = [
  { href: "/", label: "Home", icon: HiOutlineHome, activeIcon: HiHome },
  { href: "/search", label: "Search", icon: HiOutlineSearch, activeIcon: HiOutlineSearch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-2 p-2">
      <div className="rounded-xl bg-base-900 px-4 py-5">
        <Link href="/" className="flex items-center gap-2 group">
          <PiWaveformBold className="h-7 w-7 text-signal group-hover:scale-110 transition-transform" />
          <span className="font-display text-lg tracking-tight text-white">
            Wavelength
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 rounded-xl bg-base-900 p-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = active ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Icon className="h-6 w-6 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1 rounded-xl bg-base-900 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-neutral-300 text-sm font-medium">
          <BsVinylFill className="h-5 w-5" />
          Your library
        </div>
        <p className="text-xs leading-relaxed text-neutral-500">
          This build is search-first: everything you play comes straight
          from a live catalog lookup, so there&apos;s no saved library yet
          — just search, queue, and go.
        </p>
      </div>
    </aside>
  );
}