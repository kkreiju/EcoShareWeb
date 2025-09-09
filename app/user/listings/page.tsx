import { BrowseListings } from "@/components/listings/browse-listings";

export default async function ListingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <BrowseListings />
    </div>
  );
}
