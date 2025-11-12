"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-16"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-20">Type</TableHead>
            <TableHead className="w-24">Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-24">Posted</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/30">
              {/* Image Column */}
              <TableCell>
                <Skeleton className="w-12 h-12 rounded-md" />
              </TableCell>

              {/* Title Column */}
              <TableCell>
                <div className="max-w-xs space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>

              {/* Type Column */}
              <TableCell>
                <Skeleton className="h-5 w-12 rounded-full" />
              </TableCell>

              {/* Price Column */}
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </TableCell>

              {/* Location Column */}
              <TableCell>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>

              {/* Posted Column */}
              <TableCell>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>

              {/* Owner Column */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Actions Column */}
              <TableCell>
                <div className="flex gap-1">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <Card
          key={index}
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 py-0"
        >
          {/* Image Section with Type Badge */}
          <div className="relative">
            <div className="aspect-video overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
            <Skeleton className="absolute top-3 left-3 h-6 w-16 rounded-full" />
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Title and Price */}
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-3/4" />
              <div className="text-right shrink-0 space-y-1">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Description */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            {/* Tags (optional) */}
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>

            {/* Location and Time */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

