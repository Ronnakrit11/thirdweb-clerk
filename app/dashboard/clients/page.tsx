import { Suspense } from "react";
import { ClientList } from "./client-list";
import { ClientCreateButton } from "./client-create-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <ClientCreateButton />
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ClientList />
      </Suspense>
    </div>
  );
}