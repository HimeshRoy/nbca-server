"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveClassStatsController = exports.getLiveClassAttendanceController = exports.joinLiveClassController = exports.getStudentLiveClassesController = exports.getUpcomingClassesController = exports.endLiveClassController = exports.deleteLiveClassController = exports.updateLiveClassController = exports.getLiveClassByIdController = exports.getLiveClassesController = exports.createLiveClassController = void 0;
const live_class_service_1 = require("./live-class.service");
const createLiveClassController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.createLiveClass)(user.id, req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createLiveClassController = createLiveClassController;
const getLiveClassesController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.getLiveClasses)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getLiveClassesController = getLiveClassesController;
const getLiveClassByIdController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.getLiveClassById)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getLiveClassByIdController = getLiveClassByIdController;
const updateLiveClassController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.updateLiveClass)(user.id, req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateLiveClassController = updateLiveClassController;
const deleteLiveClassController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.deleteLiveClass)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteLiveClassController = deleteLiveClassController;
const endLiveClassController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.endLiveClass)(user.id, req.params.id);
    res.status(200).json({
        success: true,
        message: "Live class ended successfully.",
        data: result,
    });
};
exports.endLiveClassController = endLiveClassController;
const getUpcomingClassesController = async (req, res) => {
    const result = await (0, live_class_service_1.getUpcomingClasses)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getUpcomingClassesController = getUpcomingClassesController;
const getStudentLiveClassesController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.getStudentLiveClasses)(user.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getStudentLiveClassesController = getStudentLiveClassesController;
const joinLiveClassController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.joinLiveClass)(user.id, req.params.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.joinLiveClassController = joinLiveClassController;
const getLiveClassAttendanceController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.getLiveClassAttendance)(user.id, req.params.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getLiveClassAttendanceController = getLiveClassAttendanceController;
const getLiveClassStatsController = async (req, res) => {
    const user = req.user;
    const result = await (0, live_class_service_1.getLiveClassStats)(user.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getLiveClassStatsController = getLiveClassStatsController;
