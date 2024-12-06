"use client";

import { useState } from "react";
import { ChatList } from "./chat-list";
import { ChatInput } from "./chat-input";
import { useChat } from "../hooks/use-chat";
import { CustomerList } from "./customer-list";
import type { LineChat, Client } from "@prisma/client";

type ChatWithClient = LineChat & {
  client: Pick<Client, "lineUserId" | "name">;
};

interface ChatContainerProps {
  initialChats: ChatWithClient[];
  customers: Client[];
}

export function ChatContainer({ initialChats, customers }: ChatContainerProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [chats, setChats] = useState<ChatWithClient[]>(initialChats);
  const { sendMessage, isLoading } = useChat();

  const handleSendMessage = async (message: string) => {
    if (!selectedCustomer?.lineUserId) return;

    try {
      const newChat = await sendMessage(message, selectedCustomer.lineUserId);
      // Create a new chat object with the client information
      const chatWithClient: ChatWithClient = {
        ...newChat,
        client: {
          lineUserId: selectedCustomer.lineUserId,
          name: selectedCustomer.name,
        },
      };
      setChats((prev) => [...prev, chatWithClient]);
    } catch {
      // Error is already handled by useChat hook
    }
  };

  const filteredChats = selectedCustomer
    ? chats.filter((chat) => chat.client.lineUserId === selectedCustomer.lineUserId)
    : [];

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <CustomerList
          customers={customers}
          selectedCustomerId={selectedCustomer?.id}
          onSelectCustomer={setSelectedCustomer}
        />
      </div>
      <div className="col-span-3 flex flex-col gap-4">
        <ChatList chats={filteredChats} />
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading || !selectedCustomer} 
          placeholder={
            selectedCustomer 
              ? "Type your message..." 
              : "Select a customer to start chatting"
          }
        />
      </div>
    </div>
  );
}