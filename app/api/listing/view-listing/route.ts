import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract filter parameters
    const listType = searchParams.get('list_type'); // free, wanted, sale
    const priceRange = searchParams.get('list_price'); // all, under25, 25-50, 50-100, over100
    const status = searchParams.get('list_availabilityStatus'); // all, active, inactive, sold
    const sortBy = searchParams.get('sort_by'); // newest, oldest, price_high, price_low
    
    // Start building the query
    let query = supabase
      .from("Listing")
      .select(`
        list_id,
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

    // Apply list_type filter
    if (listType && listType !== 'all') {
      query = query.eq('list_type', listType);
    }

    // Apply price range filter
    if (priceRange && priceRange !== 'all') {
      switch (priceRange) {
        case 'under25':
          query = query.lt('list_price', 25);
          break;
        case '25-50':
          query = query.gte('list_price', 25).lte('list_price', 50);
          break;
        case '50-100':
          query = query.gte('list_price', 50).lte('list_price', 100);
          break;
        case 'over100':
          query = query.gt('list_price', 100);
          break;
      }
    }

    // Apply availability status filter
    if (status && status !== 'all') {
      query = query.eq('list_availabilityStatus', status);
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          query = query.order('list_postedDate', { ascending: false });
          break;
        case 'oldest':
          query = query.order('list_postedDate', { ascending: true });
          break;
        case 'price_high':
          query = query.order('list_price', { ascending: false });
          break;
        case 'price_low':
          query = query.order('list_price', { ascending: true });
          break;
        default:
          query = query.order('list_postedDate', { ascending: false }); // Default to newest first
      }
    } else {
      // Default sorting: newest first
      query = query.order('list_postedDate', { ascending: false });
    }

    const { data: listings, error: listingsError } = await query;

    if (listingsError) {
      return NextResponse.json({ error: listingsError.message }, { status: 500 });
    }

    

    return NextResponse.json({
      data: listings,
      filters_applied: {
        list_type: listType || 'all',
        price_range: priceRange || 'all',
        status: status || 'all',
        sort_by: sortBy || 'newest'
      },
      total_count: listings?.length || 0
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ 
      error: "An error occurred while fetching listings" 
    }, { status: 500 });
  }
}