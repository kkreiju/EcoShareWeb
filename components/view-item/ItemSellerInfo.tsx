'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Star, MessageCircle, Heart, Share2, CheckCircle } from 'lucide-react'
import { Listing } from '@/lib/DataClass'

interface ItemSellerInfoProps {
  listing: Listing
}

export function ItemSellerInfo({ listing }: ItemSellerInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  
  const normalizedType = (listing.type ?? listing.category ?? '').toString().toLowerCase()
  const isAvailable = listing.status === 'Active'

  const getUserName = () => {
    if (listing.User) {
      const { firstName, lastName } = listing.User
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User'
    }
    return listing.owner?.name || 'Unknown User'
  }

  const getUserAvatar = () => {
    return listing.User?.profileURL || listing.owner?.avatar || undefined
  }

  const getUserRating = () => {
    if (listing.User?.ratings) {
      return parseFloat(listing.User.ratings) || 0
    }
    return listing.rating || 0
  }

  const getTransactionCount = () => {
    return listing.User?.transactionCount || 0
  }

  const getUserInitials = () => {
    return getUserName()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const handleContact = () => {
    console.log('Contact seller for listing:', listing.list_id)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const rating = getUserRating()
  const transactionCount = getTransactionCount()

  return (
    <Card className="p-5">
      <div className="space-y-5">
        {/* Status and Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={isAvailable ? "default" : "destructive"} className="text-xs">
              {isAvailable ? 'Available' : 'Not Available'}
            </Badge>
          </div>
          {normalizedType === 'sale' && listing.price && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price:</span>
              <span className="text-lg font-semibold">₱{listing.price}</span>
            </div>
          )}
          {normalizedType === 'free' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price:</span>
              <span className="text-lg font-semibold text-green-600">FREE</span>
            </div>
          )}
          {normalizedType === 'wanted' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type:</span>
              <span className="text-lg font-semibold text-yellow-600">WANTED</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Item Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{listing.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{listing.locationName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Listed:</span>
              <span>{new Date(listing.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Seller</h4>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getUserAvatar()} alt={getUserName()} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{getUserName()}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
                <span>•</span>
                <span>{transactionCount} transactions</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">Verified Seller</Badge>
        </div>

        {/* Actions */}
        <div className="border-t pt-4 space-y-2">
          <Button 
            onClick={handleContact}
            disabled={!isAvailable}
            className="w-full"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>
          
          <Button 
            variant="outline"
            disabled={!isAvailable}
            className="w-full"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Request Item
          </Button>

          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex-1 text-xs ${isLiked ? 'text-red-600' : ''}`}
            >
              <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex-1 text-xs"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
