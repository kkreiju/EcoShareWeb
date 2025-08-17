import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function POST(req: NextRequest) {
  const { list_id, user_id } = await req.json();

  const { error } = await supabase
    .from('Listing')
    .update({ list_availabilityStatus: 'Unavailable' })
    .eq('list_id', list_id)
    .eq('user_id', user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Listing marked as unavailable successfully' }, { status: 200 });
}