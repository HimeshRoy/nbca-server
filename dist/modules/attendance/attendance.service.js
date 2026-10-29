"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markLiveClassLeave = exports.markLiveClassJoin = exports.getMyAttendance = exports.getAttendance = exports.createAttendance = void 0;
const prisma_1 = require("../../config/prisma");
const createAttendance = async (teacherId, payload) => {
    const today = new Date();
    const existingAttendance = await prisma_1.prisma.attendance.findFirst({
        where: {
            studentId: payload.studentId,
            date: {
                gte: new Date(today.setHours(0, 0, 0, 0)),
                lte: new Date(today.setHours(23, 59, 59, 999)),
            },
            ...(payload.liveClassId
                ? {
                    liveClassId: payload.liveClassId,
                }
                : {}),
        },
    });
    if (existingAttendance) {
        throw new Error("Attendance already marked");
    }
    return prisma_1.prisma.attendance.create({
        data: {
            studentId: payload.studentId,
            status: payload.status,
            teacherId,
            liveClassId: payload.liveClassId || null,
            date: new Date(),
        },
        include: {
            student: true,
            teacher: true,
            liveClass: true,
        },
    });
};
exports.createAttendance = createAttendance;
const getAttendance = async (teacherId) => {
    return prisma_1.prisma.attendance.findMany({
        where: {
            teacherId,
        },
        include: {
            student: true,
            liveClass: true,
        },
        orderBy: {
            date: "desc",
        },
    });
};
exports.getAttendance = getAttendance;
const getMyAttendance = async (studentId) => {
    return prisma_1.prisma.attendance.findMany({
        where: {
            studentId,
        },
        include: {
            liveClass: true,
        },
        orderBy: {
            date: "desc",
        },
    });
};
exports.getMyAttendance = getMyAttendance;
/* -----------------------------------------
   LIVE CLASS ATTENDANCE
------------------------------------------ */
const markLiveClassJoin = async (studentId, liveClassId) => {
    const liveClass = await prisma_1.prisma.liveClass.findUnique({
        where: {
            id: liveClassId,
        },
    });
    if (!liveClass) {
        throw new Error("Live class not found");
    }
    const existingAttendance = await prisma_1.prisma.attendance.findUnique({
        where: {
            studentId_liveClassId: {
                studentId,
                liveClassId,
            },
        },
    });
    if (existingAttendance) {
        return existingAttendance;
    }
    return prisma_1.prisma.attendance.create({
        data: {
            studentId,
            teacherId: liveClass.teacherId,
            liveClassId,
            date: new Date(),
            status: "PRESENT",
            joinedAt: new Date(),
        },
    });
};
exports.markLiveClassJoin = markLiveClassJoin;
const markLiveClassLeave = async (studentId, liveClassId) => {
    const attendance = await prisma_1.prisma.attendance.findUnique({
        where: {
            studentId_liveClassId: {
                studentId,
                liveClassId,
            },
        },
    });
    if (!attendance) {
        return null;
    }
    if (!attendance.joinedAt) {
        return attendance;
    }
    const leftAt = new Date();
    const duration = Math.max(0, Math.floor((leftAt.getTime() -
        attendance.joinedAt.getTime()) /
        1000));
    return prisma_1.prisma.attendance.update({
        where: {
            id: attendance.id,
        },
        data: {
            leftAt,
            duration,
        },
    });
};
exports.markLiveClassLeave = markLiveClassLeave;
