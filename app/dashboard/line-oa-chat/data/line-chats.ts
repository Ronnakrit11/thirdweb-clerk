import prisma from "@/lib/db";

export async function getLineChats() {
  return prisma.lineChat.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      client: {
        select: {
          lineUserId: true,
          name: true
        }
      }
    },
  });
}