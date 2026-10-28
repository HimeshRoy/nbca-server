import "dotenv/config";

const liveKitUrl = process.env.LIVEKIT_URL;
const liveKitApiKey = process.env.LIVEKIT_API_KEY;
const liveKitApiSecret = process.env.LIVEKIT_API_SECRET;

if (!liveKitUrl) {
  throw new Error("LIVEKIT_URL is not configured");
}

if (!liveKitApiKey) {
  throw new Error("LIVEKIT_API_KEY is not configured");
}

if (!liveKitApiSecret) {
  throw new Error("LIVEKIT_API_SECRET is not configured");
}

export const liveKitConfig = {
  url: liveKitUrl,
  apiKey: liveKitApiKey,
  apiSecret: liveKitApiSecret,
};