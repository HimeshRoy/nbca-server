"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentChapters = exports.getChaptersBySubject = exports.deleteChapter = exports.updateChapter = exports.getChapterById = exports.getAllChapters = exports.createChapter = void 0;
const prisma_1 = require("../../config/prisma");
const createChapter = async (payload) => {
    const subject = await prisma_1.prisma.subject.findUnique({
        where: {
            id: payload.subjectId,
        },
    });
    return prisma_1.prisma.chapter.create({
        data: payload,
        include: {
            subject: true,
        },
    });
};
exports.createChapter = createChapter;
const getAllChapters = async () => {
    return prisma_1.prisma.chapter.findMany({
        include: {
            subject: true,
        },
    });
};
exports.getAllChapters = getAllChapters;
const getChapterById = async (id) => {
    return prisma_1.prisma.chapter.findUnique({
        where: {
            id,
        },
        include: {
            subject: true,
        },
    });
};
exports.getChapterById = getChapterById;
const updateChapter = async (id, payload) => {
    return prisma_1.prisma.chapter.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateChapter = updateChapter;
const deleteChapter = async (id) => {
    return prisma_1.prisma.chapter.delete({
        where: {
            id,
        },
    });
};
exports.deleteChapter = deleteChapter;
const getChaptersBySubject = async (subjectId) => {
    return prisma_1.prisma.chapter.findMany({
        where: {
            subjectId,
        },
        orderBy: {
            chapterNo: "asc",
        },
    });
};
exports.getChaptersBySubject = getChaptersBySubject;
const getStudentChapters = async (studentId, subjectId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    return prisma_1.prisma.chapter.findMany({
        where: {
            subjectId,
            subject: {
                classId: student.classId,
                boardId: student.boardId,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
exports.getStudentChapters = getStudentChapters;
