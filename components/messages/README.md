# EcoShare Messaging System

A comprehensive real-time messaging system built for the EcoShare platform using React, TypeScript, and Supabase.

## Features

### Core Messaging
- 💬 **Real-time messaging** - Instant message delivery with WebSocket connections
- 👥 **Conversation management** - Create and manage conversations between users
- 📱 **Message status tracking** - Sent, delivered, and read receipts
- 🔄 **Message replies** - Reply to specific messages with context
- 📄 **File attachments** - Send images and documents
- 😊 **Message reactions** - React to messages with emojis
- 🔍 **Search conversations** - Find conversations by user name

### User Experience
- ✨ **Modern UI** - Clean and intuitive interface
- 🌙 **Dark/Light mode** - Supports theme switching
- 📱 **Responsive design** - Works on all device sizes
- 🔔 **Notifications** - Real-time message notifications
- ⌨️ **Keyboard shortcuts** - Quick navigation and actions
- 👤 **Online status** - See when users are online/offline

### Technical Features
- 🔒 **Row-level security** - Secure access control with Supabase RLS
- 🚀 **Real-time updates** - Supabase Realtime for instant updates
- 📦 **File storage** - Supabase Storage for attachments
- 🎯 **TypeScript** - Full type safety
- 🧪 **Mock data support** - Easy development and testing

## Components

### Main Components

#### `MessagingInterface`
The main messaging container that combines all messaging functionality.

```tsx
import { MessagingInterface } from "@/components/messages";

<MessagingInterface currentUserId="user-id" />
```

#### `MessageList`
Displays a list of conversations with search functionality.

#### `MessageChat`
The main chat interface for sending and receiving messages.

#### `MessageNotifications`
Handles message notifications in the header/navbar.

### Utility Components

#### `MessageStatusIcon` / `MessageStatusText`
Display message delivery status with icons and text.

#### `MessageFileUploader`
Handles file and image uploads for messages.

## Usage

### Basic Setup

1. **Add to your page**:
```tsx
import { MessagingInterface } from "@/components/messages";

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <MessagingInterface />
    </div>
  );
}
```

2. **Database Setup**:
Run the SQL schema in `lib/database-types.ts` to create the necessary tables in your Supabase database.

3. **Storage Setup**:
Create a storage bucket named `message-attachments` in your Supabase project.

### Advanced Usage

#### Custom Hook for State Management
```tsx
import { useMessaging } from "@/hooks/use-messaging";

const {
  conversations,
  messages,
  sendMessage,
  markMessagesAsRead,
  getOrCreateConversation
} = useMessaging(currentUserId);
```

#### File Upload Integration
```tsx
import { messageFileUploader } from "@/lib/message-file-upload";

const uploadResult = await messageFileUploader.uploadImage(file, userId);
```

## Database Schema

### Tables

#### `conversations`
- `id` - Unique conversation identifier
- `user_id` - First user in the conversation
- `other_user_id` - Second user in the conversation
- `created_at` / `updated_at` - Timestamps

#### `messages`
- `id` - Unique message identifier
- `conversation_id` - Reference to conversation
- `sender_id` - User who sent the message
- `content` - Message text content
- `message_type` - Type: text, image, or file
- `status` - Delivery status: sent, delivered, read
- `reply_to_id` - Reference to replied message
- `attachment_url` - URL for file attachments
- `created_at` / `updated_at` - Timestamps

#### `profiles`
- `id` - User ID (references auth.users)
- `full_name` - User's display name
- `avatar_url` - Profile picture URL
- `is_online` - Online status
- `last_seen` - Last activity timestamp

#### `message_reactions`
- `id` - Reaction identifier
- `message_id` - Reference to message
- `user_id` - User who reacted
- `reaction` - Emoji or reaction type

### Row Level Security

All tables have RLS policies that ensure users can only:
- View conversations they're part of
- Send messages in their conversations
- Update their own messages and profile
- See reactions on messages they can access

## File Support

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP (max 5MB)
- **Documents**: PDF, DOC, DOCX, TXT (max 10MB)

### Image Processing
- Automatic resizing to 1920x1080 max
- Quality compression to 80%
- Progressive loading support

## Real-time Features

### Supabase Realtime
- Message delivery notifications
- Conversation updates
- Online status changes
- Read receipts

### WebSocket Events
- New message received
- Message status updated
- User online/offline
- Typing indicators (planned)

## Customization

### Theming
The messaging system uses your existing Tailwind CSS theme and adapts to dark/light mode automatically.

### Mock Data
For development, the system includes comprehensive mock data:
- Sample conversations
- Test messages with different types
- User profiles with avatars

### Configuration
Key configuration options in `useMessaging` hook:
- Real-time channel subscriptions
- Message pagination
- File upload limits
- Status update intervals

## Development

### Getting Started
1. Install dependencies (already in package.json)
2. Set up Supabase database with the provided schema
3. Configure environment variables
4. Import and use the messaging components

### Testing
The system includes mock data for easy testing without a full database setup.

### Performance
- Message pagination for large conversations
- Optimized re-renders with React.memo
- Efficient real-time subscriptions
- Image compression and resizing

## Integration with EcoShare

The messaging system integrates seamlessly with the EcoShare platform:
- Uses existing authentication system
- Follows the same design patterns
- Integrates with user profiles
- Supports listing-based conversations

## Future Enhancements

- 💭 Typing indicators
- 🔍 Message search within conversations
- 📋 Message forwarding
- 🎯 Message mentions
- 📊 Message analytics
- 🔊 Voice messages
- 📱 Push notifications
