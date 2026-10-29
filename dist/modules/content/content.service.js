"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentsByChapter = exports.deleteContent = exports.updateContent = exports.getContentById = exports.getAllContents = exports.createContent = void 0;
const prisma_1 = require("../../config/prisma");
const createContent = async (payload) => {
    return prisma_1.prisma.content.create({
        data: payload,
        include: {
            chapter: true,
        },
    });
};
exports.createContent = createContent;
const getAllContents = async () => {
    return prisma_1.prisma.content.findMany({
        include: {
            chapter: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllContents = getAllContents;
const getContentById = async (id) => {
    return prisma_1.prisma.content.findUnique({
        where: {
            id,
        },
        include: {
            chapter: true,
        },
    });
};
exports.getContentById = getContentById;
const updateContent = async (id, payload) => {
    return prisma_1.prisma.content.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateContent = updateContent;
const deleteContent = async (id) => {
    return prisma_1.prisma.content.delete({
        where: {
            id,
        },
    });
};
exports.deleteContent = deleteContent;
const getContentsByChapter = async (chapterId) => {
    return prisma_1.prisma.content.findMany({
        where: {
            chapterId,
        },
        orderBy: {
            orderNo: "asc",
        },
    });
};
exports.getContentsByChapter = getContentsByChapter;
