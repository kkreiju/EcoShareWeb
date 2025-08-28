'use client'

import { useState } from 'react'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
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

type CategoryCount = {
  id: CategoryType
  label: string
  count: number
}

interface ListingSearchProps {
  onSearch: (filters: Omit<ListingFilters, 'type' | 'price'> & {
    query: string
    category: CategoryType
    priceRange: PriceRangeType
  }) => void
  listings: Listing[]
}

export function ListingSearch({ onSearch, listings }: ListingSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeType>('all')

  // Calculate real counts from actual listings data
  const getCategoryCounts = (): CategoryCount[] => {
    const freeCount = listings.filter(l => {
      const type = (l.type ?? '').toString().toLowerCase()
      const category = (l.category ?? '').toString().toLowerCase()
      return type === 'free' || category === 'free'
    }).length
    
    const saleCount = listings.filter(l => {
      const type = (l.type ?? '').toString().toLowerCase()
      const category = (l.category ?? '').toString().toLowerCase()
      return type === 'sale' || category === 'sale'
    }).length
    
    const wantedCount = listings.filter(l => {
      const type = (l.type ?? '').toString().toLowerCase()
      const category = (l.category ?? '').toString().toLowerCase()
      return type === 'wanted' || category === 'wanted'
    }).length
    
    return [
      { id: 'all' as CategoryType, label: 'All Items', count: listings.length },
      { id: 'free' as CategoryType, label: 'Free', count: freeCount },
      { id: 'sale' as CategoryType, label: 'Sale', count: saleCount },
      { id: 'wanted' as CategoryType, label: 'Wanted', count: wantedCount }
    ]
  }

  const categories = getCategoryCounts()

  const priceRanges = [
    { id: 'all' as PriceRangeType, label: 'All Prices' },
    { id: 'under25' as PriceRangeType, label: 'Under P25' },
    { id: '25-50' as PriceRangeType, label: 'P25-P50' },
    { id: '50-100' as PriceRangeType, label: 'P50-P100' },
    { id: 'over100' as PriceRangeType, label: 'Over P100' }
  ]

  const handleSearch = () => {
    const filters = {
      query,
      category: selectedCategory,
      priceRange: selectedPriceRange
    }
    onSearch(filters)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    // Auto-search on input change
    setTimeout(() => {
      const filters = {
        query: value,
        category: selectedCategory,
        priceRange: selectedPriceRange
      }
      onSearch(filters)
    }, 300)
  }

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category)
    const filters = {
      query,
      category,
      priceRange: selectedPriceRange
    }
    onSearch(filters)
  }

  const handlePriceRangeChange = (priceRange: PriceRangeType) => {
    setSelectedPriceRange(priceRange)
    const filters = {
      query,
      category: selectedCategory,
      priceRange
    }
    onSearch(filters)
  }

  const getCategoryBadgeColor = (category: CategoryType) => {
    if (selectedCategory === category) {
      switch (category) {
        case 'free':
          return 'bg-green-600 text-white hover:bg-green-700'
        case 'sale':
          return 'bg-red-600 text-white hover:bg-red-700'
        case 'wanted':
          return 'bg-yellow-600 text-white hover:bg-yellow-700'
        default:
          return 'bg-gray-600 text-white hover:bg-gray-700'
      }
    }
    return 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedPriceRange !== 'all') count++
    return count
  }

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
            <DropdownMenuLabel>Price Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Price Range Filter */}
            <div className="p-2">
              <div className="space-y-2">
                {priceRanges.map((range) => (
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

        <Button onClick={handleSearch} className="h-11 px-6 w-full sm:w-auto justify-center">
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
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Category: {categories.find(c => c.id === selectedCategory)?.label}
              <button
                onClick={() => handleCategoryChange('all')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedPriceRange !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Price: {priceRanges.find(p => p.id === selectedPriceRange)?.label}
              <button
                onClick={() => handlePriceRangeChange('all')}
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
