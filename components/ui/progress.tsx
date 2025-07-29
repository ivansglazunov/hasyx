"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "hasyx/lib/utils"

interface Props extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicator?: any;
}

function Progress({
  className,
  value,
  indicator,
  ...props
}: Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        {...indicator}
        className={cn("bg-primary h-full w-full flex-1 transition-all", indicator?.className)}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
