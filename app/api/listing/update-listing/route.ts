import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function PUT(request: NextRequest) {
    try{
        const body = await request.json();

        // Extract validated fields
        let { list_id, user_id,
             description, tags, price, quantity, pickupTimeAvailability,
              instructions, locationName, latitude, longitude } = body;

        // Check if all required fields are provided
        if (!list_id || !user_id) {
            return NextResponse.json({
                success: false,
                message: "List ID and User ID must be provided"
            }, { status: 400 });
        }

        // Verify if user owns the listing
        const { data: listing, error: fetchError } = await supabase
            .from('Listing')
            .select('user_id')
            .eq('list_id', list_id)
            .single();

        if (fetchError || !listing) {
            return NextResponse.json({
                success: false,
                message: "Listing not found"
            }, { status: 404 });
        }

        if (listing.user_id !== user_id) {
            return NextResponse.json({
                success: false,
                message: "User is not authorized to update this listing"
            }, { status: 403 });
        }

        // Update listing in the database
        const { data: updatedListing, error: updateError } = await supabase
            .from('Listing')
            .update({
                list_description: description,
                list_tags: tags,
                list_price: price,
                list_quantity: quantity,
                list_pickupTimeAvailability: pickupTimeAvailability,
                list_pickupInstructions: instructions,
                list_locationName: locationName,
                list_latitude: latitude,
                list_longitude: longitude
            })
            .eq('list_id', list_id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: updatedListing }, { status: 200 });
    }
    catch (error) {
        console.error("Error updating listing:", error);
        return NextResponse.json({ error: "Error updating listing" }, { status: 500 });
    }
}