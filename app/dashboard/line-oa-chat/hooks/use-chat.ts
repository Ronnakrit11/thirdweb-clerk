"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LineError, handleError } from "@/lib/exceptions";
import { useToast } from "@/hooks/use-toast";
import type { LineChat, Client } from "@prisma/client";

type ChatResponse = LineChat & {
  client: Pick<Client, "lineUserId" | "name">;
};

export function useChat() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, lineUserId: string): Promise<ChatResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/line-chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, lineUserId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new LineError(error.error || 'Failed to send message');
      }

      const data = await response.json();
      router.refresh();
      return data;
    } catch (error) {
      const errorMessage = handleError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
  };
}