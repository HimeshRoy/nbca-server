import { prisma } from "../../config/prisma";
import { DifficultyLevel } from "@prisma/client";

import { deleteFileFromCloudinaryByUrl } from "../../services/cloudinary/cloudinary.service";

const QUESTION_IMAGE_FIELDS = [
  "questionImage",
  "optionAImage",
  "optionBImage",
  "optionCImage",
  "optionDImage",
] as const;

export const createQuestion = async (payload: {
  question: string;

  questionImage?: string;

  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  optionAImage?: string;
  optionBImage?: string;
  optionCImage?: string;
  optionDImage?: string;

  correctAnswer: string;

  explanation?: string;

  difficulty?: DifficultyLevel;

  marks: number;

  testId: string;
}) => {
  return prisma.question.create({
    data: payload,

    include: {
      test: true,
    },
  });
};

export const getQuestions = async (testId: string) => {
  return prisma.question.findMany({
    where: {
      testId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getQuestionById = async (id: string) => {
  return prisma.question.findUnique({
    where: {
      id,
    },

    include: {
      test: true,
    },
  });
};

export const updateQuestion = async (id: string, payload: any) => {
  const question = await prisma.question.findUnique({
    where: {
      id,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  for (const field of QUESTION_IMAGE_FIELDS) {
    const oldImage = question[field];
    const newImage = payload[field];

    if (newImage && oldImage && newImage !== oldImage) {
      try {
        await deleteFileFromCloudinaryByUrl(oldImage);
      } catch (error) {
        console.error(`Failed to delete old ${field} from Cloudinary:`, error);

        throw new Error(`Failed to delete old ${field}`);
      }
    }
  }

  return prisma.question.update({
    where: {
      id,
    },

    data: payload,
  });
};

export const deleteQuestion = async (id: string) => {
  const question = await prisma.question.findUnique({
    where: {
      id,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  for (const field of QUESTION_IMAGE_FIELDS) {
    const imageUrl = question[field];

    if (!imageUrl) {
      continue;
    }

    try {
      await deleteFileFromCloudinaryByUrl(imageUrl);
    } catch (error) {
      console.error(`Failed to delete ${field} from Cloudinary:`, error);

      throw new Error(`Failed to delete ${field}`);
    }
  }

  return prisma.question.delete({
    where: {
      id,
    },
  });
};
