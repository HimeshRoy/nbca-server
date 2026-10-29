"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentsByChapterController = exports.deleteContentController = exports.updateContentController = exports.getContentByIdController = exports.getAllContentsController = exports.createContentController = void 0;
const content_service_1 = require("./content.service");
const createContentController = async (req, res) => {
    const result = await (0, content_service_1.createContent)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createContentController = createContentController;
const getAllContentsController = async (req, res) => {
    const result = await (0, content_service_1.getAllContents)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getAllContentsController = getAllContentsController;
const getContentByIdController = async (req, res) => {
    const result = await (0, content_service_1.getContentById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getContentByIdController = getContentByIdController;
const updateContentController = async (req, res) => {
    const result = await (0, content_service_1.updateContent)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateContentController = updateContentController;
const deleteContentController = async (req, res) => {
    const result = await (0, content_service_1.deleteContent)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteContentController = deleteContentController;
const getContentsByChapterController = async (req, res) => {
    const result = await (0, content_service_1.getContentsByChapter)(req.params.chapterId);
    res.json({
        success: true,
        data: result,
    });
};
exports.getContentsByChapterController = getContentsByChapterController;
