import { prisma } from "../../config/prisma";

import { deleteFileFromCloudinaryByUrl } from "../../services/cloudinary/cloudinary.service";

export const createQuestionBank = async (teacherId: string, payload: any) => {
  return prisma.questionBank.create({
    data: {
      ...payload,
      teacherId,
    },

    include: {
      board: true,
      class: true,
      subject: true,
      chapter: true,
    },
  });
};

export const getQuestionBanks = async (teacherId: string) => {
  return prisma.questionBank.findMany({
    where: {
      teacherId,
    },

    include: {
      board: true,
      class: true,
      subject: true,
      chapter: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getQuestionBankById = async (id: string) => {
  return prisma.questionBank.findUnique({
    where: {
      id,
    },
  });
};

export const updateQuestionBank = async (id: string, payload: any) => {
  const existingQuestionBank = await prisma.questionBank.findUnique({
    where: {
      id,
    },
  });

  if (!existingQuestionBank) {
    throw new Error("Question bank not found");
  }

  if (
    payload.questionImage &&
    existingQuestionBank.questionImage &&
    payload.questionImage !== existingQuestionBank.questionImage
  ) {
    try {
      await deleteFileFromCloudinaryByUrl(existingQuestionBank.questionImage);
    } catch (error) {
      console.error(
        "Failed to delete old question bank image from Cloudinary:",
        error,
      );

      throw new Error("Failed to delete old question bank image");
    }
  }

  return prisma.questionBank.update({
    where: {
      id,
    },

    data: payload,
  });
};

export const deleteQuestionBank = async (id: string) => {
  const questionBank = await prisma.questionBank.findUnique({
    where: {
      id,
    },
  });

  if (!questionBank) {
    throw new Error("Question bank not found");
  }

  if (questionBank.questionImage) {
    try {
      await deleteFileFromCloudinaryByUrl(questionBank.questionImage);
    } catch (error) {
      console.error(
        "Failed to delete question bank image from Cloudinary:",
        error,
      );

      throw new Error("Failed to delete question bank image");
    }
  }

  return prisma.questionBank.delete({
    where: {
      id,
    },
  });
};
