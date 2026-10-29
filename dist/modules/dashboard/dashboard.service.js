"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentDashboard = exports.getAdminDashboard = exports.getTeacherDashboard = void 0;
const prisma_1 = require("../../config/prisma");
const getTeacherDashboard = async (teacherId) => {
    const teacher = await prisma_1.prisma.teacher.findUnique({
        where: {
            id: teacherId,
        },
        include: {
            subjects: true,
            classes: true,
        },
    });
    const assignments = await prisma_1.prisma.assignment.count({
        where: {
            teacherId,
        },
    });
    const tests = await prisma_1.prisma.test.count({
        where: {
            teacherId,
        },
    });
    const liveClasses = await prisma_1.prisma.liveClass.count({
        where: {
            teacherId,
        },
    });
    const recentNotices = await prisma_1.prisma.notice.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
    });
    const students = await prisma_1.prisma.student.count({
        where: {
            teacherId,
        },
    });
    return {
        subjects: teacher?.subjects.length || 0,
        classes: teacher?.classes.length || 0,
        assignments,
        tests,
        students,
        liveClasses,
        recentNotices,
    };
};
exports.getTeacherDashboard = getTeacherDashboard;
const getAdminDashboard = async () => {
    const totalStudents = await prisma_1.prisma.student.count();
    const totalTeachers = await prisma_1.prisma.teacher.count();
    const totalAssignments = await prisma_1.prisma.assignment.count();
    const totalTests = await prisma_1.prisma.test.count();
    const totalNotices = await prisma_1.prisma.notice.count();
    const totalClasses = await prisma_1.prisma.class.count();
    const totalSubject = await prisma_1.prisma.subject.count();
    const upcomingLiveClasses = await prisma_1.prisma.liveClass.count({
        where: {
            startTime: {
                gte: new Date(),
            },
        },
    });
    return {
        totalStudents,
        totalTeachers,
        totalAssignments,
        totalTests,
        totalNotices,
        upcomingLiveClasses,
        totalClasses,
        totalSubject,
    };
};
exports.getAdminDashboard = getAdminDashboard;
const getStudentDashboard = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
        include: {
            board: true,
            class: true,
        },
    });
    const completedLiveClasses = await prisma_1.prisma.liveClass.count({
        where: {
            classId: student.classId,
            isActive: true,
            endTime: {
                lt: new Date(),
            },
        },
    });
    const presentAttendance = await prisma_1.prisma.attendance.count({
        where: {
            studentId,
            status: "PRESENT",
            liveClassId: {
                not: null,
            },
        },
    });
    const attendancePercentage = completedLiveClasses > 0
        ? Number(((presentAttendance / completedLiveClasses) * 100).toFixed(2))
        : 0;
    const assignmentsSubmitted = await prisma_1.prisma.assignmentSubmission.count({
        where: {
            studentId,
        },
    });
    const totalAssignments = await prisma_1.prisma.assignment.count();
    const assignmentsPending = totalAssignments - assignmentsSubmitted;
    const testsAttempted = await prisma_1.prisma.testAttempt.count({
        where: {
            studentId,
        },
    });
    const testScores = await prisma_1.prisma.testAttempt.findMany({
        where: {
            studentId,
        },
    });
    const averageScore = testScores.length > 0
        ? Number((testScores.reduce((sum, test) => sum + test.score, 0) /
            testScores.length).toFixed(2))
        : 0;
    const upcomingClasses = await prisma_1.prisma.liveClass.findMany({
        where: {
            startTime: {
                gte: new Date(),
            },
            isActive: true,
        },
        take: 5,
        orderBy: {
            startTime: "asc",
        },
    });
    const recentNotices = await prisma_1.prisma.notice.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
    });
    return {
        student: {
            name: student?.name,
            studentId: student?.studentId,
            photo: student?.photo,
            class: student?.class.name,
            board: student?.board.name,
        },
        attendancePercentage,
        assignmentsSubmitted,
        assignmentsPending,
        testsAttempted,
        averageScore,
        upcomingClasses,
        recentNotices,
    };
};
exports.getStudentDashboard = getStudentDashboard;
