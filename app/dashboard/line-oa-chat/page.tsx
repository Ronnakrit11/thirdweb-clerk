import { Suspense } from "react";
import { ChatContainer } from "./components/chat-container";
import { ChatHeader } from "./components/chat-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getLineChats } from "./data/line-chats";
import prisma from "@/lib/db";

export default async function LineOaChatPage() {
  const [chats, customers] = await Promise.all([
    getLineChats(),
    prisma.client.findMany({
      where: {
        NOT: {
          lineUserId: null
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
  ]);
  
  return (
    <div className="flex flex-col gap-4">
      <ChatHeader 
        title="Line OA Chat"
        subtitle="Chat with your customers through Line OA"
      />
      <div className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-[600px]" />}>
          <ChatContainer 
            initialChats={chats} 
            customers={customers}
          />
        </Suspense>
      </div>
    </div>
  );
}