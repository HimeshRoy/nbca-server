"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoard = exports.updateBoard = exports.getBoardById = exports.getAllBoards = exports.createBoard = void 0;
const prisma_1 = require("../../config/prisma");
const createBoard = async (payload) => {
    return prisma_1.prisma.board.create({
        data: payload,
    });
};
exports.createBoard = createBoard;
const getAllBoards = async () => {
    return prisma_1.prisma.board.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllBoards = getAllBoards;
const getBoardById = async (id) => {
    return prisma_1.prisma.board.findUnique({
        where: { id },
    });
};
exports.getBoardById = getBoardById;
const updateBoard = async (id, payload) => {
    return prisma_1.prisma.board.update({
        where: { id },
        data: payload,
    });
};
exports.updateBoard = updateBoard;
const deleteBoard = async (id) => {
    return prisma_1.prisma.board.delete({
        where: { id },
    });
};
exports.deleteBoard = deleteBoard;
