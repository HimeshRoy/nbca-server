import { Request, Response } from "express";
import {
  getClassroomChat,
  saveClassroomChatMessage,
} from "./chat.service";

export const getClassroomChatController = async (
  req: Request,
  res: Response,
) => {
  try {
    const liveClassId = req.params.liveClassId as string;
    if (!liveClassId) {
      return res.status(400).json({
        message: "Live class ID is required",
      });
    }

    const messages =
      await getClassroomChat(liveClassId);

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(
      "Get classroom chat error:",
      error,
    );

    return res.status(500).json({
      message: "Failed to load classroom chat",
    });
  }
};

export const saveClassroomChatController = async (
  req: Request,
  res: Response,
) => {
  try {
    const liveClassId = req.params.liveClassId as string;
    
    const {
      identity,
      name,
      message,
      timestamp,
    } = req.body;

    if (
      !liveClassId ||
      !identity ||
      !name ||
      !message
    ) {
      return res.status(400).json({
        message:
          "liveClassId, identity, name and message are required",
      });
    }

    const chatMessage = {
      id: crypto.randomUUID(),
      identity,
      name,
      message: message.trim(),
      timestamp: timestamp || Date.now(),
    };

    const savedMessage =
      await saveClassroomChatMessage(
        liveClassId,
        chatMessage,
      );

    return res.status(201).json({
      message: savedMessage,
    });
  } catch (error) {
    console.error(
      "Save classroom chat error:",
      error,
    );

    return res.status(500).json({
      message: "Failed to save classroom chat",
    });
  }
};