import crypto from "crypto";

export function verifySignature(body: string, signature: string): boolean {
  try {
    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    if (!channelSecret) {
      console.error("LINE_CHANNEL_SECRET is not configured");
      return false;
    }

    const hash = crypto
      .createHmac("SHA256", channelSecret)
      .update(body)
      .digest("base64");

    return hash === signature;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}