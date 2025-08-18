import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

// Helper function to format timestamp to time only (e.g., "7:07 AM")
function formatTimeOnly(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conv_id');
  const userId = searchParams.get('user_id');

  if (!conversationId || !userId) {
    return NextResponse.json({ error: 'Missing conversation ID or user ID' }, { status: 400 });
  }

  // Fetch the message details from the database
  const { data: messages, error: msgError } = await supabase
    .from('Message')
    .select('*')
    .eq('conv_id', conversationId);

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: 'No messages found' }, { status: 404 });
  }

  // Sort messages by timestamp
  const sortedMessages = messages.sort((a, b) => new Date(a.mess_sentAt).getTime() - new Date(b.mess_sentAt).getTime());

  // Get unique sender IDs to fetch user information
  const senderIds = [...new Set(sortedMessages.map(message => message.mess_senderId))];
  
  const { data: users, error: userError } = await supabase
    .from('User')
    .select('user_id, user_firstName, user_lastName')
    .in('user_id', senderIds);

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Create a map of users by their ID
  const usersByIdMap: Record<string, any> = {};
  if (users) {
    users.forEach(user => {
      usersByIdMap[user.user_id] = user;
    });
  }

  // Format messages according to the Message interface
  const formattedMessages = sortedMessages.map(message => {
    const sender = usersByIdMap[message.mess_senderId];
    
    return {
      id: message.mess_id,
      text: message.mess_content,
      timestamp: formatTimeOnly(message.mess_sentAt),
      isSent: message.mess_senderId === userId,
      senderName: sender ? `${sender.user_firstName} ${sender.user_lastName}` : 'Unknown User'
    };
  });

  return NextResponse.json(formattedMessages);
}
