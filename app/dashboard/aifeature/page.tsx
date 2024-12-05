import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function Aifeature() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
       
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
   
      </Suspense>
    </div>
  );
}