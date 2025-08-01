import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ListingSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-[4/3] w-full" />
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-6" />
            </div>
          </div>

          <div className="flex gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-8" />
      </CardFooter>
    </Card>
  )
}
