"use client";

import { ListingFilters } from "@/lib/DataClass";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Filter,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
} from "lucide-react";
import { useState } from "react";

interface ListingFiltersComponentProps {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  totalCount?: number;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export function ListingFiltersComponent({
  filters,
  onFiltersChange,
  totalCount = 0,
  isLoading = false,
  viewMode = "grid",
  onViewModeChange,
}: ListingFiltersComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof ListingFilters, value: string | null) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" || value === null ? undefined : value,
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all"
  );
  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== "all"
  ).length;

  const FilterContent = () => (
    <div className="space-y-6 px-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Active Filters
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.type && filters.type !== "all" && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => updateFilter("type", "all")}
              >
                <Grid3X3 className="w-3 h-3 mr-1" />
                {filters.type === "Free" && "Free Items"}
                {filters.type === "Wanted" && "Wanted Items"}
                {filters.type === "Sale" && "For Sale"}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {filters.availabilityStatus &&
              filters.availabilityStatus !== "all" && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => updateFilter("availabilityStatus", "all")}
                >
                  Status: {filters.availabilityStatus}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            {filters.sort_by && filters.sort_by !== null && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => updateFilter("sort_by", null)}
              >
                <Filter className="w-3 h-3 mr-1" />
                {filters.sort_by === "newest" && "Newest First"}
                {filters.sort_by === "oldest" && "Oldest First"}
                {filters.sort_by === "price_high" && "Price: High to Low"}
                {filters.sort_by === "price_low" && "Price: Low to High"}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Sort By
          </label>
          <Select
            value={filters.sort_by || undefined}
            onValueChange={(value) => value ? updateFilter("sort_by", value) : updateFilter("sort_by", null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Default sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Oldest First
                </div>
              </SelectItem>
              <SelectItem value="price_high">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Price: High to Low
                </div>
              </SelectItem>
              <SelectItem value="price_low">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Price: Low to High
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Category
          </label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  All Categories
                </div>
              </SelectItem>
              <SelectItem value="Free">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Free Items
                </div>
              </SelectItem>
              <SelectItem value="Wanted">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Wanted Items
                </div>
              </SelectItem>
              <SelectItem value="Sale">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  For Sale
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left Side - Results Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <span className="font-medium text-foreground">
              {totalCount.toLocaleString()}{" "}
              {totalCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Badge variant="outline" className="text-xs">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
            applied
          </Badge>
        )}
      </div>

      {/* Right Side - Controls */}
      <div className="flex items-center gap-2">

        {/* View Mode Toggle */}
        {onViewModeChange && (
          <div className="flex items-center border border-border rounded-md p-0.5 mr-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <SlidersHorizontal className="w-4 h-4" />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter Button */}
        <div className="hidden md:block">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-2 text-xs px-1.5 py-0.5"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
