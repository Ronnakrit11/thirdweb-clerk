import { Message } from "@line/bot-sdk";
import prisma from "@/lib/db";
import { lineClient } from "../line";

export async function handleMessage(lineUserId: string, message: Message) {
  if (message.type !== "text") return;

  // Find or create client by Line user ID
  let client = await prisma.client.findFirst({
    where: { lineUserId },
  });

  if (!client) {
    // Get user profile from Line
    try {
      const profile = await lineClient.getProfile(lineUserId);
      
      client = await prisma.client.create({
        data: {
          lineUserId,
          name: profile.displayName,
          email: `${lineUserId}@line.user`,
          phone: "",
          address: "",
        },
      });
    } catch (error) {
      console.error("Error getting LINE profile:", error);
      // Fallback to basic info if profile fetch fails
      client = await prisma.client.create({
        data: {
          lineUserId,
          name: `LINE User ${lineUserId.slice(-6)}`,
          email: `${lineUserId}@line.user`,
          phone: "",
          address: "",
        },
      });
    }
  }

  // Store the message
  await prisma.lineChat.create({
    data: {
      clientId: client.id,
      message: message.text,
      isFromClient: true,
    },
  });
}