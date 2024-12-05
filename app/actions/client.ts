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
  await prisma.client.delete({
    where: { id },
  });
  revalidatePath("/dashboard/clients");
}