'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, Calendar, Clock } from 'lucide-react'
import { Listing } from '@/lib/DataClass'

interface ItemDetailsProps {
  listing: Listing
}

function getTypeBadge(listing: Listing) {
  const raw = (listing.type ?? listing.category ?? '').toString().toLowerCase()
  switch (raw) {
    case 'free':
      return { label: 'Free', className: 'bg-green-600 text-white' }
    case 'sale':
      return { label: 'Sale', className: 'bg-red-600 text-white' }
    case 'wanted':
      return { label: 'Wanted', className: 'bg-yellow-500 text-white' }
    default:
      return { label: 'Listing', className: 'bg-muted text-foreground' }
  }
}

export function ItemDetails({ listing }: ItemDetailsProps) {
  const typeBadge = getTypeBadge(listing)
  const normalizedType = (listing.type ?? listing.category ?? '').toString().toLowerCase()

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header with Image and Basic Info */}
        <div className="flex gap-6">
          {/* Image */}
          <div className="relative w-48 h-32 rounded border bg-muted flex-shrink-0">
            {listing.imageURL || (listing.images && listing.images[0]) ? (
              <img
                src={listing.imageURL || listing.images?.[0]}
                alt={listing.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Basic Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={typeBadge.className}>{typeBadge.label}</Badge>
                  {normalizedType === 'sale' && listing.price && (
                    <Badge variant="outline" className="font-semibold">
                      ₱{listing.price}
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl font-semibold">{listing.title}</h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {listing.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Item Information */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Item Information</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{listing.quantity}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{listing.locationName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Posted:</span>
              <span className="font-medium">{new Date(listing.postedDate).toLocaleDateString()}</span>
            </div>
            {listing.pickupTimeAvailability && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Pickup:</span>
                <span className="font-medium">{listing.pickupTimeAvailability}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {listing.tags && Array.isArray(listing.tags) && listing.tags.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {listing.instructions && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Pickup Instructions</h3>
            <div className="bg-muted/30 border rounded p-3">
              <p className="text-sm text-muted-foreground">{listing.instructions}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
