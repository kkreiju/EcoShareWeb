import { notFound } from 'next/navigation'
import { ItemDetails, ItemSellerInfo } from '@/components/view-item'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Listing, ListingsResponse } from '@/lib/DataClass'

interface ViewItemPageProps {
  params: Promise<{
    id: string
  }>
}

async function fetchListing(id: string): Promise<Listing | null> {
  try {
    // For server-side rendering, we need an absolute URL
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/listing/view-listing`
    
    const response = await fetch(url, {
      next: { revalidate: 60 } // Revalidate every minute
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch listings')
    }

    const data: ListingsResponse = await response.json()
    
    // Find the specific listing by ID
    const listing = data.data.find(item => item.list_id === id)
    return listing || null
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

export default async function ViewItemPage({ params }: ViewItemPageProps) {
  const { id } = await params
  const listing = await fetchListing(id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/user/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Item Details */}
        <div className="lg:col-span-2">
          <ItemDetails listing={listing} />
        </div>

        {/* Right Column - Actions & Seller Info */}
        <div>
          <ItemSellerInfo listing={listing} />
        </div>
      </div>


    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ViewItemPageProps) {
  const { id } = await params
  const listing = await fetchListing(id)

  if (!listing) {
    return {
      title: 'Item Not Found | EcoShare',
    }
  }

  return {
    title: `${listing.title} | EcoShare`,
    description: listing.description || `View details for ${listing.title} on EcoShare`,
  }
}
