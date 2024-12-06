import { NextResponse } from "next/server";
import { WebhookEvent } from "@line/bot-sdk";
import { headers } from "next/headers";
import { verifySignature } from "@/lib/line/verify-signature";
import { handleMessage } from "@/lib/line/handle-message";

export async function POST(req: Request) {
  try {
    // Get the raw body as text
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get("x-line-signature");

    // Verify webhook signature
    if (!signature || !verifySignature(body, signature)) {
      console.error("Invalid signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 200 });
    }

    const events: WebhookEvent[] = JSON.parse(body);

    // Process each event
    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const lineUserId = event.source.userId;
        if (!lineUserId) continue;

        await handleMessage(lineUserId, event.message);
      }
    }

    // Always return 200 to LINE platform
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    // Still return 200 to LINE platform even on error
    return NextResponse.json({ message: "OK" }, { status: 200 });
  }
}

// Verify webhook URL is working
export async function GET() {
  return NextResponse.json({ message: "LINE Webhook is ready" }, { status: 200 });
}