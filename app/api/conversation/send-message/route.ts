import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conv_id, user_id, text } = body;

    // Validate required fields
    if (!conv_id || !user_id || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: conv_id, mess_senderId, mess_content' },
        { status: 400 }
      );
    }

    // Insert message into the Message table
    const { data: message, error: messageError } = await supabase
      .from('Message')
      .insert({
        conv_id,
        mess_senderId:user_id,
        mess_content:text,
      })
      .select()
      .single();

    if (messageError) {
      return NextResponse.json({ error: messageError.message }, { status: 500 });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}