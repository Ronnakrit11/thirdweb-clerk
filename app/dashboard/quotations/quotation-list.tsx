import prisma from "@/lib/db";
import { QuotationActions } from "./quotation-actions";
import { formatCurrency } from "@/lib/utils";
import { QuotationStatus } from "./quotation-status";

export async function QuotationList() {
  const [quotations, clients, services] = await Promise.all([
    prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    }),
    prisma.client.findMany(),
    prisma.service.findMany(),
  ]);

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-5 gap-4 font-medium">
          <div>Client</div>
          <div>Services</div>
          <div>Total</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {quotations.map((quotation) => (
          <div key={quotation.id} className="grid grid-cols-5 gap-4 p-4">
            <div>{quotation.client.name}</div>
            <div className="truncate">
              {quotation.services.map((qs) => (
                <div key={qs.id} className="text-sm text-muted-foreground">
                  {qs.service.name} x {qs.quantity}
                </div>
              ))}
            </div>
            <div>{formatCurrency(quotation.total)}</div>
            <div>
              <QuotationStatus quotation={quotation} />
            </div>
            <div>
              <QuotationActions 
                quotation={quotation}
                clients={clients}
                services={services}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}