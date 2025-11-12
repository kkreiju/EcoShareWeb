import MessagesView from "@/components/features/messages/MessagesView";

export default async function MessagesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <MessagesView />
    </div>
  );
}
