import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract filter parameters
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ 
        error: "user_id parameter is required" 
      }, { status: 400 });
    }

    // Start building the query
        let query = supabase
          .from("Listing")
          .select(`
            list_id,
            user_id,
            title:list_title,
            type:list_type,
            price:list_price,
            description:list_description,
            imageURL:list_imageURL,
            tags:list_tags,
            quantity:list_quantity,
            status:list_availabilityStatus,
            postedDate:list_postedDate,
            pickupTimeAvailability:list_pickupTimeAvailability,
            instructions:list_pickupInstructions,
            locationName:list_locationName,
            latitude:list_latitude,
            longitude:list_longitude,
            Analytics (*),
            User!inner (
              firstName:user_firstName,
              lastName:user_lastName,
              profileURL:user_profileURL,
              ratings:user_ratings
            )
          `);
          
    const { data: listings, error: listingsError } = await query;

    if (listingsError) {
      throw listingsError;
    }

    return NextResponse.json({
      data: listings,
      user_id: userId,
      total_count: listings?.length || 0
    });
  }
  catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ 
      error: "An error occurred while fetching listings" 
    }, { status: 500 });
  }
}