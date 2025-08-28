'use client'

import { Button } from '@/components/ui/button'
import { Calendar, User, Clock, MessageCircle, AlertTriangle } from 'lucide-react'
import { Listing } from '@/lib/DataClass'

interface ItemSellerInfoProps {
  listing: Listing
}

export function ItemSellerInfo({ listing }: ItemSellerInfoProps) {
  const getUserName = () => {
    if (listing.User) {
      const { firstName, lastName } = listing.User
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User'
    }
    return listing.owner?.name || 'Unknown User'
  }

  const getItemAge = () => {
    const postedDate = new Date(listing.postedDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - postedDate.getTime())
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return `${diffWeeks} weeks ago`
  }

  const handleRequestItem = () => {
    console.log('Request item for listing:', listing.list_id)
  }

  const handleReportItem = () => {
    console.log('Report item for listing:', listing.list_id)
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      {/* Map placeholder */}
      <div className="h-32 bg-muted rounded-t-lg flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Map Location</span>
      </div>

      <div className="p-6">
        {/* Item Information */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-foreground">ITEM INFORMATION</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-chart-2" />
              <div>
                <span className="font-semibold text-foreground">Posted Date</span>
                <div className="text-muted-foreground">{new Date(listing.postedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-semibold text-foreground">Posted By</span>
                <div className="text-muted-foreground">{getUserName()}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-chart-1" />
              <div>
                <span className="font-semibold text-foreground">Item Age</span>
                <div className="text-muted-foreground">{getItemAge()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Owner */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-chart-2" />
            <h3 className="text-lg font-bold text-foreground">CONTACT OWNER</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Get in touch with the owner to arrange pickup or ask questions
          </p>
          <Button 
            onClick={handleRequestItem}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Request Item
          </Button>
        </div>

        {/* Report Item */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-bold text-foreground">REPORT ITEM</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Report inappropriate or suspicious content to help keep our community safe
          </p>
          <Button 
            onClick={handleReportItem}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-accent"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Item
          </Button>
        </div>
      </div>
    </div>
  )
}
