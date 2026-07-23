import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

type Variant = "primary" | "ghost" | "outline" | "icon";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-signal text-ink hover:bg-signal-bright active:scale-[0.98] font-semibold",
  ghost: "bg-transparent text-neutral-300 hover:text-white hover:bg-white/5",
  outline:
    "bg-transparent border border-base-600 text-neutral-200 hover:border-neutral-400",
  icon: "bg-transparent text-neutral-300 hover:text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-full",
  md: "h-10 px-5 text-sm rounded-full",
  lg: "h-12 px-8 text-base rounded-full",
  icon: "h-9 w-9 rounded-full flex items-center justify-center",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };