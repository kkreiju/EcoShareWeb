import { BrowseListings } from "@/components/dashboard/browse-listings";

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <BrowseListings />
    </div>
  );
}
