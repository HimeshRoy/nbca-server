"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateSubmission = exports.getAssignmentSubmissions = exports.getMySubmissions = exports.submitAssignment = void 0;
const prisma_1 = require("../../config/prisma");
const submitAssignment = async (studentId, assignmentId, payload) => {
    const assignment = await prisma_1.prisma.assignment.findUnique({
        where: {
            id: assignmentId,
        },
    });
    if (!assignment) {
        throw new Error("Assignment not found");
    }
    if (new Date() > assignment.dueDate) {
        throw new Error("Assignment submission deadline has passed.");
    }
    const existingSubmission = await prisma_1.prisma.assignmentSubmission.findFirst({
        where: {
            assignmentId,
            studentId,
        },
    });
    if (existingSubmission) {
        throw new Error("Assignment already submitted");
    }
    return prisma_1.prisma.assignmentSubmission.create({
        data: {
            assignmentId,
            studentId,
            fileUrl: payload.fileUrl,
        },
        include: {
            assignment: true,
            student: true,
        },
    });
};
exports.submitAssignment = submitAssignment;
const getMySubmissions = async (studentId) => {
    return prisma_1.prisma.assignmentSubmission.findMany({
        where: {
            studentId,
        },
        include: {
            assignment: true,
        },
        orderBy: {
            submittedAt: "desc",
        },
    });
};
exports.getMySubmissions = getMySubmissions;
const getAssignmentSubmissions = async (assignmentId) => {
    return prisma_1.prisma.assignmentSubmission.findMany({
        where: {
            assignmentId,
        },
        include: {
            student: true,
        },
    });
};
exports.getAssignmentSubmissions = getAssignmentSubmissions;
const evaluateSubmission = async (submissionId, payload) => {
    const submission = await prisma_1.prisma.assignmentSubmission.findUnique({
        where: {
            id: submissionId,
        },
    });
    if (!submission) {
        throw new Error("Submission not found");
    }
    if (payload.marks < 0) {
        throw new Error("Invalid marks");
    }
    return prisma_1.prisma.assignmentSubmission.update({
        where: {
            id: submissionId,
        },
        data: {
            marks: payload.marks,
            remarks: payload.remarks,
        },
    });
};
exports.evaluateSubmission = evaluateSubmission;
