"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import type { LineChat, Client } from "@prisma/client";

interface ChatListProps {
  chats: (LineChat & {
    client: Pick<Client, "lineUserId" | "name">;
  })[];
}

export function ChatList({ chats }: ChatListProps) {
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