"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentAssignmentById = exports.getStudentAssignments = exports.deleteAssignment = exports.updateAssignment = exports.getAssignmentById = exports.getAssignments = exports.createAssignment = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const createAssignment = async (teacherId, payload) => {
    return prisma_1.prisma.assignment.create({
        data: {
            title: payload.title,
            description: payload.description,
            fileUrl: payload.fileUrl,
            dueDate: new Date(payload.dueDate),
            maxMarks: payload.maxMarks,
            classId: payload.classId,
            subjectId: payload.subjectId,
            teacherId,
        },
        include: {
            class: {
                include: {
                    board: true,
                },
            },
            subject: true,
        },
    });
};
exports.createAssignment = createAssignment;
const getAssignments = async (teacherId) => {
    return prisma_1.prisma.assignment.findMany({
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
            submissions: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAssignments = getAssignments;
const getAssignmentById = async (teacherId, id) => {
    return prisma_1.prisma.assignment.findFirst({
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
            submissions: {
                include: {
                    student: true,
                },
            },
        },
    });
};
exports.getAssignmentById = getAssignmentById;
const updateAssignment = async (teacherId, id, payload) => {
    const assignment = await prisma_1.prisma.assignment.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!assignment) {
        throw new Error("Assignment not found");
    }
    return prisma_1.prisma.assignment.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateAssignment = updateAssignment;
const deleteAssignment = async (teacherId, id) => {
    const assignment = await prisma_1.prisma.assignment.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!assignment) {
        throw new Error("Assignment not found");
    }
    // Delete the assignment file from Cloudinary
    if (assignment.fileUrl) {
        try {
            await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(assignment.fileUrl);
        }
        catch (error) {
            console.error("Failed to delete assignment file from Cloudinary:", error);
            throw new Error("Failed to delete assignment file");
        }
    }
    // Delete the assignment from the database
    return prisma_1.prisma.assignment.delete({
        where: {
            id,
        },
    });
};
exports.deleteAssignment = deleteAssignment;
const getStudentAssignments = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    const assignments = await prisma_1.prisma.assignment.findMany({
        where: {
            classId: student.classId,
            subject: {
                boardId: student.boardId,
            },
        },
        include: {
            subject: true,
            teacher: {
                select: {
                    id: true,
                    name: true,
                },
            },
            submissions: {
                where: {
                    studentId,
                },
            },
        },
        orderBy: {
            dueDate: "asc",
        },
    });
    return assignments.map((assignment) => ({
        ...assignment,
        status: assignment.submissions.length > 0 ? "SUBMITTED" : "PENDING",
        isOverdue: assignment.submissions.length === 0 &&
            new Date(assignment.dueDate) < new Date(),
    }));
};
exports.getStudentAssignments = getStudentAssignments;
const getStudentAssignmentById = async (studentId, assignmentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    const assignment = await prisma_1.prisma.assignment.findFirst({
        where: {
            id: assignmentId,
            classId: student.classId,
            subject: {
                boardId: student.boardId,
            },
        },
        include: {
            subject: true,
            teacher: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            submissions: {
                where: {
                    studentId,
                },
            },
        },
    });
    if (!assignment) {
        throw new Error("Assignment not found");
    }
    return {
        ...assignment,
        status: assignment.submissions.length > 0 ? "SUBMITTED" : "PENDING",
        submission: assignment.submissions[0] || null,
    };
};
exports.getStudentAssignmentById = getStudentAssignmentById;
