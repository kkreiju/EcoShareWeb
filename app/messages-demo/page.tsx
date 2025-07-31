import { MessagingInterface } from "@/components/messages/messaging-interface";

export default function MessagesDemo() {
  return (
    <div className="h-screen bg-background">
      <MessagingInterface currentUserId="current-user" />
    </div>
  );
}
