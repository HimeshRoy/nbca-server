"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = exports.deleteTeacher = exports.updateTeacher = exports.getTeacherById = exports.getAllTeachers = exports.createTeacher = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_service_1 = require("../../services/email/email.service");
const welcome_teacher_template_1 = require("../../services/email/templates/welcome-teacher.template");
const createTeacher = async (payload) => {
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const teacher = await prisma_1.prisma.teacher.create({
        data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            qualification: payload.qualification,
            experience: payload.experience,
            bio: payload.bio,
            photo: payload.photo,
            password: hashedPassword,
            classes: {
                connect: payload.classIds?.map((id) => ({
                    id,
                })) || [],
            },
            subjects: {
                connect: payload.subjectIds?.map((id) => ({
                    id,
                })) || [],
            },
        },
    });
    try {
        await (0, email_service_1.sendEmail)(teacher.email, "Welcome to NBCA", (0, welcome_teacher_template_1.welcomeTeacherTemplate)({
            name: teacher.name,
            email: teacher.email,
        }));
    }
    catch (error) {
        console.log("EMAIL FAILED");
        console.error(error);
        console.log(error?.message);
    }
    const { password, ...teacherData } = teacher;
    return teacherData;
};
exports.createTeacher = createTeacher;
const getAllTeachers = async () => {
    return prisma_1.prisma.teacher.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            qualification: true,
            experience: true,
            bio: true,
            role: true,
            isActive: true,
            classes: true,
            subjects: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.getAllTeachers = getAllTeachers;
const getTeacherById = async (id) => {
    return prisma_1.prisma.teacher.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            qualification: true,
            experience: true,
            bio: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            subjects: true,
            classes: true,
        },
    });
};
exports.getTeacherById = getTeacherById;
const updateTeacher = async (id, payload) => {
    if (payload.password) {
        payload.password = await bcrypt_1.default.hash(payload.password, 10);
    }
    return prisma_1.prisma.teacher.update({
        where: { id },
        data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            photo: payload.photo,
            qualification: payload.qualification,
            experience: payload.experience,
            bio: payload.bio,
            isActive: payload.isActive,
            ...(payload.password && {
                password: payload.password,
            }),
            ...(payload.classIds && {
                classes: {
                    set: payload.classIds.map((id) => ({
                        id,
                    })),
                },
            }),
            ...(payload.subjectIds && {
                subjects: {
                    set: payload.subjectIds.map((id) => ({
                        id,
                    })),
                },
            }),
        },
    });
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (id) => {
    return prisma_1.prisma.teacher.delete({
        where: {
            id,
        },
    });
};
exports.deleteTeacher = deleteTeacher;
const getMyProfile = async (teacherId) => {
    return prisma_1.prisma.teacher.findUnique({
        where: {
            id: teacherId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            qualification: true,
            experience: true,
            bio: true,
            isActive: true,
            classes: {
                include: {
                    board: true,
                },
            },
            subjects: {
                include: {
                    class: true,
                    board: true,
                },
            },
            createdAt: true,
        },
    });
};
exports.getMyProfile = getMyProfile;
