"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSubjects = exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = void 0;
const prisma_1 = require("../../config/prisma");
const createSubject = async (payload) => {
    return prisma_1.prisma.subject.create({
        data: payload,
        include: {
            board: true,
            class: true,
        },
    });
};
exports.createSubject = createSubject;
const getAllSubjects = async () => {
    return prisma_1.prisma.subject.findMany({
        include: {
            board: true,
            class: true,
        },
    });
};
exports.getAllSubjects = getAllSubjects;
const getSubjectById = async (id) => {
    return prisma_1.prisma.subject.findUnique({
        where: { id },
        include: {
            board: true,
            class: true,
        },
    });
};
exports.getSubjectById = getSubjectById;
const updateSubject = async (id, payload) => {
    return prisma_1.prisma.subject.update({
        where: { id },
        data: payload,
        include: {
            board: true,
            class: true,
        },
    });
};
exports.updateSubject = updateSubject;
const deleteSubject = async (id) => {
    return prisma_1.prisma.subject.delete({
        where: { id },
    });
};
exports.deleteSubject = deleteSubject;
const getStudentSubjects = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    return prisma_1.prisma.subject.findMany({
        where: {
            classId: student.classId,
            boardId: student.boardId,
        },
        orderBy: {
            name: "asc",
        },
    });
};
exports.getStudentSubjects = getStudentSubjects;
