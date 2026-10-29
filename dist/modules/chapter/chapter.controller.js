"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentChaptersController = exports.getChaptersBySubjectController = exports.deleteChapterController = exports.updateChapterController = exports.getChapterByIdController = exports.getAllChaptersController = exports.createChapterController = void 0;
const chapter_service_1 = require("./chapter.service");
const createChapterController = async (req, res) => {
    const result = await (0, chapter_service_1.createChapter)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createChapterController = createChapterController;
const getAllChaptersController = async (req, res) => {
    const result = await (0, chapter_service_1.getAllChapters)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getAllChaptersController = getAllChaptersController;
const getChapterByIdController = async (req, res) => {
    const result = await (0, chapter_service_1.getChapterById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getChapterByIdController = getChapterByIdController;
const updateChapterController = async (req, res) => {
    const result = await (0, chapter_service_1.updateChapter)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateChapterController = updateChapterController;
const deleteChapterController = async (req, res) => {
    const result = await (0, chapter_service_1.deleteChapter)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteChapterController = deleteChapterController;
const getChaptersBySubjectController = async (req, res) => {
    const result = await (0, chapter_service_1.getChaptersBySubject)(req.params.subjectId);
    res.json({
        success: true,
        data: result,
    });
};
exports.getChaptersBySubjectController = getChaptersBySubjectController;
const getStudentChaptersController = async (req, res) => {
    const result = await (0, chapter_service_1.getStudentChapters)(req.user.id, req.params.subjectId);
    res.json({
        success: true,
        data: result,
    });
};
exports.getStudentChaptersController = getStudentChaptersController;
