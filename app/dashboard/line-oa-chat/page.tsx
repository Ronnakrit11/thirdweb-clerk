import { Suspense } from "react";
import { ChatList } from "./components/chat-list";
import { ChatHeader } from "./components/chat-header";
import { ChatContainer } from "./components/chat-container";
import { CustomerListWrapper } from "./components/customer-list-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/db";

export default async function LineOaChatPage() {
  const customers = await prisma.client.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <ChatHeader 
        title="Line OA Chat"
        subtitle="Chat with your customers through Line OA"
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <CustomerListWrapper customers={customers} />
          </Suspense>
        </div>
        <div className="col-span-8 flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <ChatList />
          </Suspense>
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}