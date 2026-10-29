"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentChapterResources = exports.getStudentResources = exports.deleteResource = exports.updateResource = exports.getResourceById = exports.getAllResources = exports.createResource = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const createResource = async (payload) => {
    return prisma_1.prisma.resource.create({
        data: payload,
        include: {
            content: true,
        },
    });
};
exports.createResource = createResource;
const getAllResources = async () => {
    return prisma_1.prisma.resource.findMany({
        include: {
            content: true,
        },
    });
};
exports.getAllResources = getAllResources;
const getResourceById = async (id) => {
    return prisma_1.prisma.resource.findUnique({
        where: {
            id,
        },
        include: {
            content: true,
        },
    });
};
exports.getResourceById = getResourceById;
const updateResource = async (id, payload) => {
    return prisma_1.prisma.resource.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateResource = updateResource;
const deleteResource = async (id) => {
    const resource = await prisma_1.prisma.resource.findUnique({
        where: {
            id,
        },
    });
    if (!resource) {
        throw new Error("Resource not found");
    }
    // Delete the Cloudinary file first
    if (resource.fileUrl) {
        try {
            await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(resource.fileUrl);
        }
        catch (error) {
            console.error("Failed to delete Resource file from Cloudinary:", error);
            throw new Error("Failed to delete resource file");
        }
    }
    // Delete the database record
    return prisma_1.prisma.resource.delete({
        where: {
            id,
        },
    });
};
exports.deleteResource = deleteResource;
const getStudentResources = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    return prisma_1.prisma.resource.findMany({
        where: {
            content: {
                chapter: {
                    subject: {
                        classId: student.classId,
                        boardId: student.boardId,
                    },
                },
            },
        },
        include: {
            content: {
                include: {
                    chapter: {
                        include: {
                            subject: {
                                include: {
                                    board: true,
                                    class: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getStudentResources = getStudentResources;
const getStudentChapterResources = async (studentId, chapterId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    return prisma_1.prisma.resource.findMany({
        where: {
            content: {
                chapterId,
                chapter: {
                    subject: {
                        classId: student.classId,
                        boardId: student.boardId,
                    },
                },
            },
        },
        include: {
            content: {
                include: {
                    chapter: {
                        include: {
                            subject: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getStudentChapterResources = getStudentChapterResources;
