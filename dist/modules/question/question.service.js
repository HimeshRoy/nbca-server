"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.getQuestionById = exports.getQuestions = exports.createQuestion = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const QUESTION_IMAGE_FIELDS = [
    "questionImage",
    "optionAImage",
    "optionBImage",
    "optionCImage",
    "optionDImage",
];
const createQuestion = async (payload) => {
    return prisma_1.prisma.question.create({
        data: payload,
        include: {
            test: true,
        },
    });
};
exports.createQuestion = createQuestion;
const getQuestions = async (testId) => {
    return prisma_1.prisma.question.findMany({
        where: {
            testId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
exports.getQuestions = getQuestions;
const getQuestionById = async (id) => {
    return prisma_1.prisma.question.findUnique({
        where: {
            id,
        },
        include: {
            test: true,
        },
    });
};
exports.getQuestionById = getQuestionById;
const updateQuestion = async (id, payload) => {
    const question = await prisma_1.prisma.question.findUnique({
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
                await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(oldImage);
            }
            catch (error) {
                console.error(`Failed to delete old ${field} from Cloudinary:`, error);
                throw new Error(`Failed to delete old ${field}`);
            }
        }
    }
    return prisma_1.prisma.question.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (id) => {
    const question = await prisma_1.prisma.question.findUnique({
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
            await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(imageUrl);
        }
        catch (error) {
            console.error(`Failed to delete ${field} from Cloudinary:`, error);
            throw new Error(`Failed to delete ${field}`);
        }
    }
    return prisma_1.prisma.question.delete({
        where: {
            id,
        },
    });
};
exports.deleteQuestion = deleteQuestion;
