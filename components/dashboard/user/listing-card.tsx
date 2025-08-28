'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Star } from 'lucide-react'
import { Listing } from '@/lib/DataClass'

interface ListingCardProps {
	listing: Listing
}

function getTypeBadgeFromListing(listing: Listing) {
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

export function ListingCard({ listing }: ListingCardProps) {
	const router = useRouter()
	const typeBadge = getTypeBadgeFromListing(listing)
	const normalizedType = (listing.type ?? listing.category ?? '').toString().toLowerCase()
	
	// Helper to get user display name
	const getUserName = () => {
		if (listing.User) {
			const { firstName, lastName } = listing.User
			return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User'
		}
		return listing.owner?.name || 'Unknown User'
	}
	
	// Helper to get user avatar
	const getUserAvatar = () => {
		return listing.User?.profileURL || listing.owner?.avatar || undefined
	}
	
	// Helper to get user rating
	const getUserRating = () => {
		if (listing.User?.ratings) {
			return parseFloat(listing.User.ratings) || 0
		}
		return listing.rating || 0
	}

	const handleClick = () => {
		router.push(`/user/item/${listing.list_id}`)
	}

	return (
		<Card 
			className="overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40 p-0 cursor-pointer hover:shadow-md"
			onClick={handleClick}
		>
			{/* Media */}
			<div className="relative h-40 w-full">
				{listing.imageURL || (listing.images && listing.images[0]) ? (
					<img
						src={listing.imageURL || listing.images?.[0]}
						alt={listing.title}
						className="h-full w-full object-cover rounded-t-xl"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted/40 rounded-t-xl">
						<div className="h-10 w-10 rounded-md bg-muted" />
					</div>
				)}
				<div className="absolute left-3 top-3">
					<Badge className={typeBadge.className}>{typeBadge.label}</Badge>
				</div>
			</div>

			{/* Body */}
			<div className="space-y-2 p-3">
				<div className="flex items-start justify-between gap-3">
					<h3 className="line-clamp-1 text-base font-semibold">{listing.title}</h3>
					{normalizedType === 'sale' && listing.price && (
						<Badge className="bg-white text-gray-900 shadow">₱{listing.price}</Badge>
					)}
				</div>
				{/* Reserve height for up to 2 lines to keep cards even */}
				<p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{listing.description || '\u00A0'}</p>
				<div className="flex items-center justify-between pt-1 min-h-[2rem]">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<Avatar className="h-6 w-6 flex-shrink-0">
							<AvatarImage src={getUserAvatar()} alt={getUserName()} />
							<AvatarFallback className="text-[10px]">
								{getUserName()
									.split(' ')
									.map((n) => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
						<span className="text-xs font-medium truncate">{getUserName()}</span>
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground max-w-20">
							<MapPin className="h-3 w-3 flex-shrink-0" /> 
							<span className="truncate">{listing.locationName || listing.location}</span>
						</span>
						<span className="inline-flex items-center gap-1 text-xs">
							<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
							{getUserRating().toFixed(1)}
						</span>
					</div>
				</div>
			</div>
		</Card>
	)
}
