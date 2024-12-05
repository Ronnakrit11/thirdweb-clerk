import prisma from "@/lib/db";
import { ServiceActions } from "./service-actions";
import { formatCurrency } from "@/lib/utils";

export async function ServiceList() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 font-medium">
          <div>Name</div>
          <div>Description</div>
          <div>Price</div>
          <div className="text-right">Actions</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {services.map((service) => (
          <div key={service.id} className="grid grid-cols-4 gap-4 p-4">
            <div>{service.name}</div>
            <div className="truncate">{service.description}</div>
            <div>{formatCurrency(service.price)}</div>
            <div>
              <ServiceActions service={service} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}