import { NearbyListingsView } from "@/components/nearby-listings/nearby-listings-view";

export default async function NearbyListingsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <NearbyListingsView />
    </div>
  );
}
