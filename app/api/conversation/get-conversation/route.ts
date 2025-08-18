import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  // First get conversations for the user
  const { data: conversations, error: convError } = await supabase
    .from('Conversation')
    .select('*')
    .or(`conv_userId1.eq.${userId},conv_userId2.eq.${userId}`);

  if (convError) {
    return NextResponse.json({ error: convError.message }, { status: 500 });
  }

  if (!conversations || conversations.length === 0) {
    return NextResponse.json([]);
  }

  // Get the latest message for each conversation
  const conversationIds = conversations.map(conv => conv.conv_id);
  
  const { data: latestMessages, error: msgError } = await supabase
    .from('Message')
    .select('conv_id, mess_senderId, mess_content, mess_sentAt')
    .in('conv_id', conversationIds)
    .order('mess_sentAt', { ascending: false });

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }

  // Group messages by conv_id and get the latest one for each
  const latestMessagesByConv: Record<string, any> = {};
  if (latestMessages) {
    latestMessages.forEach(message => {
      if (!latestMessagesByConv[message.conv_id]) {
        latestMessagesByConv[message.conv_id] = message;
      }
    });
  }

  // Get other user IDs to fetch their information
  const otherUserIds = conversations.map(conv => {
    return conv.conv_userId1 === userId ? conv.conv_userId2 : conv.conv_userId1;
  });

  const { data: users, error: userError } = await supabase
    .from('User')
    .select('user_id, user_firstName, user_lastName, user_profileURL')
    .in('user_id', otherUserIds);

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

  // Format the response according to the Conversation interface
  const formattedConversations = conversations.map(conv => {
    const otherUserId = conv.conv_userId1 === userId ? conv.conv_userId2 : conv.conv_userId1;
    const otherUser = usersByIdMap[otherUserId];
    const latestMessage = latestMessagesByConv[conv.conv_id];

    return {
      id: conv.conv_id,
      name: otherUser ? `${otherUser.user_firstName} ${otherUser.user_lastName}` : 'Unknown User',
      lastMessage: latestMessage?.mess_content || '',
      timestamp: conv.conv_lastMessageAt,
      avatar: otherUser?.user_imageURL || undefined
    };
  });

  return NextResponse.json(formattedConversations);
}
