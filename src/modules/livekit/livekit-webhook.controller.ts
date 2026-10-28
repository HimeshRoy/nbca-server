import { Request, Response } from "express";

import { handleLiveKitWebhook } from "./livekit-webhook.service";

export const liveKitWebhookController = async (
  req: Request,
  res: Response,
) => {
  try {
    const authorization =
      req.get("Authorization");

    const body = req.body.toString("utf8");

    await handleLiveKitWebhook(
      body,
      authorization,
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(
      "LiveKit webhook error:",
      error,
    );

    return res.status(401).json({
      success: false,
      message: "Invalid LiveKit webhook",
    });
  }
};