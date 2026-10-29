import { Request, Response } from "express";
import * as XLSX from "xlsx";

import { prisma } from "../../config/prisma";

import {
  uploadFileToCloudinary,
} from "../../services/cloudinary/cloudinary.service";

import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "./question.service";

type UploadedFiles = {
  [fieldname: string]: Express.Multer.File[];
};

const uploadQuestionImages = async (
  files: UploadedFiles | undefined,
) => {
  const imageFields = [
    "questionImage",
    "optionAImage",
    "optionBImage",
    "optionCImage",
    "optionDImage",
  ] as const;

  const imageUrls: Record<string, string> = {};

  if (!files) {
    return imageUrls;
  }

  for (const field of imageFields) {
    const file = files[field]?.[0];

    if (!file) {
      continue;
    }

    const uploadResult = await uploadFileToCloudinary(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    imageUrls[field] = uploadResult.secure_url;
  }

  return imageUrls;
};

export const createQuestionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const files = req.files as UploadedFiles | undefined;

    const imageUrls = await uploadQuestionImages(files);

    const result = await createQuestion({
      ...req.body,
      ...imageUrls,

      marks: Number(req.body.marks) || 1,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Question creation failed:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Question creation failed",
    });
  }
};

export const getQuestionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getQuestions(
      req.params.testId as string,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to get questions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get questions",
    });
  }
};

export const getQuestionByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getQuestionById(
      req.params.id as string,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to get question:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get question",
    });
  }
};

export const updateQuestionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const files = req.files as UploadedFiles | undefined;

    const imageUrls = await uploadQuestionImages(files);

    const result = await updateQuestion(
      req.params.id as string,
      {
        ...req.body,
        ...imageUrls,

        ...(req.body.marks !== undefined && {
          marks: Number(req.body.marks) || 1,
        }),
      },
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to update question:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update question",
    });
  }
};

export const deleteQuestionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await deleteQuestion(
      req.params.id as string,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to delete question:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete question",
    });
  }
};

export const uploadQuestionImageController = async (
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

    return res.status(201).json({
      success: true,
      data: {
        fileUrl: uploadResult.secure_url,
      },
    });
  } catch (error) {
    console.error(
      "Question image Cloudinary upload failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const uploadQuestionsExcelController = async (
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

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const questions = data.map((row: any) => ({
      question: String(row.question),

      optionA: String(row.optionA),
      optionB: String(row.optionB),
      optionC: String(row.optionC),
      optionD: String(row.optionD),

      correctAnswer: String(row.correctAnswer),

      marks: Number(row.marks) || 1,

      difficulty: row.difficulty || "EASY",

      explanation: row.explanation || "",

      testId: req.body.testId,
    }));

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    console.log("QUESTIONS:", questions);

    await prisma.question.createMany({
      data: questions,
    });

    return res.status(201).json({
      success: true,
      message: `${questions.length} questions imported`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Excel upload failed",
    });
  }
};