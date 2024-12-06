import { NextResponse } from "next/server";
import { lineClient } from "@/lib/line";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { message, clientId } = await req.json();

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client?.lineUserId) {
      return NextResponse.json(
        { error: "Client has no associated Line user ID" },
        { status: 400 }
      );
    }

    // Send message through Line API
    await lineClient.pushMessage(client.lineUserId, {
      type: "text",
      text: message,
    });

    // Store the message in our database
    const chat = await prisma.lineChat.create({
      data: {
        message,
        clientId,
        isFromClient: false,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}