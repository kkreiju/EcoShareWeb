'use client'

import { useState } from 'react'
import { Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ListingFilters } from '@/lib/DataClass'

// Use DataClass compatible price range types
type PriceRangeType = NonNullable<ListingFilters['price']>

interface ListingFiltersProps {
  onFilterChange: (priceRange: PriceRangeType | 'all') => void
  selectedPriceRange: PriceRangeType | 'all'
}

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: 'under25', label: 'Under P25' },
  { value: '25-50', label: 'P25-P50' },
  { value: '50-100', label: 'P50-P100' },
  { value: 'over100', label: 'Over P100' }
]

export function ListingFilters({
  onFilterChange,
  selectedPriceRange
}: ListingFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handlePriceRangeChange = (priceRange: PriceRangeType | 'all') => {
    onFilterChange(priceRange)
  }

  const getActiveFiltersCount = () => {
    return selectedPriceRange !== 'all' ? 1 : 0
  }

  const clearAllFilters = () => {
    onFilterChange('all' as const)
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Price Filter
            <ChevronDown className="w-4 h-4 ml-2" />
            {getActiveFiltersCount() > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center justify-between">
            Price Range
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-auto p-1 text-xs"
              >
                Clear all
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Price Range Filter */}
          <div className="p-2">
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={selectedPriceRange === range.value ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm h-10"
                  onClick={() => handlePriceRangeChange(range.value as PriceRangeType | 'all')}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filters display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center gap-1">
          {selectedPriceRange !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {priceRanges.find(r => r.value === selectedPriceRange)?.label}
              <button
                onClick={() => handlePriceRangeChange('all' as const)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
