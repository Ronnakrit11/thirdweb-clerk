import { NextResponse } from "next/server";
import { WebhookEvent } from "@line/bot-sdk";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const events: WebhookEvent[] = await req.json();

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const lineUserId = event.source.userId;
        
        // Find or create client by Line user ID
        let client = await prisma.client.findFirst({
          where: { lineUserId },
        });

        if (!client) {
          client = await prisma.client.create({
            data: {
              lineUserId,
              name: `Line User ${lineUserId.slice(-6)}`,
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