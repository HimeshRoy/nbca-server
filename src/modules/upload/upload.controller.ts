import { Request, Response } from "express";

import { prisma } from "../../config/prisma";

import {
  uploadFileToCloudinary,
  deleteFileFromCloudinaryByUrl,
} from "../../services/cloudinary/cloudinary.service";

export const uploadFile = async (req: Request, res: Response) => {
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

    const savedFile = await prisma.file.create({
      data: {
        fileName: req.file.originalname,

        fileUrl: uploadResult.secure_url,

        fileType: req.file.mimetype,

        fileSize: req.file.size,
      },
    });

    return res.status(201).json({
      success: true,
      data: savedFile,
    });
  } catch (error) {
    console.error("Cloudinary file upload failed:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const deleteFile = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id as string;

    const file = await prisma.file.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Delete the actual file from Cloudinary
    if (file.fileUrl) {
      try {
        await deleteFileFromCloudinaryByUrl(
          file.fileUrl,
        );
      } catch (error) {
        console.error(
          "Failed to delete file from Cloudinary:",
          error,
        );

        return res.status(500).json({
          success: false,
          message:
            "Failed to delete file from Cloudinary",
        });
      }
    }

    // Delete the database record
    const deletedFile =
      await prisma.file.delete({
        where: {
          id,
        },
      });

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: deletedFile,
    });
  } catch (error) {
    console.error(
      "File deletion failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "File deletion failed",
    });
  }
};