import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  // Fetch user details from the database
  const { data: user, error: userError } = await supabase
    .from('User')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
