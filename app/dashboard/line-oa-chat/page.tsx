import { Suspense } from "react";
import { ChatList } from "./components/chat-list";
import { ChatHeader } from "./components/chat-header";
import { ChatContainer } from "./components/chat-container";
import { Skeleton } from "@/components/ui/skeleton";

export default async function LineOaChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <ChatHeader 
        title="Line OA Chat"
        subtitle="Chat with your customers through Line OA"
      />
      <div className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-[600px]" />}>
          <ChatList />
        </Suspense>
        <ChatContainer />
      </div>
    </div>
  );
}