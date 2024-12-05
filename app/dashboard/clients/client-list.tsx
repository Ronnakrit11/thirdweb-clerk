import prisma from "@/lib/db";
import { ClientActions } from "./client-actions";

export async function ClientList() {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-5 gap-4 font-medium">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Address</div>
          <div className="text-right">Actions</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {clients.map((client) => (
          <div key={client.id} className="grid grid-cols-5 gap-4 p-4">
            <div>{client.name}</div>
            <div>{client.email}</div>
            <div>{client.phone}</div>
            <div>{client.address}</div>
            <div className="text-right">
              <ClientActions client={client} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}