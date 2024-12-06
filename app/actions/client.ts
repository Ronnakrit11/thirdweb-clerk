"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export async function createClient(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
}) {
  await prisma.client.create({
    data,
  });
  revalidatePath("/dashboard/clients");
}

export async function updateClient(
  id: string,
  data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }
) {
  await prisma.client.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/clients");
}

export async function deleteClient(id: string) {
  // First, find all quotations for this client
  const quotations = await prisma.quotation.findMany({
    where: { clientId: id },
    select: { id: true },
  });

  // Use a transaction to ensure all operations succeed or none do
  await prisma.$transaction(async (tx) => {
    // Delete all quotation services for each quotation
    for (const quotation of quotations) {
      await tx.quotationService.deleteMany({
        where: { quotationId: quotation.id },
      });
    }

    // Delete all quotations for this client
    await tx.quotation.deleteMany({
      where: { clientId: id },
    });

    // Finally, delete the client
    await tx.client.delete({
      where: { id },
    });
  });

  revalidatePath("/dashboard/clients");
}