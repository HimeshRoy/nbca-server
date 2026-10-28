import { Request, Response } from "express";

import {
  createAttendance,
  getAttendance,
  getMyAttendance,
  markLiveClassLeave,
} from "./attendance.service";

export const createAttendanceController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await createAttendance(user.id, req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const getAttendanceController = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await getAttendance(user.id);

  res.json({
    success: true,
    data: result,
  });
};

export const getMyAttendanceController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getMyAttendance(user.id);

  res.json({
    success: true,
    data: result,
  });
};

export const markLiveClassLeaveController = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentId = (req as any).user.id;
    const liveClassId = req.params.liveClassId as string;

    if (!liveClassId) {
      return res.status(400).json({
        success: false,
        message: "Live class ID is required",
      });
    }

    const result = await markLiveClassLeave(
      studentId,
      liveClassId,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Mark live class leave error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to update live class attendance",
    });
  }
};