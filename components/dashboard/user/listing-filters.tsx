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
import { Slider } from '@/components/ui/slider'

interface ListingFiltersProps {
  onFilterChange: (
    category: string,
    condition: string,
    priceRange: [number, number]
  ) => void
  selectedCategory: string
  selectedCondition: string
  priceRange: [number, number]
}

const categories = [
  'all',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Kitchen & Dining',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Toys & Games',
  'Other'
]

const conditions = [
  'all',
  'new',
  'like-new',
  'good',
  'fair'
]

export function ListingFilters({
  onFilterChange,
  selectedCategory,
  selectedCondition,
  priceRange
}: ListingFiltersProps) {
  const [tempPriceRange, setTempPriceRange] = useState(priceRange)
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryChange = (category: string) => {
    onFilterChange(category, selectedCondition, priceRange)
  }

  const handleConditionChange = (condition: string) => {
    onFilterChange(selectedCategory, condition, priceRange)
  }

  const handlePriceChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]]
    setTempPriceRange(newRange)
    onFilterChange(selectedCategory, selectedCondition, newRange)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedCondition !== 'all') count++
    if (priceRange[0] !== 0 || priceRange[1] !== 200) count++
    return count
  }

  const clearAllFilters = () => {
    onFilterChange('all', 'all', [0, 200])
    setTempPriceRange([0, 200])
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Filters
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
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Filters
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
          
          {/* Category Filter */}
          <div className="p-2">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
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
                  key={condition}
                  variant={selectedCondition === condition ? "default" : "ghost"}
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => handleConditionChange(condition)}
                >
                  {condition === 'all' ? 'All Conditions' : condition.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Price Range Filter */}
          <div className="p-2">
            <label className="text-sm font-medium mb-2 block">
              Price Range: ${tempPriceRange[0]} - ${tempPriceRange[1]}
            </label>
            <div className="px-2">
              <Slider
                value={tempPriceRange}
                onValueChange={(values: number[]) => {
                  setTempPriceRange([values[0], values[1]])
                }}
                onValueCommit={handlePriceChange}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filters display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center gap-1">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {selectedCategory}
              <button
                onClick={() => handleCategoryChange('all')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCondition !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {selectedCondition.replace('-', ' ')}
              <button
                onClick={() => handleConditionChange('all')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
            <Badge variant="secondary" className="text-xs">
              ${priceRange[0]}-${priceRange[1]}
              <button
                onClick={() => handlePriceChange([0, 200])}
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
