"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClassController = exports.updateClassController = exports.getClassByIdController = exports.getAllClassesController = exports.createClassController = void 0;
const class_service_1 = require("./class.service");
const createClassController = async (req, res) => {
    const result = await (0, class_service_1.createClass)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createClassController = createClassController;
const getAllClassesController = async (req, res) => {
    const result = await (0, class_service_1.getAllClasses)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getAllClassesController = getAllClassesController;
const getClassByIdController = async (req, res) => {
    const result = await (0, class_service_1.getClassById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getClassByIdController = getClassByIdController;
const updateClassController = async (req, res) => {
    const result = await (0, class_service_1.updateClass)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateClassController = updateClassController;
const deleteClassController = async (req, res) => {
    const result = await (0, class_service_1.deleteClass)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteClassController = deleteClassController;
