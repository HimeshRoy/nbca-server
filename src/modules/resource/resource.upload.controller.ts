import { Request, Response } from "express";

import { prisma } from "../../config/prisma";

import {
  uploadFileToCloudinary,
} from "../../services/cloudinary/cloudinary.service";

export const uploadResource = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      title,
      type,
      contentId,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Resource type is required",
      });
    }

    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "Content ID is required",
      });
    }

    const uploadResult =
      await uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

    const resource =
      await prisma.resource.create({
        data: {
          title,
          type,
          fileUrl:
            uploadResult.secure_url,
          fileSize:
            req.file.size,
          contentId,
        },
      });

    return res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error(
      "Cloudinary resource upload failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};