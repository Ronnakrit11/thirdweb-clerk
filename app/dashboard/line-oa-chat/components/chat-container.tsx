"use client";

import { useState } from "react";
import { ChatInput } from "./chat-input";
import { useRouter } from "next/navigation";

export function ChatContainer() {
  const router = useRouter();
  
  const handleSendMessage = async (message: string) => {
    try {
      // TODO: Replace with actual clientId
      const clientId = "example-client-id";
      
      await fetch("/api/line-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, clientId }),
      });
      
      router.refresh();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <ChatInput onSendMessage={handleSendMessage} />
  );
}