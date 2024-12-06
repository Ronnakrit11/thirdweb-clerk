import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import prisma from "@/lib/db";

export async function ChatList() {
  const chats = await prisma.lineChat.findMany({
    where: {
      client: {
        lineUserId: {
          not: null
        }
      }
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      client: {
        select: {
          lineUserId: true
        }
      }
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
            timestamp={chat.createdAt}
          />
        ))}
      </div>
    </ScrollArea>
  );
}