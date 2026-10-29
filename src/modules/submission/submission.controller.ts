import { Request, Response } from "express";

import {
  submitAssignment,
  getMySubmissions,
  getAssignmentSubmissions,
  evaluateSubmission,
} from "./submission.service";

import { uploadFileToCloudinary } from "../../services/cloudinary/cloudinary.service";

export const submitAssignmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    let fileUrl: string | undefined;

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      fileUrl = uploadResult.secure_url;
    }

    const result = await submitAssignment(
      user.id,
      req.params.assignmentId as string,
      {
        ...req.body,
        fileUrl,
      },
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Assignment submission failed:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Assignment submission failed",
    });
  }
};

export const getMySubmissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const result = await getMySubmissions(user.id);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to get submissions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
};

export const getAssignmentSubmissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getAssignmentSubmissions(
      req.params.assignmentId as string,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to get assignment submissions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get assignment submissions",
    });
  }
};

export const evaluateSubmissionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await evaluateSubmission(req.params.id as string, req.body);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to evaluate submission:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate submission",
    });
  }
};
