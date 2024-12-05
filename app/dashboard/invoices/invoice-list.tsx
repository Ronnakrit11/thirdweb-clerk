import prisma from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { InvoiceActions } from "./invoice-actions";

export async function InvoiceList() {
  const approvedQuotations = await prisma.quotation.findMany({
    where: {
      status: "APPROVED"
    },
    orderBy: { 
      createdAt: "desc" 
    },
    include: {
      client: true,
      services: {
        include: {
          service: true,
        },
      },
    },
  });

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-5 gap-4 font-medium">
          <div>Invoice Date</div>
          <div>Client</div>
          <div>Services</div>
          <div>Total</div>
          <div>Actions</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {approvedQuotations.map((quotation) => (
          <div key={quotation.id} className="grid grid-cols-5 gap-4 p-4">
            <div>{formatDate(quotation.createdAt)}</div>
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
              <InvoiceActions quotation={quotation} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}