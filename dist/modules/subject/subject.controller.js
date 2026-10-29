"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSubjectsController = exports.deleteSubjectController = exports.updateSubjectController = exports.getSubjectByIdController = exports.getAllSubjectsController = exports.createSubjectController = void 0;
const subject_service_1 = require("./subject.service");
const createSubjectController = async (req, res) => {
    const result = await (0, subject_service_1.createSubject)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createSubjectController = createSubjectController;
const getAllSubjectsController = async (req, res) => {
    const result = await (0, subject_service_1.getAllSubjects)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getAllSubjectsController = getAllSubjectsController;
const getSubjectByIdController = async (req, res) => {
    const result = await (0, subject_service_1.getSubjectById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getSubjectByIdController = getSubjectByIdController;
const updateSubjectController = async (req, res) => {
    const result = await (0, subject_service_1.updateSubject)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateSubjectController = updateSubjectController;
const deleteSubjectController = async (req, res) => {
    const result = await (0, subject_service_1.deleteSubject)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteSubjectController = deleteSubjectController;
const getStudentSubjectsController = async (req, res) => {
    const result = await (0, subject_service_1.getStudentSubjects)(req.user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getStudentSubjectsController = getStudentSubjectsController;
