"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherResourceStats = exports.uploadTeacherResource = exports.deleteTeacherResource = exports.updateTeacherResource = exports.getTeacherResourceById = exports.getTeacherResources = exports.createTeacherResource = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const createTeacherResource = async (teacherId, payload) => {
    return prisma_1.prisma.resource.create({
        data: {
            ...payload,
            teacherId,
        },
        include: {
            teacher: true,
            content: true,
        },
    });
};
exports.createTeacherResource = createTeacherResource;
const getTeacherResources = async (teacherId) => {
    return prisma_1.prisma.resource.findMany({
        where: {
            teacherId,
        },
        include: {
            content: {
                include: {
                    chapter: {
                        include: {
                            subject: {
                                include: {
                                    class: {
                                        include: {
                                            board: true,
                                        },
                                    },
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
exports.getTeacherResources = getTeacherResources;
const getTeacherResourceById = async (teacherId, id) => {
    return prisma_1.prisma.resource.findFirst({
        where: {
            id,
            teacherId,
        },
        include: {
            content: {
                include: {
                    chapter: {
                        include: {
                            subject: {
                                include: {
                                    class: {
                                        include: {
                                            board: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
};
exports.getTeacherResourceById = getTeacherResourceById;
const updateTeacherResource = async (teacherId, id, payload) => {
    const resource = await prisma_1.prisma.resource.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!resource) {
        throw new Error("Resource not found");
    }
    return prisma_1.prisma.resource.update({
        where: {
            id,
        },
        data: payload,
    });
};
exports.updateTeacherResource = updateTeacherResource;
const deleteTeacherResource = async (teacherId, id) => {
    const resource = await prisma_1.prisma.resource.findFirst({
        where: {
            id,
            teacherId,
        },
    });
    if (!resource) {
        throw new Error("Resource not found");
    }
    // Delete the file from Cloudinary
    if (resource.fileUrl) {
        try {
            await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(resource.fileUrl);
        }
        catch (error) {
            console.error("Failed to delete teacher resource file from Cloudinary:", error);
            throw new Error("Failed to delete teacher resource file");
        }
    }
    // Delete the database record
    return prisma_1.prisma.resource.delete({
        where: {
            id,
        },
    });
};
exports.deleteTeacherResource = deleteTeacherResource;
const uploadTeacherResource = async (teacherId, payload) => {
    return prisma_1.prisma.resource.create({
        data: {
            ...payload,
            teacherId,
        },
        include: {
            teacher: true,
            content: true,
        },
    });
};
exports.uploadTeacherResource = uploadTeacherResource;
const getTeacherResourceStats = async (teacherId) => {
    const totalResources = await prisma_1.prisma.resource.count({
        where: {
            teacherId,
        },
    });
    const pdfs = await prisma_1.prisma.resource.count({
        where: {
            teacherId,
            type: "PDF",
        },
    });
    const videos = await prisma_1.prisma.resource.count({
        where: {
            teacherId,
            type: "VIDEO",
        },
    });
    const published = await prisma_1.prisma.resource.count({
        where: {
            teacherId,
            isPublished: true,
        },
    });
    return {
        totalResources,
        pdfs,
        videos,
        published,
    };
};
exports.getTeacherResourceStats = getTeacherResourceStats;
