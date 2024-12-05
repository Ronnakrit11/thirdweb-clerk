import { Suspense } from "react";
import { QuotationList } from "./quotation-list";
import { QuotationCreateButton } from "./quotation-create-button";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/db";

export default async function QuotationsPage() {
  const [clients, services] = await Promise.all([
    prisma.client.findMany(),
    prisma.service.findMany(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quotations</h1>
        <QuotationCreateButton clients={clients} services={services} />
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <QuotationList />
      </Suspense>
    </div>
  );
}