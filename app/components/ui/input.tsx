import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-full border border-base-600 bg-base-800/80 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-signal",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };