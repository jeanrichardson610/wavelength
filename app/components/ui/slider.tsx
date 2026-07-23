"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  trackClassName?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, trackClassName, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-1 w-full grow overflow-hidden rounded-full bg-base-600",
        trackClassName
      )}
    >
      <SliderPrimitive.Range className="absolute h-full bg-neutral-300 group-hover:bg-signal transition-colors" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
      aria-label="Seek"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider };