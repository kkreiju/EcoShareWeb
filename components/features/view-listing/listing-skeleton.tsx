"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image and Details Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Combined Image and Details Card */}
          <Card className="py-0 min-h-[300px]">
            <CardContent className="p-0 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                {/* Image Side Skeleton */}
                <div className="relative w-full h-full min-h-[300px] bg-gray-100">
                  <Skeleton className="w-full h-full" />
                  {/* Type Badge Skeleton */}
                  <div className="absolute top-4 left-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  {/* Price Badge Skeleton */}
                  <div className="absolute top-4 right-4">
                    <Skeleton className="h-10 w-20 rounded-lg" />
                  </div>
                </div>
                
                {/* Details Side Skeleton */}
                <div className="p-8 h-full flex flex-col">
                  <div className="space-y-6">
                    {/* Title and Quantity */}
                    <div>
                      <Skeleton className="h-8 w-3/4 mb-3" />
                      <Skeleton className="h-6 w-32" />
                    </div>

                    {/* Description */}
                    <div>
                      <Skeleton className="h-4 w-24 mb-3" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <Skeleton className="h-4 w-16 mb-3" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <Skeleton className="h-4 w-32 mb-4" />
                      <div className="space-y-4">
                        {/* Location */}
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <Skeleton className="h-3 w-16 mb-1" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>

                        {/* Posted Date */}
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <Skeleton className="h-3 w-12 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>

                        {/* Pickup Time */}
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <Skeleton className="h-3 w-20 mb-1" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Posted By Section */}
                    <div className="pt-6">
                      <Skeleton className="h-4 w-20 mb-3" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6">
                      <div className="flex gap-3">
                        <Skeleton className="flex-1 h-12 rounded-lg" />
                        <Skeleton className="flex-1 h-12 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analytics and Map Skeleton */}
        <div className="space-y-6">
          {/* Nutrient Analytics Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Benefits */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                  
                  {/* Nutrient List */}
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="flex flex-col items-center justify-center">
                  <Skeleton className="w-[280px] h-[280px] rounded-full" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent>
              {/* Map Container */}
              <div className="w-full aspect-[4/2] rounded-lg overflow-hidden border border-border relative bg-gray-100">
                <Skeleton className="w-full h-full" />
                {/* Directions Button Skeleton */}
                <div className="absolute top-2 right-2">
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
              
              {/* Coordinates */}
              <Skeleton className="h-3 w-48 mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
