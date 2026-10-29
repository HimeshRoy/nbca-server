"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentTestById = exports.getStudentTests = exports.deleteTest = exports.updateTest = exports.getTestById = exports.getTests = exports.createTest = void 0;
const prisma_1 = require("../../config/prisma");
const createTest = async (teacherId, payload) => {
    console.log("TEST PAYLOAD:", payload);
    return prisma_1.prisma.test.create({
        data: {
            ...payload,
            chapterId: payload.chapterId || null,
            startTime: payload.startTime ? new Date(payload.startTime) : null,
            endTime: payload.endTime ? new Date(payload.endTime) : null,
            teacherId,
        },
        include: {
            teacher: true,
            board: true,
            class: true,
            subject: true,
            chapter: true,
        },
    });
};
exports.createTest = createTest;
const getTests = async (teacherId) => {
    return prisma_1.prisma.test.findMany({
        where: {
            teacherId,
        },
        include: {
            board: true,
            class: true,
            subject: true,
            chapter: true,
            _count: {
                select: {
                    questions: true,
                    attempts: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getTests = getTests;
const getTestById = async (teacherId, id) => {
    return prisma_1.prisma.test.findFirst({
        where: {
            id,
            teacherId,
        },
        include: {
            board: true,
            class: true,
            subject: true,
            chapter: true,
            questions: true,
            attempts: true,
        },
    });
};
exports.getTestById = getTestById;
const updateTest = async (teacherId, id, payload) => {
    const test = await prisma_1.prisma.test.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!test) {
        throw new Error("Test not found");
    }
    return prisma_1.prisma.test.update({
        where: {
            id,
        },
        data: {
            ...payload,
            chapterId: payload.chapterId || null,
            startTime: payload.startTime ? new Date(payload.startTime) : null,
            endTime: payload.endTime ? new Date(payload.endTime) : null,
        },
    });
};
exports.updateTest = updateTest;
const deleteTest = async (teacherId, id) => {
    const test = await prisma_1.prisma.test.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!test) {
        throw new Error("Test not found");
    }
    return prisma_1.prisma.test.delete({
        where: {
            id,
        },
    });
};
exports.deleteTest = deleteTest;
const getStudentTests = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    const tests = await prisma_1.prisma.test.findMany({
        where: {
            isPublished: true,
            subject: {
                classId: student.classId,
                boardId: student.boardId,
            },
        },
        include: {
            subject: true,
            attempts: {
                where: {
                    studentId,
                },
                select: {
                    id: true,
                    score: true,
                    createdAt: true,
                },
            },
            _count: {
                select: {
                    questions: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return tests.map((test) => ({
        ...test,
        attempted: test.attempts.length > 0,
        attempt: test.attempts[0] || null,
        totalQuestions: test._count.questions,
        resultAvailable: test.endTime ? new Date() >= new Date(test.endTime) : true,
    }));
};
exports.getStudentTests = getStudentTests;
const getStudentTestById = async (studentId, testId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    const test = await prisma_1.prisma.test.findFirst({
        where: {
            id: testId,
            subject: {
                classId: student.classId,
                boardId: student.boardId,
            },
        },
        include: {
            subject: true,
            questions: {
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    id: true,
                    question: true,
                    questionImage: true,
                    optionA: true,
                    optionB: true,
                    optionC: true,
                    optionD: true,
                    optionAImage: true,
                    optionBImage: true,
                    optionCImage: true,
                    optionDImage: true,
                    marks: true,
                },
            },
            attempts: {
                where: {
                    studentId,
                },
                select: {
                    id: true,
                    score: true,
                    createdAt: true,
                },
            },
        },
    });
    if (!test) {
        throw new Error("Test not found");
    }
    return {
        ...test,
        attempted: test.attempts.length > 0,
        attempt: test.attempts[0] || null,
    };
};
exports.getStudentTestById = getStudentTestById;
