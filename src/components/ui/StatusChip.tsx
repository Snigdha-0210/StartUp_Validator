import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "bg-surface-container-high/50 text-on-surface border-surface-container-high",
      success: "bg-primary/20 text-primary border-primary/30",
      warning: "bg-secondary/20 text-secondary border-secondary/30",
      error: "bg-destructive/20 text-destructive border-destructive/30"
    };

    return (
      <span
        ref={ref}
        className={cn(
          "px-2 py-0.5 text-[12px] font-bold rounded-md border w-fit",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
StatusChip.displayName = "StatusChip"
