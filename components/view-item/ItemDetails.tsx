'use client'

import { Badge } from '@/components/ui/badge'
import { Package, Clock, Tag } from 'lucide-react'
import { Listing } from '@/lib/DataClass'

interface ItemDetailsProps {
  listing: Listing
}

export function ItemDetails({ listing }: ItemDetailsProps) {
  const normalizedType = (listing.type ?? listing.category ?? '').toString().toLowerCase()

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      {/* Item Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 bg-muted rounded-t-lg overflow-hidden">
        {listing.imageURL || (listing.images && listing.images[0]) ? (
          <img
            src={listing.imageURL || listing.images?.[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {normalizedType === 'sale' && (
              <Badge className="bg-destructive text-destructive-foreground">SALE</Badge>
            )}
            {normalizedType === 'free' && (
              <Badge className="bg-primary text-primary-foreground">FREE</Badge>
            )}
            {normalizedType === 'wanted' && (
              <Badge className="bg-yellow-500 text-white">WANTED</Badge>
            )}
            {normalizedType === 'sale' && listing.price && (
              <div className="ml-auto">
                <span className="text-sm text-muted-foreground">PRICE</span>
                <div className="text-2xl font-bold text-primary">₱{listing.price}</div>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{listing.title}</h1>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-foreground">DESCRIPTION</h3>
          <p className="text-muted-foreground leading-relaxed">
            {listing.description || 'No description provided.'}
          </p>
        </div>

        {/* Quantity Available */}
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Quantity Available</span>
          <span className="text-primary font-bold">{listing.quantity} units</span>
        </div>

        {/* Pickup Availability */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-chart-2" />
          <span className="font-semibold text-foreground">Pickup Availability</span>
          <span className="text-chart-2 font-bold">
            {listing.pickupTimeAvailability || 'Anytime'}
          </span>
        </div>

        {/* Pickup Instructions */}
        {listing.instructions && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-chart-3 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">i</span>
              </div>
              <span className="font-semibold text-foreground">Pickup Instructions</span>
            </div>
            <p className="text-muted-foreground ml-7">{listing.instructions}</p>
          </div>
        )}

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(listing.tags && Array.isArray(listing.tags) && listing.tags.length > 0 
              ? listing.tags 
              : ['fruit', 'snack', 'sweet', 'tropical']
            ).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
