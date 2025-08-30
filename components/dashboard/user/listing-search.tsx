'use client'

import { useState, useCallback, useMemo } from 'react'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
import { Listing, ListingFilters } from '@/lib/DataClass'

type CategoryType = NonNullable<ListingFilters['type']> | 'all'
type PriceRangeType = NonNullable<ListingFilters['price']> | 'all'

interface CategoryCount {
  id: CategoryType
  label: string
  count: number
}

interface SearchFilters extends Omit<ListingFilters, 'type' | 'price'> {
  query: string
  category: CategoryType
  priceRange: PriceRangeType
}

interface ListingSearchProps {
  onSearch: (filters: SearchFilters) => void
  listings: Listing[]
}

// Constants for consistent filtering
const CATEGORY_CONFIG: Record<CategoryType, { label: string; colorClass: string }> = {
  'all': { label: 'All Items', colorClass: 'bg-gray-600 text-white hover:bg-gray-700' },
  'free': { label: 'Free', colorClass: 'bg-green-600 text-white hover:bg-green-700' },
  'sale': { label: 'Sale', colorClass: 'bg-red-600 text-white hover:bg-red-700' },
  'wanted': { label: 'Wanted', colorClass: 'bg-yellow-600 text-white hover:bg-yellow-700' }
}

const PRICE_RANGES: Array<{ id: PriceRangeType; label: string }> = [
  { id: 'all', label: 'All Prices' },
  { id: 'under25', label: 'Under ₱25' },
  { id: '25-50', label: '₱25-₱50' },
  { id: '50-100', label: '₱50-₱100' },
  { id: 'over100', label: 'Over ₱100' }
]

export function ListingSearch({ onSearch, listings }: ListingSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeType>('all')

  // Memoized category counts calculation
  const categories = useMemo((): CategoryCount[] => {
    const getTypeCount = (targetType: string) => 
      listings.filter(listing => {
        const type = (listing.type || '').toString().toLowerCase()
        return type === targetType
      }).length

    return [
      { id: 'all', label: CATEGORY_CONFIG.all.label, count: listings.length },
      { id: 'free', label: CATEGORY_CONFIG.free.label, count: getTypeCount('free') },
      { id: 'sale', label: CATEGORY_CONFIG.sale.label, count: getTypeCount('sale') },
      { id: 'wanted', label: CATEGORY_CONFIG.wanted.label, count: getTypeCount('wanted') }
    ]
  }, [listings])

  // Debounced search to avoid excessive API calls
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Centralized filter update function
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    const filters: SearchFilters = {
      query,
      category: selectedCategory,
      priceRange: selectedPriceRange,
      ...updates
    }
    onSearch(filters)
  }, [query, selectedCategory, selectedPriceRange, onSearch])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Debounced search
    const timeout = setTimeout(() => {
      updateFilters({ query: value })
    }, 300)
    
    setSearchTimeout(timeout)
  }, [searchTimeout, updateFilters])

  const handleCategoryChange = useCallback((category: CategoryType) => {
    setSelectedCategory(category)
    updateFilters({ category })
  }, [updateFilters])

  const handlePriceRangeChange = useCallback((priceRange: PriceRangeType) => {
    setSelectedPriceRange(priceRange)
    updateFilters({ priceRange })
  }, [updateFilters])

  const handleSearch = useCallback(() => {
    updateFilters({})
  }, [updateFilters])

  // Get badge styling based on selection state
  const getCategoryBadgeColor = useCallback((category: CategoryType) => {
    if (selectedCategory === category) {
      return CATEGORY_CONFIG[category].colorClass
    }
    return 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
  }, [selectedCategory])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedPriceRange !== 'all') count++
    return count
  }, [selectedCategory, selectedPriceRange])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setQuery('')
    setSelectedCategory('all')
    setSelectedPriceRange('all')
    updateFilters({ query: '', category: 'all', priceRange: 'all' })
  }, [updateFilters])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for items, sellers, or keywords..."
            value={query}
            onChange={handleInputChange}
            className="pl-10 pr-4 h-11 bg-background w-full"
          />
        </div>
        
        {/* Advanced Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 relative w-full sm:w-auto justify-center">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Price Filter
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
            <DropdownMenuLabel>Price Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Price Range Filter */}
            <div className="p-2">
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <Button
                    key={range.id}
                    variant={selectedPriceRange === range.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-sm h-10"
                    onClick={() => handlePriceRangeChange(range.id)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          onClick={handleSearch} 
          className="h-11 px-6 w-full sm:w-auto justify-center"
          disabled={!query.trim() && selectedCategory === 'all' && selectedPriceRange === 'all'}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Category Filter Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-1" />
          Categories:
        </span>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant="outline"
            className={`cursor-pointer transition-all duration-200 px-3 py-1 text-sm font-medium ${getCategoryBadgeColor(category.id)}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
            <span className="ml-1 text-xs opacity-70">
              ({category.count})
            </span>
          </Badge>
        ))}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              Category: {CATEGORY_CONFIG[selectedCategory].label}
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-4 h-4 hover:text-destructive"
                onClick={() => handleCategoryChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedPriceRange !== 'all' && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              Price: {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}
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
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive ml-auto"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
