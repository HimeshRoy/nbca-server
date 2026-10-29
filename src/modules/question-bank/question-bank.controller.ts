import { Request, Response } from "express";

import {
  createQuestionBank,
  getQuestionBanks,
  getQuestionBankById,
  updateQuestionBank,
  deleteQuestionBank,
} from "./question-bank.service";

import { uploadFileToCloudinary } from "../../services/cloudinary/cloudinary.service";

export const createQuestionBankController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    let questionImage: string | undefined;

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      questionImage = uploadResult.secure_url;
    }

    const result = await createQuestionBank(user.id, {
      ...req.body,
      ...(questionImage && { questionImage }),
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Question bank creation failed:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Question bank creation failed",
    });
  }
};

export const getQuestionBanksController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const result = await getQuestionBanks(user.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to get question banks:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get question banks",
    });
  }
};

export const getQuestionBankByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getQuestionBankById(req.params.id as string);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to get question bank:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get question bank",
    });
  }
};

export const updateQuestionBankController = async (
  req: Request,
  res: Response,
) => {
  try {
    let questionImage: string | undefined;

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      questionImage = uploadResult.secure_url;
    }

    const result = await updateQuestionBank(req.params.id as string, {
      ...req.body,
      ...(questionImage && { questionImage }),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to update question bank:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update question bank",
    });
  }
};

export const deleteQuestionBankController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await deleteQuestionBank(req.params.id as string);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to delete question bank:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete question bank",
    });
  }
};
