import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import prisma from "@/lib/db";

export async function ChatList() {
  const chats = await prisma.lineChat.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      client: true,
    },
  });

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <div className="flex flex-col">
        {chats.map((chat) => (
          <ChatMessage
            key={chat.id}
            message={chat.message}
            isFromClient={chat.isFromClient}
            clientName={chat.client.name}
            timestamp={chat.createdAt}
          />
        ))}
      </div>
    </ScrollArea>
  );
}