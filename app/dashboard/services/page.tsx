import { Suspense } from "react";
import { ServiceList } from "./service-list";
import { ServiceCreateButton } from "./service-create-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <ServiceCreateButton />
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ServiceList />
      </Suspense>
    </div>
  );
}