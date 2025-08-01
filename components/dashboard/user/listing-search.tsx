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

type CategoryType = 'all' | 'for-sale' | 'free' | 'wanted'
type SortType = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'most-viewed'
type ConditionType = 'all' | 'new' | 'like-new' | 'good' | 'fair'

interface SearchFilters {
  query: string
  category: CategoryType
  sort: SortType
  condition: ConditionType
  priceRange: [number, number]
}

interface ListingSearchProps {
  onSearch: (filters: SearchFilters) => void
}

export function ListingSearch({ onSearch }: ListingSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [selectedSort, setSelectedSort] = useState<SortType>('newest')
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  const categories = [
    { id: 'all' as CategoryType, label: 'All Items', count: 1247 },
    { id: 'for-sale' as CategoryType, label: 'For Sale', count: 892 },
    { id: 'free' as CategoryType, label: 'Free', count: 234 },
    { id: 'wanted' as CategoryType, label: 'Wanted', count: 121 }
  ]

  const sortOptions = [
    { id: 'newest' as SortType, label: 'Newest First' },
    { id: 'oldest' as SortType, label: 'Oldest First' },
    { id: 'price-low' as SortType, label: 'Price: Low to High' },
    { id: 'price-high' as SortType, label: 'Price: High to Low' },
    { id: 'most-viewed' as SortType, label: 'Most Viewed' }
  ]

  const conditions = [
    { id: 'all' as ConditionType, label: 'All Conditions' },
    { id: 'new' as ConditionType, label: 'New' },
    { id: 'like-new' as ConditionType, label: 'Like New' },
    { id: 'good' as ConditionType, label: 'Good' },
    { id: 'fair' as ConditionType, label: 'Fair' }
  ]

  const handleSearch = () => {
    const filters: SearchFilters = {
      query,
      category: selectedCategory,
      sort: selectedSort,
      condition: selectedCondition,
      priceRange
    }
    onSearch(filters)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    // Auto-search on input change
    setTimeout(() => {
      const filters: SearchFilters = {
        query: value,
        category: selectedCategory,
        sort: selectedSort,
        condition: selectedCondition,
        priceRange
      }
      onSearch(filters)
    }, 300)
  }

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category)
    const filters: SearchFilters = {
      query,
      category,
      sort: selectedSort,
      condition: selectedCondition,
      priceRange
    }
    onSearch(filters)
  }

  const getCategoryBadgeColor = (category: CategoryType) => {
    if (selectedCategory === category) {
      switch (category) {
        case 'for-sale':
          return 'bg-green-600 text-white hover:bg-green-700'
        case 'free':
          return 'bg-blue-600 text-white hover:bg-blue-700'
        case 'wanted':
          return 'bg-purple-600 text-white hover:bg-purple-700'
        default:
          return 'bg-gray-600 text-white hover:bg-gray-700'
      }
    }
    return 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedSort !== 'newest') count++
    if (selectedCondition !== 'all') count++
    if (priceRange[0] !== 0 || priceRange[1] !== 500) count++
    return count
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for items, sellers, or keywords..."
            value={query}
            onChange={handleInputChange}
            className="pl-10 pr-4 h-11 bg-background"
          />
        </div>
        
        {/* Advanced Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
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
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Sort Options */}
            <div className="p-2">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <div className="grid grid-cols-1 gap-1">
                {sortOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={selectedSort === option.id ? "default" : "ghost"}
                    size="sm"
                    className="justify-start text-xs h-8"
                    onClick={() => {
                      setSelectedSort(option.id)
                      handleSearch()
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Condition Filter */}
            <div className="p-2">
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <div className="grid grid-cols-2 gap-1">
                {conditions.map((condition) => (
                  <Button
                    key={condition.id}
                    variant={selectedCondition === condition.id ? "default" : "ghost"}
                    size="sm"
                    className="justify-start text-xs h-8"
                    onClick={() => {
                      setSelectedCondition(condition.id)
                      handleSearch()
                    }}
                  >
                    {condition.label}
                  </Button>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Price Range */}
            <div className="p-2">
              <label className="text-sm font-medium mb-2 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newRange: [number, number] = [parseInt(e.target.value) || 0, priceRange[1]]
                      setPriceRange(newRange)
                    }}
                    className="h-8 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newRange: [number, number] = [priceRange[0], parseInt(e.target.value) || 500]
                      setPriceRange(newRange)
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="w-full h-8 text-xs"
                >
                  Apply Price Filter
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSearch} className="h-11 px-6">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Category Filter Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center">
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
          {selectedSort !== 'newest' && (
            <Badge variant="secondary" className="text-xs">
              Sort: {sortOptions.find(s => s.id === selectedSort)?.label}
              <button
                onClick={() => {
                  setSelectedSort('newest')
                  handleSearch()
                }}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCondition !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Condition: {conditions.find(c => c.id === selectedCondition)?.label}
              <button
                onClick={() => {
                  setSelectedCondition('all')
                  handleSearch()
                }}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {(priceRange[0] !== 0 || priceRange[1] !== 500) && (
            <Badge variant="secondary" className="text-xs">
              Price: ${priceRange[0]}-${priceRange[1]}
              <button
                onClick={() => {
                  setPriceRange([0, 500])
                  handleSearch()
                }}
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
