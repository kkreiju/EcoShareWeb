'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MapPin, Star, Eye, MessageCircle } from 'lucide-react'

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
}

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'like-new':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'good':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'fair':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <div className="aspect-[4/3] overflow-hidden bg-muted/50">
          {listing.images[0] && !imageError ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/50 flex items-center justify-center">
                  <img
                    src="/icons/ic_leaf.png"
                    alt="EcoShare"
                    className="w-6 h-6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">No image</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className={getConditionColor(listing.condition)}>
            {listing.condition.replace('-', ' ')}
          </Badge>
          {!listing.isAvailable && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Sold
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorited(!isFavorited)
          }}
        >
          <Heart
            className={`w-3 h-3 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>

        {/* Price tag */}
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-white text-gray-900 shadow-md font-semibold text-sm">
            ${listing.price}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {listing.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{listing.location}</span>
            <span>•</span>
            <span>{formatDate(listing.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={listing.owner.avatar} alt={listing.owner.name} />
                <AvatarFallback className="text-xs">
                  {listing.owner.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{listing.owner.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{listing.owner.rating}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {listing.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs py-0 px-1 bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
            {listing.tags.length > 2 && (
              <Badge variant="outline" className="text-xs py-0 px-1 bg-muted/50">
                +{listing.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button
          className="flex-1 h-8 text-xs"
          disabled={!listing.isAvailable}
          onClick={() => {
            // Handle view details
            console.log('View details for:', listing.id)
          }}
        >
          <Eye className="w-3 h-3 mr-1" />
          {listing.isAvailable ? 'View Details' : 'Sold Out'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            // Handle message
            console.log('Message owner for:', listing.id)
          }}
        >
          <MessageCircle className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
