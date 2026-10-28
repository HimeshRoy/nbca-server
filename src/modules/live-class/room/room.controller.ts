import { Request, Response } from "express";
import { createLiveClassRoomToken } from "./room.service";

export const joinLiveClassRoomController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = user.id;
    const role = user.role;

    if (role !== "TEACHER" && role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Invalid classroom role",
      });
    }

    const result = await createLiveClassRoomToken(
      id as string,
      userId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "Successfully joined classroom",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Join Live Class Room Error:",
      error,
    );

    if (error.message === "Live class not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "You are not authorized to join this class" ||
      error.message ===
        "You are not enrolled in this class"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to join classroom",
    });
  }
};