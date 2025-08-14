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
        *,
        Analytics (*),
        User!inner (
          user_firstName,
          user_lastName,
          user_profileURL,
          user_ratings
        )
      `)
      .eq('user_id', userId);

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