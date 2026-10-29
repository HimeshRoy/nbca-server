"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestionBank = exports.updateQuestionBank = exports.getQuestionBankById = exports.getQuestionBanks = exports.createQuestionBank = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const createQuestionBank = async (teacherId, payload) => {
    return prisma_1.prisma.questionBank.create({
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
exports.createQuestionBank = createQuestionBank;
const getQuestionBanks = async (teacherId) => {
    return prisma_1.prisma.questionBank.findMany({
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
exports.getQuestionBanks = getQuestionBanks;
const getQuestionBankById = async (id) => {
    return prisma_1.prisma.questionBank.findUnique({
        where: {
            id,
        },
    });
};
exports.getQuestionBankById = getQuestionBankById;
const updateQuestionBank = async (id, payload) => {
    const existingQuestionBank = await prisma_1.prisma.questionBank.findUnique({
        where: {
            id,
        },
    });
    if (!existingQuestionBank) {
        throw new Error("Question bank not found");
    }
    if (payload.questionImage &&
        existingQuestionBank.questionImage &&
        payload.questionImage !== existingQuestionBank.questionImage) {
        try {
            await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(existingQuestionBank.questionImage);
        }
        catch (error) {
            console.error("Failed to delete old question bank image from Cloudinary:", error);
            throw new Error("Failed to delete old question bank image");
        }
    }
    return prisma_1.prisma.questionBank.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateQuestionBank = updateQuestionBank;
const deleteQuestionBank = async (id) => {
    const questionBank = await prisma_1.prisma.questionBank.findUnique({
        where: {
            id,
        },
    });
    if (!questionBank) {
        throw new Error("Question bank not found");
    }
    if (questionBank.questionImage) {
        try {
            await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(questionBank.questionImage);
        }
        catch (error) {
            console.error("Failed to delete question bank image from Cloudinary:", error);
            throw new Error("Failed to delete question bank image");
        }
    }
    return prisma_1.prisma.questionBank.delete({
        where: {
            id,
        },
    });
};
exports.deleteQuestionBank = deleteQuestionBank;
