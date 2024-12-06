"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export type QuotationServiceInput = {
  serviceId: string;
  quantity: number;
  price: number;
};

export type QuotationInput = {
  clientId: string;
  status: string;
  services: QuotationServiceInput[];
};

export async function createQuotation(data: QuotationInput) {
  const total = data.services.reduce((sum, service) => {
    return sum + service.price * service.quantity;
  }, 0);

  await prisma.quotation.create({
    data: {
      clientId: data.clientId,
      status: data.status,
      total,
      services: {
        create: data.services.map((service) => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          price: service.price,
        })),
      },
    },
  });
  revalidatePath("/dashboard/quotations");
}

export async function updateQuotation(id: string, data: QuotationInput) {
  const total = data.services.reduce((sum, service) => {
    return sum + service.price * service.quantity;
  }, 0);

  // Delete existing services
  await prisma.quotationService.deleteMany({
    where: { quotationId: id },
  });

  // Update quotation and create new services
  await prisma.quotation.update({
    where: { id },
    data: {
      clientId: data.clientId,
      status: data.status,
      total,
      services: {
        create: data.services.map((service) => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          price: service.price,
        })),
      },
    },
  });
  revalidatePath("/dashboard/quotations");
}

export async function deleteQuotation(id: string) {
  // Use a transaction to ensure all operations succeed or none do
  await prisma.$transaction(async (tx) => {
    // First delete all associated quotation services
    await tx.quotationService.deleteMany({
      where: { quotationId: id },
    });

    // Then delete the quotation
    await tx.quotation.delete({
      where: { id },
    });
  });
  
  revalidatePath("/dashboard/quotations");
}