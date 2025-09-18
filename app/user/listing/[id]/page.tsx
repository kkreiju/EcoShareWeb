"use client";

import { useParams } from "next/navigation";
import { ListingView } from "@/components/view-listing";

export default function ListingDetailsPage() {
  const params = useParams();
  const listingId = params.id as string;

  return <ListingView listingId={listingId} />;
}
