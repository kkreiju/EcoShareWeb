'use client'

import { useState } from 'react'
import { ListingCard } from './listing-card'
import { ListingSearch } from './listing-search'
import { ListingSkeleton } from './listing-skeleton'

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

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: 'new' | 'like-new' | 'good' | 'fair'
  location: string
  images: string[]
  owner: {
    name: string
    avatar?: string
    rating: number
  }
  createdAt: string
  isAvailable: boolean
  tags: string[]
  listingType: 'for-sale' | 'free' | 'wanted'
  views: number
}

// Mock data for demonstration
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Eco-Friendly Water Bottle',
    description: 'Reusable stainless steel water bottle, perfect for reducing plastic waste.',
    price: 25,
    category: 'Kitchen & Dining',
    condition: 'new',
    location: 'Downtown',
    images: ['/images/img_avatar1.png'],
    owner: {
      name: 'Sarah Green',
      avatar: '/images/img_avatar1.png',
      rating: 4.8
    },
    createdAt: '2024-07-28',
    isAvailable: true,
    tags: ['eco-friendly', 'reusable', 'sustainable'],
    listingType: 'for-sale',
    views: 125
  },
  {
    id: '2',
    title: 'Vintage Leather Jacket',
    description: 'Classic brown leather jacket, well-maintained and stylish.',
    price: 85,
    category: 'Fashion',
    condition: 'good',
    location: 'Uptown',
    images: ['/images/img_avatar1.png'],
    owner: {
      name: 'Mike Johnson',
      avatar: '/images/img_avatar1.png',
      rating: 4.5
    },
    createdAt: '2024-07-27',
    isAvailable: true,
    tags: ['vintage', 'leather', 'fashion'],
    listingType: 'for-sale',
    views: 89
  },
  {
    id: '3',
    title: 'Solar Phone Charger',
    description: 'Portable solar-powered phone charger for outdoor adventures.',
    price: 0,
    category: 'Electronics',
    condition: 'like-new',
    location: 'Midtown',
    images: ['/images/img_avatar1.png'],
    owner: {
      name: 'Alex Rivera',
      avatar: '/images/img_avatar1.png',
      rating: 4.9
    },
    createdAt: '2024-07-26',
    isAvailable: true,
    tags: ['solar', 'electronics', 'portable'],
    listingType: 'free',
    views: 156
  },
  {
    id: '4',
    title: 'Looking for Bicycle',
    description: 'Seeking a good condition bicycle for daily commuting.',
    price: 100,
    category: 'Sports',
    condition: 'good',
    location: 'Suburbs',
    images: ['/images/img_avatar1.png'],
    owner: {
      name: 'Emma Wilson',
      avatar: '/images/img_avatar1.png',
      rating: 4.7
    },
    createdAt: '2024-07-25',
    isAvailable: true,
    tags: ['bicycle', 'commute', 'transport'],
    listingType: 'wanted',
    views: 67
  }
]

export function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [filteredListings, setFilteredListings] = useState<Listing[]>(mockListings)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = listings

      // Filter by search query
      if (filters.query) {
        filtered = filtered.filter(
          listing =>
            listing.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            listing.description.toLowerCase().includes(filters.query.toLowerCase()) ||
            listing.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase())) ||
            listing.owner.name.toLowerCase().includes(filters.query.toLowerCase())
        )
      }

      // Filter by listing type (category)
      if (filters.category !== 'all') {
        filtered = filtered.filter(listing => listing.listingType === filters.category)
      }

      // Filter by condition
      if (filters.condition !== 'all') {
        filtered = filtered.filter(listing => listing.condition === filters.condition)
      }

      // Filter by price range
      filtered = filtered.filter(
        listing => listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1]
      )

      // Apply sorting
      switch (filters.sort) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'oldest':
          filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'most-viewed':
          filtered.sort((a, b) => b.views - a.views)
          break
        default:
          break
      }

      setFilteredListings(filtered)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <ListingSearch onSearch={handleSearch} />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))
          : filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
      </div>

      {!isLoading && filteredListings.length === 0 && (
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
