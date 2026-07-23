"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiMiniPlay } from "react-icons/hi2";
import { cn } from "../lib/utils";

interface MediaCardProps {
  href: string;
  title: string;
  subtitle?: string;
  image: string;
  round?: boolean;
  onPlay?: () => void;
  priority?: boolean;
}

export function MediaCard({ href, title, subtitle, image, round, onPlay, priority }: MediaCardProps) {
  return (
    <Link href={href} className="group block w-40 shrink-0 sm:w-44">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative rounded-xl bg-base-900 p-3 hover:bg-base-800 transition-colors"
      >
        <div
          className={cn(
            "relative aspect-square w-full overflow-hidden bg-base-700 shadow-md",
            round ? "rounded-full" : "rounded-lg"
          )}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="176px"
            className="object-cover"
            priority={priority}
          />
          {onPlay && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onPlay();
              }}
              className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-signal text-ink opacity-0 shadow-glow translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
              aria-label={`Play ${title}`}
            >
              <HiMiniPlay className="h-5 w-5 translate-x-[1px]" />
            </button>
          )}
        </div>
        <p className="mt-3 truncate text-sm font-medium text-white">{title}</p>
        {subtitle && (
          <p className="mt-1 truncate text-xs text-neutral-400">{subtitle}</p>
        )}
      </motion.div>
    </Link>
  );
}