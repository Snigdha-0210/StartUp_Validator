import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  subtle?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, subtle = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          subtle ? "glass-panel-subtle" : "glass-panel",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"
