import { NextResponse } from "next/server";
import { WebhookEvent } from "@line/bot-sdk";
import prisma from "@/lib/db";
import { lineClient } from "@/lib/line";

export async function POST(req: Request) {
  try {
    const events: WebhookEvent[] = await req.json();

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const lineUserId = event.source.userId;
        if (!lineUserId) continue;

        // Find or create client by Line user ID
        let client = await prisma.client.findFirst({
          where: { lineUserId },
        });

        if (!client) {
          // Get user profile from Line
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
        }

        // Store the message
        await prisma.lineChat.create({
          data: {
            clientId: client.id,
            message: event.message.text,
            isFromClient: true,
          },
        });
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}