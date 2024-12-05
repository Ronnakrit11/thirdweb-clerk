"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export async function createService(data: {
  name: string;
  description: string;
  price: number;
}) {
  await prisma.service.create({
    data: {
      ...data,
      price: Number(data.price),
    },
  });
  revalidatePath("/dashboard/services");
}

export async function updateService(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
  }
) {
  await prisma.service.update({
    where: { id },
    data: {
      ...data,
      price: Number(data.price),
    },
  });
  revalidatePath("/dashboard/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  });
  revalidatePath("/dashboard/services");
}