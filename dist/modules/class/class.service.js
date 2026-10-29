"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClass = exports.updateClass = exports.getClassById = exports.getAllClasses = exports.createClass = void 0;
const prisma_1 = require("../../config/prisma");
const createClass = async (payload) => {
    return prisma_1.prisma.class.create({
        data: payload,
        include: {
            board: true,
        },
    });
};
exports.createClass = createClass;
const getAllClasses = async () => {
    return prisma_1.prisma.class.findMany({
        include: {
            board: true,
        },
    });
};
exports.getAllClasses = getAllClasses;
const getClassById = async (id) => {
    return prisma_1.prisma.class.findUnique({
        where: { id },
        include: {
            board: true,
        },
    });
};
exports.getClassById = getClassById;
const updateClass = async (id, payload) => {
    return prisma_1.prisma.class.update({
        where: { id },
        data: payload,
        include: {
            board: true,
        },
    });
};
exports.updateClass = updateClass;
const deleteClass = async (id) => {
    return prisma_1.prisma.class.delete({
        where: { id },
    });
};
exports.deleteClass = deleteClass;
