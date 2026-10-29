"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfileController = exports.deleteTeacherController = exports.updateTeacherController = exports.getTeacherByIdController = exports.getAllTeachersController = exports.createTeacherController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const teacher_service_1 = require("./teacher.service");
exports.createTeacherController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, teacher_service_1.createTeacher)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
});
exports.getAllTeachersController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, teacher_service_1.getAllTeachers)();
    res.json({
        success: true,
        data: result,
    });
});
exports.getTeacherByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, teacher_service_1.getTeacherById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
});
exports.updateTeacherController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, teacher_service_1.updateTeacher)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
});
exports.deleteTeacherController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, teacher_service_1.deleteTeacher)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
});
exports.getMyProfileController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, teacher_service_1.getMyProfile)(req.user.id);
    res.json({
        success: true,
        data: result,
    });
});
