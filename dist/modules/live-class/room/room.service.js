"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLiveClassRoomToken = void 0;
const prisma_1 = require("../../../config/prisma");
const livekit_service_1 = require("../../../services/livekit/livekit.service");
const removal_service_1 = require("../removal/removal.service");
const attendance_service_1 = require("../../attendance/attendance.service");
const createLiveClassRoomToken = async (liveClassId, userId, role) => {
    const liveClass = await prisma_1.prisma.liveClass.findUnique({
        where: {
            id: liveClassId,
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
        },
    });
    if (!liveClass) {
        throw new Error("Live class not found");
    }
    let displayName = "";
    /*
     * TEACHER ACCESS
     */
    if (role === "TEACHER") {
        if (liveClass.teacherId !== userId) {
            throw new Error("You are not authorized to join this class");
        }
        displayName = liveClass.teacher.name;
    }
    /*
     * STUDENT ACCESS
     */
    if (role === "STUDENT") {
        const student = await prisma_1.prisma.student.findUnique({
            where: {
                id: userId,
            },
        });
        if (!student) {
            throw new Error("Student not found");
        }
        if (student.classId !== liveClass.classId) {
            throw new Error("You are not enrolled in this class");
        }
        const removed = await (0, removal_service_1.isStudentRemoved)(liveClass.id, userId);
        if (removed) {
            throw new Error("You have been removed from this classroom");
        }
        await (0, attendance_service_1.markLiveClassJoin)(userId, liveClass.id);
        displayName = student.name;
    }
    if (!displayName) {
        throw new Error("Participant name not found");
    }
    /*
     * Generate a stable room name.
     *
     * Every participant joining the same LiveClass
     * must receive the same room name.
     */
    const roomName = `nbca-live-class-${liveClass.id}`;
    const token = await (0, livekit_service_1.createLiveKitToken)(userId, roomName, role, displayName);
    return {
        token,
        url: process.env.LIVEKIT_URL,
        roomName,
        liveClassId: liveClass.id,
        role,
        displayName,
        liveClass: {
            id: liveClass.id,
            title: liveClass.title,
            description: liveClass.description,
            teacher: liveClass.teacher,
            class: liveClass.class,
            subject: liveClass.subject,
            startTime: liveClass.startTime,
            endTime: liveClass.endTime,
            isActive: liveClass.isActive,
        },
    };
};
exports.createLiveClassRoomToken = createLiveClassRoomToken;
