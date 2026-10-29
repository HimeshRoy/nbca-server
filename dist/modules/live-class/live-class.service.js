"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveClassStats = exports.getLiveClassAttendance = exports.joinLiveClass = exports.getStudentLiveClasses = exports.getUpcomingClasses = exports.endLiveClass = exports.deleteLiveClass = exports.updateLiveClass = exports.getLiveClassById = exports.getLiveClasses = exports.createLiveClass = void 0;
const prisma_1 = require("../../config/prisma");
const email_service_1 = require("../../services/email/email.service");
const live_class_template_1 = require("../../services/email/templates/live-class.template");
const chat_service_1 = require("./chat/chat.service");
/**
 * Parse and validate a date value.
 */
const parseDate = (value, fieldName) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error(`${fieldName} must be a valid date.`);
    }
    return date;
};
/**
 * Calculate the current live-class status.
 *
 * Priority:
 * 1. Manually ended / inactive class -> COMPLETED
 * 2. Before start time -> UPCOMING
 * 3. Between start and end -> LIVE
 * 4. After end time -> COMPLETED
 */
const getLiveClassStatus = (isActive, startTime, endTime, now) => {
    if (!isActive) {
        return "COMPLETED";
    }
    if (now < startTime) {
        return "UPCOMING";
    }
    if (now <= endTime) {
        return "LIVE";
    }
    return "COMPLETED";
};
/**
 * Create a new live class.
 */
const createLiveClass = async (teacherId, payload) => {
    const startTime = parseDate(payload.startTime, "Start time");
    const endTime = parseDate(payload.endTime, "End time");
    if (startTime >= endTime) {
        throw new Error("End time must be later than the start time.");
    }
    /**
     * Prevent the same teacher from having
     * overlapping active classes.
     */
    const existingClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            teacherId,
            isActive: true,
            AND: [
                {
                    startTime: {
                        lt: endTime,
                    },
                },
                {
                    endTime: {
                        gt: startTime,
                    },
                },
            ],
        },
    });
    if (existingClass) {
        throw new Error("You already have another live class scheduled during this time.");
    }
    const liveClass = await prisma_1.prisma.liveClass.create({
        data: {
            title: payload.title,
            description: payload.description,
            startTime,
            endTime,
            teacherId,
            classId: payload.classId,
            subjectId: payload.subjectId,
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
        },
    });
    /**
     * Get active students from the selected class
     * so they can receive the live-class email.
     */
    const students = await prisma_1.prisma.student.findMany({
        where: {
            classId: payload.classId,
            isActive: true,
        },
    });
    await Promise.all(students
        .filter((student) => student.email)
        .map((student) => (0, email_service_1.sendEmail)(student.email, `New Live Class - ${liveClass.title}`, (0, live_class_template_1.liveClassTemplate)(student.name, liveClass.title, liveClass.subject.name, liveClass.teacher.name, liveClass.startTime))));
    return liveClass;
};
exports.createLiveClass = createLiveClass;
/**
 * Get all live classes created by a teacher.
 */
const getLiveClasses = async (teacherId) => {
    return prisma_1.prisma.liveClass.findMany({
        where: {
            teacherId,
        },
        include: {
            class: {
                include: {
                    board: true,
                },
            },
            subject: true,
            teacher: true,
        },
        orderBy: {
            startTime: "asc",
        },
    });
};
exports.getLiveClasses = getLiveClasses;
/**
 * Get a single live class belonging to a teacher.
 */
const getLiveClassById = async (teacherId, id) => {
    return prisma_1.prisma.liveClass.findFirst({
        where: {
            id,
            teacherId,
        },
        include: {
            class: {
                include: {
                    board: true,
                },
            },
            subject: true,
            teacher: true,
        },
    });
};
exports.getLiveClassById = getLiveClassById;
/**
 * Update a live class.
 */
const updateLiveClass = async (teacherId, id, payload) => {
    const startTime = parseDate(payload.startTime, "Start time");
    const endTime = parseDate(payload.endTime, "End time");
    if (startTime >= endTime) {
        throw new Error("End time must be later than the start time.");
    }
    const liveClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!liveClass) {
        throw new Error("Live class not found.");
    }
    /**
     * Prevent overlapping active classes
     * for the same teacher.
     *
     * The current class is excluded.
     */
    const existingClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            teacherId,
            id: {
                not: id,
            },
            isActive: true,
            AND: [
                {
                    startTime: {
                        lt: endTime,
                    },
                },
                {
                    endTime: {
                        gt: startTime,
                    },
                },
            ],
        },
    });
    if (existingClass) {
        throw new Error("You already have another live class scheduled during this time.");
    }
    return prisma_1.prisma.liveClass.update({
        where: {
            id,
        },
        data: {
            title: payload.title,
            description: payload.description,
            startTime,
            endTime,
            classId: payload.classId,
            subjectId: payload.subjectId,
            /**
             * Preserve existing isActive behaviour.
             *
             * Normal editing does not change the active
             * state unless the frontend explicitly sends it.
             */
            ...(typeof payload.isActive === "boolean"
                ? {
                    isActive: payload.isActive,
                }
                : {}),
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
        },
    });
};
exports.updateLiveClass = updateLiveClass;
/**
 * Delete a live class.
 */
const deleteLiveClass = async (teacherId, id) => {
    const liveClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!liveClass) {
        throw new Error("Live Class not found");
    }
    return prisma_1.prisma.liveClass.delete({
        where: {
            id,
        },
    });
};
exports.deleteLiveClass = deleteLiveClass;
/**
 * End a currently running live class.
 *
 * IMPORTANT:
 * When a teacher manually ends a class:
 *
 * isActive = false
 * endTime = current time
 *
 * This prevents the teacher and student sides
 * from showing contradictory LIVE/COMPLETED states.
 */
const endLiveClass = async (teacherId, id) => {
    const liveClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!liveClass) {
        throw new Error("Live class not found");
    }
    /**
     * If the class is already inactive,
     * simply return it.
     *
     * This makes the endpoint safe against
     * duplicate End Class requests.
     */
    if (!liveClass.isActive) {
        return liveClass;
    }
    /**
     * Delete temporary classroom chat.
     */
    await (0, chat_service_1.clearClassroomChat)(id);
    /**
     * Manually end the class.
     *
     * The actual end time becomes the time
     * when the teacher clicked End Class.
     */
    const endedClass = await prisma_1.prisma.liveClass.update({
        where: {
            id,
        },
        data: {
            isActive: false,
            endTime: new Date(),
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
        },
    });
    return endedClass;
};
exports.endLiveClass = endLiveClass;
/**
 * Get upcoming classes.
 */
const getUpcomingClasses = async () => {
    const now = new Date();
    return prisma_1.prisma.liveClass.findMany({
        where: {
            startTime: {
                gte: now,
            },
            isActive: true,
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
        },
        orderBy: {
            startTime: "asc",
        },
    });
};
exports.getUpcomingClasses = getUpcomingClasses;
/**
 * Get live classes for a student.
 *
 * IMPORTANT:
 * We intentionally DO NOT filter by isActive here.
 *
 * Why?
 *
 * The student page has:
 * - UPCOMING
 * - LIVE
 * - COMPLETED
 *
 * Therefore completed classes must also be returned.
 *
 * A manually ended class has isActive=false and will
 * correctly appear as COMPLETED.
 */
const getStudentLiveClasses = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
        select: {
            id: true,
            name: true,
            classId: true,
            isActive: true,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    if (!student.isActive) {
        throw new Error("Student account is inactive");
    }
    const now = new Date();
    /**
     * Get all live classes belonging to
     * the student's class.
     */
    const liveClasses = await prisma_1.prisma.liveClass.findMany({
        where: {
            classId: student.classId,
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
            attendances: {
                where: {
                    studentId,
                },
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });
    return liveClasses.map((liveClass) => {
        /**
         * Student can join 10 minutes
         * before the scheduled start.
         */
        const joinTime = new Date(liveClass.startTime);
        joinTime.setMinutes(joinTime.getMinutes() - 10);
        const status = getLiveClassStatus(liveClass.isActive, liveClass.startTime, liveClass.endTime, now);
        return {
            ...liveClass,
            status,
            /**
             * Student can join only when:
             *
             * 1. Class is active
             * 2. Join window has started
             * 3. Class has not ended
             */
            canJoin: liveClass.isActive &&
                now >= joinTime &&
                now <= liveClass.endTime,
            hasAttended: liveClass.attendances.length > 0,
        };
    });
};
exports.getStudentLiveClasses = getStudentLiveClasses;
/**
 * Legacy student join validation.
 *
 * The actual classroom connection is handled
 * by the LiveKit room token flow.
 */
const joinLiveClass = async (studentId, liveClassId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    if (!student.isActive) {
        throw new Error("Student account is inactive");
    }
    const liveClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            id: liveClassId,
            classId: student.classId,
            isActive: true,
        },
        include: {
            teacher: true,
            class: true,
            subject: true,
        },
    });
    if (!liveClass) {
        throw new Error("You are not allowed to access this class.");
    }
    const now = new Date();
    /**
     * Same 10-minute join window used
     * by getStudentLiveClasses().
     */
    const joinTime = new Date(liveClass.startTime);
    const JOIN_WINDOW_MINUTES = 10;
    joinTime.setMinutes(joinTime.getMinutes() -
        JOIN_WINDOW_MINUTES);
    if (now < joinTime) {
        throw new Error("You can join this class only 10 minutes before it starts.");
    }
    if (now > liveClass.endTime) {
        throw new Error("This live class has already ended.");
    }
    return {
        message: "Live class access granted.",
        liveClass,
    };
};
exports.joinLiveClass = joinLiveClass;
/**
 * Get attendance for a specific live class.
 */
const getLiveClassAttendance = async (teacherId, liveClassId) => {
    const liveClass = await prisma_1.prisma.liveClass.findFirst({
        where: {
            id: liveClassId,
            teacherId,
        },
    });
    if (!liveClass) {
        throw new Error("Live class not found");
    }
    return prisma_1.prisma.attendance.findMany({
        where: {
            liveClassId,
        },
        include: {
            student: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
exports.getLiveClassAttendance = getLiveClassAttendance;
/**
 * Get live-class statistics for a teacher.
 */
const getLiveClassStats = async (teacherId) => {
    const now = new Date();
    /**
     * Total classes created by teacher.
     */
    const totalClasses = await prisma_1.prisma.liveClass.count({
        where: {
            teacherId,
        },
    });
    /**
     * Upcoming means:
     * - still active
     * - start time is in the future
     */
    const upcomingClasses = await prisma_1.prisma.liveClass.count({
        where: {
            teacherId,
            isActive: true,
            startTime: {
                gt: now,
            },
        },
    });
    /**
     * Completed means either:
     *
     * 1. Teacher manually ended it
     *    -> isActive=false
     *
     * OR
     *
     * 2. Scheduled end time has passed.
     */
    const completedClasses = await prisma_1.prisma.liveClass.count({
        where: {
            teacherId,
            OR: [
                {
                    isActive: false,
                },
                {
                    endTime: {
                        lt: now,
                    },
                },
            ],
        },
    });
    /**
     * Total attendance records belonging
     * to live classes.
     */
    const totalAttendance = await prisma_1.prisma.attendance.count({
        where: {
            teacherId,
            liveClassId: {
                not: null,
            },
        },
    });
    return {
        totalClasses,
        upcomingClasses,
        completedClasses,
        totalAttendance,
    };
};
exports.getLiveClassStats = getLiveClassStats;
