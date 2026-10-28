import { Request, Response } from "express";

import {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClass,
  deleteLiveClass,
  endLiveClass,
  getUpcomingClasses,
  getStudentLiveClasses,
  joinLiveClass,
  getLiveClassAttendance,
  getLiveClassStats,
} from "./live-class.service";

export const createLiveClassController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await createLiveClass(user.id, req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const getLiveClassesController = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await getLiveClasses(user.id);

  res.json({
    success: true,
    data: result,
  });
};

export const getLiveClassByIdController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getLiveClassById(user.id, req.params.id as string);

  res.json({
    success: true,
    data: result,
  });
};

export const updateLiveClassController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await updateLiveClass(
    user.id,
    req.params.id as string,
    req.body,
  );

  res.json({
    success: true,
    data: result,
  });
};

export const deleteLiveClassController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await deleteLiveClass(user.id, req.params.id as string);

  res.json({
    success: true,
    data: result,
  });
};

export const endLiveClassController = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await endLiveClass(user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Live class ended successfully.",
    data: result,
  });
};

export const getUpcomingClassesController = async (
  req: Request,
  res: Response,
) => {
  const result = await getUpcomingClasses();

  res.json({
    success: true,
    data: result,
  });
};

export const getStudentLiveClassesController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getStudentLiveClasses(user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const joinLiveClassController = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await joinLiveClass(user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getLiveClassAttendanceController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getLiveClassAttendance(user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getLiveClassStatsController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getLiveClassStats(user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};
