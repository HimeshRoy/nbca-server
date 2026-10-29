"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoardController = exports.updateBoardController = exports.getBoardByIdController = exports.getAllBoardsController = exports.createBoardController = void 0;
const board_service_1 = require("./board.service");
const createBoardController = async (req, res) => {
    const result = await (0, board_service_1.createBoard)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createBoardController = createBoardController;
const getAllBoardsController = async (req, res) => {
    const result = await (0, board_service_1.getAllBoards)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getAllBoardsController = getAllBoardsController;
const getBoardByIdController = async (req, res) => {
    const result = await (0, board_service_1.getBoardById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getBoardByIdController = getBoardByIdController;
const updateBoardController = async (req, res) => {
    const result = await (0, board_service_1.updateBoard)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateBoardController = updateBoardController;
const deleteBoardController = async (req, res) => {
    const result = await (0, board_service_1.deleteBoard)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteBoardController = deleteBoardController;
