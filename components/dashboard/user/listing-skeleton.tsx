import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ListingSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border bg-card transition-colors p-0">
      {/* Media Section - matches the 160px height (h-40) */}
      <div className="relative h-40 w-full">
        <Skeleton className="h-full w-full rounded-t-xl" />
        {/* Type badge skeleton */}
        <div className="absolute left-3 top-3">
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
      </div>

      {/* Body Section - matches the p-3 spacing */}
      <div className="space-y-2 p-3">
        {/* Title and Price Row */}
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        
        {/* Description - matches min-h-[2.5rem] for 2 lines */}
        <div className="min-h-[2.5rem] space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* User and Location Row - matches min-h-[2rem] */}
        <div className="flex items-center justify-between pt-1 min-h-[2rem]">
          {/* User info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-16" />
          </div>
          
          {/* Location and Rating */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Location badge */}
            <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 max-w-20">
              <Skeleton className="h-3 w-3 flex-shrink-0" />
              <Skeleton className="h-2 w-8" />
            </div>
            {/* Rating */}
            <div className="inline-flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
