import { ManageListingsView } from "@/components/features/listings/manage-listings/manage-listings-view";

export default async function ListingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ManageListingsView />
    </div>
  );
}
