import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "critical";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "success", ...props }, ref) => {
    const variants: Record<string, string> = {
      success: "bg-green-500/20 text-green-400 border border-green-500/30",
      warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      critical: "bg-red-500/20 text-red-400 border border-red-500/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "px-2 py-0.5 rounded-md text-xs font-semibold",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
