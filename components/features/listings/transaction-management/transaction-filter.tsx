"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TransactionFilterProps {
  activeTab: "contributor" | "receiver";
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function TransactionFilter({
  activeTab,
  selectedFilter,
  onFilterChange,
}: TransactionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const soldStatuses = ["Ongoing", "Completed", "Returned", "Cancelled"];
  const boughtStatuses = [
    "Pending",
    "Ongoing",
    "Completed",
    "Returned",
    "Declined",
    "Cancelled",
  ];

  const currentStatuses =
    activeTab === "contributor" ? soldStatuses : boughtStatuses;

  const clearFilters = () => {
    onFilterChange("all");
  };

  const getStatusDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "ongoing":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "declined":
      case "cancelled":
        return "bg-red-500";
      case "returned":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const FilterContent = () => (
    <div className="mt-6 space-y-6 px-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">
            Filter by Status
          </h4>
          {selectedFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
        <div>
          <Select
            value={selectedFilter}
            onValueChange={onFilterChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  All Statuses
                </div>
              </SelectItem>
              {currentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(
                        status
                      )}`}
                    ></div>
                    {status}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="w-4 h-4" />
              {selectedFilter !== "all" && (
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
            <FilterContent />
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
              {selectedFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs px-1.5 py-0.5"
                >
                  1
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
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
