"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.studentSignup = exports.studentLogin = exports.teacherLogin = exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_service_1 = require("../../services/email/email.service");
const welcome_student_template_1 = require("../../services/email/templates/welcome-student.template");
const adminLogin = async (email, password) => {
    const admin = await prisma_1.prisma.admin.findUnique({
        where: {
            email,
        },
    });
    if (!admin) {
        throw new Error("Admin not found");
    }
    const isMatched = await bcrypt_1.default.compare(password, admin.password);
    if (!isMatched) {
        throw new Error("Invalid Password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: admin.id,
        email: admin.email,
        role: admin.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const { password: _, ...adminData } = admin;
    return {
        token,
        admin: adminData,
    };
};
exports.adminLogin = adminLogin;
const teacherLogin = async (email, password) => {
    const teacher = await prisma_1.prisma.teacher.findUnique({
        where: {
            email,
        },
    });
    if (!teacher) {
        throw new Error("Teacher not found");
    }
    const isMatched = await bcrypt_1.default.compare(password, teacher.password);
    if (!isMatched) {
        throw new Error("Invalid Password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: teacher.id,
        email: teacher.email,
        role: teacher.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const { password: _, ...teacherData } = teacher;
    return {
        token,
        teacher: teacherData,
    };
};
exports.teacherLogin = teacherLogin;
const studentLogin = async (studentId, password) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    const isMatched = await bcrypt_1.default.compare(password, student.password);
    if (!isMatched) {
        throw new Error("Invalid Password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: student.id,
        studentId: student.studentId,
        role: student.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const { password: _, ...studentData } = student;
    return {
        token,
        student: studentData,
    };
};
exports.studentLogin = studentLogin;
const studentSignup = async (payload) => {
    const verifiedOTP = await prisma_1.prisma.oTP.findFirst({
        where: {
            email: payload.email,
            verified: true,
        },
    });
    if (!verifiedOTP) {
        throw new Error("Email not verified");
    }
    const existingStudent = await prisma_1.prisma.student.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (existingStudent) {
        throw new Error("Student already exists");
    }
    const classData = await prisma_1.prisma.class.findUnique({
        where: {
            id: payload.classId,
        },
    });
    if (!classData) {
        throw new Error("Class not found");
    }
    if (existingStudent) {
        throw new Error("Student already exists");
    }
    const board = await prisma_1.prisma.board.findUnique({
        where: {
            id: payload.boardId,
        },
    });
    const session = await prisma_1.prisma.academicSession.findFirst({
        where: {
            status: "ACTIVE",
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
            academicSessionId: session.id,
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
            academicSessionId: session.id,
            studentId,
            password: hashedPassword,
        },
        include: {
            board: true,
            class: true,
            academicSession: true,
        },
    });
    await prisma_1.prisma.oTP.deleteMany({
        where: {
            email: payload.email,
        },
    });
    if (student.email) {
        try {
            await (0, email_service_1.sendEmail)(student.email, "Welcome to NBCA", (0, welcome_student_template_1.welcomeStudentTemplate)({
                name: student.name,
                studentId: student.studentId,
                email: student.email,
                board: board.name,
                className: classData.name,
            }));
        }
        catch (error) {
            console.error("Welcome email failed:", error);
        }
    }
    const { password, ...studentData } = student;
    const token = jsonwebtoken_1.default.sign({
        id: student.id,
        studentId: student.studentId,
        role: student.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        message: "Student registered successfully",
        token,
        student: studentData,
    };
};
exports.studentSignup = studentSignup;
const resetPassword = async (email, password) => {
    const verifiedOTP = await prisma_1.prisma.oTP.findFirst({
        where: {
            email,
            verified: true,
        },
    });
    if (!verifiedOTP) {
        throw new Error("OTP not verified");
    }
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            email,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await prisma_1.prisma.student.update({
        where: {
            email,
        },
        data: {
            password: hashedPassword,
        },
    });
    await prisma_1.prisma.oTP.deleteMany({
        where: {
            email,
        },
    });
    return {
        message: "Password reset successfully",
    };
};
exports.resetPassword = resetPassword;
