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
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const events: WebhookEvent[] = JSON.parse(body);

    // Process each event
    for (const event of events) {
      if (event.type === "message") {
        const lineUserId = event.source.userId;
        if (!lineUserId) continue;

        await handleMessage(lineUserId, event.message);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Verify webhook URL is working
export async function GET() {
  return new NextResponse("LINE Webhook Endpoint", { status: 200 });
}