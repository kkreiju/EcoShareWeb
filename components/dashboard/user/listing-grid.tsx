'use client'

import { useState, useEffect } from 'react'
import { ListingCard } from './listing-card'
import { ListingSearch } from './listing-search'
import { ListingSkeleton } from './listing-skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Listing, ListingFilters, ListingsResponse } from '@/lib/DataClass'

type CategoryType = NonNullable<ListingFilters['type']> | 'all'
type PriceRangeType = NonNullable<ListingFilters['price']> | 'all'

// Use DataClass SearchFilters but extend for client-side filtering
type SearchFilters = Omit<ListingFilters, 'type' | 'price'> & {
  query: string
  category: CategoryType
  priceRange: PriceRangeType
}

// Function to fetch listings from API
async function fetchListings(filters: {
  list_type?: string
  list_price?: string
  sort_by?: string
  search?: string
}): Promise<ListingsResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL
  const params = new URLSearchParams()
  
  if (filters.list_type && filters.list_type !== 'all') {
    params.append('list_type', filters.list_type)
  }
  if (filters.list_price && filters.list_price !== 'all') {
    params.append('list_price', filters.list_price)
  }
  if (filters.sort_by) {
    params.append('sort_by', filters.sort_by)
  }
  // Note: The API doesn't support search yet, so we'll filter client-side for now
  
  const url = apiUrl 
    ? `${apiUrl}/api/listing/view-listing?${params.toString()}` 
    : `/api/listing/view-listing?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch listings')
  }
  
  return response.json()
}

function getPriceRangeBounds(range: PriceRangeType): [number, number] {
  switch (range) {
    case 'under25':
      return [0, 25]
    case '25-50':
      return [25, 50]
    case '50-100':
      return [50, 100]
    case 'over100':
      return [100, Number.MAX_SAFE_INTEGER]
    default:
      return [0, Number.MAX_SAFE_INTEGER]
  }
}

export function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'recent' | 'nearby'>('recent')
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceRange: 'all'
  })

  // Load initial data
  useEffect(() => {
    loadListings()
  }, [])

  // Reload data when tab changes or filters change
  useEffect(() => {
    if (listings.length > 0) {
      applyFiltersAndSorting()
    }
  }, [tab, listings, currentFilters])

  const loadListings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetchListings({
        sort_by: tab === 'recent' ? 'newest' : 'newest' // Both use newest for now
      })
      
      setListings(response.data)
      setFilteredListings(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings')
      console.error('Error loading listings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyTabSorting = (items: Listing[], tabValue: 'recent' | 'nearby') => {
    const sorted = [...items]
    if (tabValue === 'recent') {
      sorted.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    } else {
      // Simple proxy for "nearby": sort by location alphabetically
      sorted.sort((a, b) => a.locationName.localeCompare(b.locationName))
    }
    return sorted
  }

  const applyFiltersAndSorting = () => {
    let filtered = listings

    // Filter by search query (client-side for now)
    if (currentFilters.query) {
      filtered = filtered.filter(
        listing => {
          const tagsArray = Array.isArray(listing.tags)
            ? listing.tags
            : typeof listing.tags === 'string'
              ? [listing.tags]
              : []

          return (
            listing.title.toLowerCase().includes(currentFilters.query.toLowerCase()) ||
            listing.description.toLowerCase().includes(currentFilters.query.toLowerCase()) ||
            tagsArray.some(tag => tag.toLowerCase().includes(currentFilters.query.toLowerCase())) ||
            (listing.User && `${listing.User.firstName} ${listing.User.lastName}`.toLowerCase().includes(currentFilters.query.toLowerCase()))
          )
        }
      )
    }

    // Filter by listing type (client-side for now)
    if (currentFilters.category !== 'all') {
      const categoryMap: Record<CategoryType, string> = {
        'all': '',
        'sale': 'sale',
        'free': 'free', 
        'wanted': 'wanted'
      }
      filtered = filtered.filter(listing => {
        // Check both type and category fields for compatibility
        const listingType = (listing.type || '').toString().toLowerCase()
        const listingCategory = (listing.category || '').toString().toLowerCase()
        const targetType = categoryMap[currentFilters.category]
        
        return listingType === targetType || listingCategory === targetType
      })
    }

    // Filter by price range (client-side for now)
    const [minPrice, maxPrice] = getPriceRangeBounds(currentFilters.priceRange)
    filtered = filtered.filter(listing => {
      const price = listing.price || 0
      return price >= minPrice && price <= maxPrice
    })

    // Apply tab-based sorting
    filtered = applyTabSorting(filtered, tab)

    setFilteredListings(filtered)
  }

  const handleSearch = async (filters: SearchFilters) => {
    setCurrentFilters(filters)
    setIsLoading(true)
    
    try {
      // Apply filters directly with the new filter values
      let filtered = listings

      // Filter by search query (client-side for now)
      if (filters.query) {
        filtered = filtered.filter(
          listing => {
            const tagsArray = Array.isArray(listing.tags)
              ? listing.tags
              : typeof listing.tags === 'string'
                ? [listing.tags]
                : []

            return (
              listing.title.toLowerCase().includes(filters.query.toLowerCase()) ||
              listing.description.toLowerCase().includes(filters.query.toLowerCase()) ||
              tagsArray.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase())) ||
              (listing.User && `${listing.User.firstName} ${listing.User.lastName}`.toLowerCase().includes(filters.query.toLowerCase()))
            )
          }
        )
      }

      // Filter by listing type (client-side for now)
      if (filters.category !== 'all') {
        const categoryMap: Record<CategoryType, string> = {
          'all': '',
          'sale': 'sale',
          'free': 'free', 
          'wanted': 'wanted'
        }
        filtered = filtered.filter(listing => {
          // Check both type and category fields for compatibility
          const listingType = (listing.type || '').toString().toLowerCase()
          const listingCategory = (listing.category || '').toString().toLowerCase()
          const targetType = categoryMap[filters.category]
          
          return listingType === targetType || listingCategory === targetType
        })
      }

      // Filter by price range (client-side for now)
      const [minPrice, maxPrice] = getPriceRangeBounds(filters.priceRange)
      filtered = filtered.filter(listing => {
        const price = listing.price || 0
        return price >= minPrice && price <= maxPrice
      })

      // Apply tab-based sorting
      filtered = applyTabSorting(filtered, tab)

      setFilteredListings(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      console.error('Error during search:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ListingSearch onSearch={handleSearch} listings={listings} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'recent' | 'nearby')}>
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ListingSkeleton key={i} />
                ))
              : applyTabSorting(filteredListings, 'recent').map(listing => (
                  <ListingCard key={listing.list_id} listing={listing} />
                ))}
          </div>
        </TabsContent>
        <TabsContent value="nearby">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ListingSkeleton key={i} />
                ))
              : applyTabSorting(filteredListings, 'nearby').map(listing => (
                  <ListingCard key={listing.list_id} listing={listing} />
                ))}
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Listings
          </h3>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <button
            onClick={loadListings}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No listings found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}
