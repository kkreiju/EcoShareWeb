import { ListingGrid } from '@/components/dashboard/user'

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Main Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Browse Listings</h2>
          <p className="text-sm text-muted-foreground">
            Find sustainable items near you
          </p>
        </div>
        <ListingGrid />
      </div>
    </div>
  )
}
