"use client";

import { useState } from "react";
import { ChatList } from "./chat-list";
import { ChatInput } from "./chat-input";
import { useChat } from "../hooks/use-chat";
import type { LineChat, Client } from "@prisma/client";

interface ChatContainerProps {
  initialChats: (LineChat & {
    client: Pick<Client, "lineUserId" | "name">;
  })[];
}

export function ChatContainer({ initialChats }: ChatContainerProps) {
  const [chats, setChats] = useState(initialChats);
  const { sendMessage, isLoading } = useChat();

  const handleSendMessage = async (message: string) => {
    const currentClient = chats[0]?.client;
    if (!currentClient?.lineUserId) return;

    try {
      const newChat = await sendMessage(message, currentClient.lineUserId);
      setChats([...chats, newChat]);
    } catch {
      // Error is already handled by useChat hook
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ChatList chats={chats} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}