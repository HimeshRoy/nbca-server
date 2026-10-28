import { Request, Response } from "express";
import { createLiveKitToken } from "../../services/livekit/livekit.service";

export const generateLiveKitTokenController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      identity,
      roomName,
      role,
      name,
    } = req.body;

    if (!identity || !roomName || !role || !name) {
      return res.status(400).json({
        message: "identity, roomName, role and name are required",
      });
    }

    if (role !== "TEACHER" && role !== "STUDENT") {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const token = await createLiveKitToken(
      identity,
      roomName,
      role,
      name,
    );

    return res.status(200).json({
      token,
      url: process.env.LIVEKIT_URL,
      name,
    });
  } catch (error) {
    console.error("LiveKit token generation error:", error);

    return res.status(500).json({
      message: "Failed to generate LiveKit token",
    });
  }
};