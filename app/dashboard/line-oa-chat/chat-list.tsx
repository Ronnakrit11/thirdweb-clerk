import { formatDate } from "@/lib/date";
import prisma from "@/lib/db";

export async function ChatList() {
  const chats = await prisma.lineChat.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: true,
    },
  });

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 font-medium">
          <div>Client</div>
          <div>Message</div>
          <div>Type</div>
          <div>Date</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {chats.map((chat) => (
          <div key={chat.id} className="grid grid-cols-4 gap-4 p-4">
            <div>{chat.client.name}</div>
            <div className="truncate">{chat.message}</div>
            <div>{chat.isFromClient ? "From Client" : "To Client"}</div>
            <div>{formatDate(chat.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}