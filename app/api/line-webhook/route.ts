import { NextResponse } from "next/server";
import { WebhookEvent } from "@line/bot-sdk";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Get the raw body as text
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get("x-line-signature");

    // Verify webhook signature
    if (!signature) {
      return new NextResponse("Missing signature", { status: 401 });
    }

    const channelSecret = process.env.LINE_CHANNEL_SECRET!;
    const hash = crypto
      .createHmac("SHA256", channelSecret)
      .update(body)
      .digest("base64");

    if (signature !== hash) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const events: WebhookEvent[] = JSON.parse(body);

    // Process each event
    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const lineUserId = event.source.userId;
        if (!lineUserId) continue;

        // Find or create client by Line user ID
        let client = await prisma.client.findFirst({
          where: { lineUserId },
        });

        if (!client) {
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

// Verify webhook URL is working
export async function GET() {
  return new NextResponse("LINE Webhook Endpoint", { status: 200 });
}