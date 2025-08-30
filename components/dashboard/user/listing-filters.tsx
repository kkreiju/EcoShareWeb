'use client'

import { useCallback, useMemo } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ListingFilters } from '@/lib/DataClass'

type PriceRangeType = NonNullable<ListingFilters['price']> | 'all'

interface ListingFiltersProps {
  onFilterChange: (priceRange: PriceRangeType) => void
  selectedPriceRange: PriceRangeType
}

// Price range configuration - consistent with API standards
const PRICE_RANGES: Array<{ value: PriceRangeType; label: string }> = [
  { value: 'all', label: 'All Prices' },
  { value: 'under25', label: 'Under ₱25' },
  { value: '25-50', label: '₱25-₱50' },
  { value: '50-100', label: '₱50-₱100' },
  { value: 'over100', label: 'Over ₱100' }
]

export function ListingFilters({
  onFilterChange,
  selectedPriceRange
}: ListingFiltersProps) {
  // Optimized handlers with useCallback
  const handlePriceRangeChange = useCallback((priceRange: PriceRangeType) => {
    onFilterChange(priceRange)
  }, [onFilterChange])

  const clearAllFilters = useCallback(() => {
    onFilterChange('all')
  }, [onFilterChange])

  // Memoized calculations
  const activeFiltersCount = useMemo(() => {
    return selectedPriceRange !== 'all' ? 1 : 0
  }, [selectedPriceRange])

  const selectedPriceLabel = useMemo(() => {
    return PRICE_RANGES.find(r => r.value === selectedPriceRange)?.label || 'All Prices'
  }, [selectedPriceRange])

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative h-10 px-4">
            <Filter className="w-4 h-4 mr-2" />
            {selectedPriceRange === 'all' ? 'Price Filter' : selectedPriceLabel}
            <ChevronDown className="w-4 h-4 ml-2" />
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center justify-between">
            Price Range
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="p-1 text-xs h-auto"
              >
                Clear all
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-2 space-y-1">
            {PRICE_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={selectedPriceRange === range.value ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-sm h-9"
                onClick={() => handlePriceRangeChange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="text-xs flex items-center gap-1">
          {selectedPriceLabel}
          <Button
            variant="ghost"
            size="sm"
            className="p-0 w-4 h-4 hover:text-destructive"
            onClick={() => handlePriceRangeChange('all')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  )
}
