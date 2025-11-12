"use client";

import { useParams } from "next/navigation";
import { ListingView } from "@/components/features/view-listing";

export default function ListingDetailsPage() {
  const params = useParams();
  const listingId = params.id as string;

  return <ListingView listingId={listingId} />;
}
