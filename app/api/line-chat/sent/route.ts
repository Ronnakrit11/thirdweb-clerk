import { NextResponse } from "next/server";
import { lineClient } from "@/lib/line";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { message, lineUserId } = await req.json();

    if (!lineUserId) {
      return NextResponse.json(
        { error: "Line user ID is required" },
        { status: 400 }
      );
    }

    // Send message through Line API
    await lineClient.pushMessage(lineUserId, {
      type: "text",
      text: message,
    });

    // Find the client
    const client = await prisma.client.findFirst({
      where: { lineUserId },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Store the message
    const chat = await prisma.lineChat.create({
      data: {
        message,
        clientId: client.id,
        isFromClient: false,
      },
      include: {
        client: {
          select: {
            lineUserId: true,
            name: true,
          },
        },
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