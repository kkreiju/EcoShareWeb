import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function POST(req: NextRequest) {
  const { list_id, user_id } = await req.json();

  try {
    // First, get the current status
    const { data: currentListing, error: fetchError } = await supabase
      .from('Listing')
      .select('list_availabilityStatus')
      .eq('list_id', list_id)
      .eq('user_id', user_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!currentListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const currentStatus = currentListing.list_availabilityStatus;

    // Only toggle if status is 'Active' or 'Inactive'
    if (currentStatus !== 'Active' && currentStatus !== 'Inactive') {
      return NextResponse.json({ 
        error: `Cannot toggle status. Current status is '${currentStatus}'. Only 'Active' and 'Inactive' statuses can be toggled.` 
      }, { status: 400 });
    }

    // Toggle the status
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    // Update the status
    const { error: updateError } = await supabase
      .from('Listing')
      .update({ list_availabilityStatus: newStatus })
      .eq('list_id', list_id)
      .eq('user_id', user_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Listing status changed from '${currentStatus}' to '${newStatus}' successfully`,
      data: {
        list_id,
        previous_status: currentStatus,
        new_status: newStatus
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error toggling listing status:', error);
    return NextResponse.json({ 
      error: "An error occurred while toggling listing status" 
    }, { status: 500 });
  }
}