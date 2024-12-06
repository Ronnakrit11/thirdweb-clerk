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
        {chats.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
            No messages yet
          </div>
        ) : (
          chats.map((chat) => (
            <ChatMessage
              key={chat.id}
              message={chat.message}
              isFromClient={chat.isFromClient}
              timestamp={chat.createdAt}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}