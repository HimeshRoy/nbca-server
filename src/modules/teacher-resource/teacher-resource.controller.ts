import { Request, Response } from "express";

import { uploadFileToCloudinary } from "../../services/cloudinary/cloudinary.service";

import {
  createTeacherResource,
  getTeacherResources,
  getTeacherResourceById,
  updateTeacherResource,
  deleteTeacherResource,
  getTeacherResourceStats,
} from "./teacher-resource.service";

export const createTeacherResourceController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await createTeacherResource(
    user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const getTeacherResourcesController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getTeacherResources(user.id);

  res.json({
    success: true,
    data: result,
  });
};

export const getTeacherResourceByIdController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getTeacherResourceById(
    user.id,
    req.params.id as string,
  );

  res.json({
    success: true,
    data: result,
  });
};

export const updateTeacherResourceController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await updateTeacherResource(
    user.id,
    req.params.id as string,
    req.body,
  );

  res.json({
    success: true,
    data: result,
  });
};

export const deleteTeacherResourceController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await deleteTeacherResource(
    user.id,
    req.params.id as string,
  );

  res.json({
    success: true,
    data: result,
  });
};

export const uploadTeacherResourceController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const uploadResult = await uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    return res.status(200).json({
      success: true,
      data: {
        fileUrl: uploadResult.secure_url,
        fileSize: req.file.size,
      },
    });
  } catch (error) {
    console.error(
      "Teacher resource Cloudinary upload failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const getTeacherResourceStatsController = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;

  const result = await getTeacherResourceStats(user.id);

  res.json({
    success: true,
    data: result,
  });
};