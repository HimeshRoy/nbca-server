"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createStudent = async (payload) => {
    const board = await prisma_1.prisma.board.findUnique({
        where: {
            id: payload.boardId,
        },
    });
    const session = await prisma_1.prisma.academicSession.findUnique({
        where: {
            id: payload.academicSessionId,
        },
    });
    if (!board || !session) {
        throw new Error("Board or Academic Session not found");
    }
    const year = session.name.slice(2, 4);
    const boardCode = board.shortName;
    const latestStudent = await prisma_1.prisma.student.findFirst({
        where: {
            boardId: payload.boardId,
            academicSessionId: payload.academicSessionId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    let nextNumber = 1;
    if (latestStudent) {
        const lastNumber = parseInt(latestStudent.studentId.slice(-4));
        nextNumber = lastNumber + 1;
    }
    const studentId = `${year}${boardCode}${String(nextNumber).padStart(4, "0")}`;
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const student = await prisma_1.prisma.student.create({
        data: {
            ...payload,
            studentId,
            password: hashedPassword,
        },
        include: {
            board: true,
            class: true,
            academicSession: true,
        },
    });
    const { password, ...studentData } = student;
    return studentData;
};
exports.createStudent = createStudent;
const getAllStudents = async () => {
    return prisma_1.prisma.student.findMany({
        select: {
            id: true,
            studentId: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
            dateOfBirth: true,
            guardianName: true,
            guardianPhone: true,
            address: true,
            isActive: true,
            boardId: true,
            classId: true,
            academicSessionId: true,
            board: true,
            class: true,
            academicSession: true,
            createdAt: true,
            updatedAt: true,
            admissionDate: true,
            submissions: true,
            attendances: true,
            testAttempts: true,
        },
    });
};
exports.getAllStudents = getAllStudents;
const getStudentById = async (id) => {
    return prisma_1.prisma.student.findUnique({
        where: { id },
        select: {
            id: true,
            studentId: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
            dateOfBirth: true,
            guardianName: true,
            guardianPhone: true,
            address: true,
            isActive: true,
            boardId: true,
            classId: true,
            academicSessionId: true,
            board: true,
            class: true,
            academicSession: true,
            createdAt: true,
            updatedAt: true,
            submissions: true,
            attendances: true,
            testAttempts: true,
        },
    });
};
exports.getStudentById = getStudentById;
const updateStudent = async (id, payload) => {
    if (payload.password) {
        payload.password = await bcrypt_1.default.hash(payload.password, 10);
    }
    return prisma_1.prisma.student.update({
        where: { id },
        data: payload,
    });
};
exports.updateStudent = updateStudent;
const deleteStudent = async (id) => {
    return prisma_1.prisma.student.delete({
        where: { id },
    });
};
exports.deleteStudent = deleteStudent;
