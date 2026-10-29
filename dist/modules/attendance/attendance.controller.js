"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markLiveClassLeaveController = exports.getMyAttendanceController = exports.getAttendanceController = exports.createAttendanceController = void 0;
const attendance_service_1 = require("./attendance.service");
const createAttendanceController = async (req, res) => {
    const user = req.user;
    const result = await (0, attendance_service_1.createAttendance)(user.id, req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createAttendanceController = createAttendanceController;
const getAttendanceController = async (req, res) => {
    const user = req.user;
    const result = await (0, attendance_service_1.getAttendance)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getAttendanceController = getAttendanceController;
const getMyAttendanceController = async (req, res) => {
    const user = req.user;
    const result = await (0, attendance_service_1.getMyAttendance)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getMyAttendanceController = getMyAttendanceController;
const markLiveClassLeaveController = async (req, res) => {
    try {
        const studentId = req.user.id;
        const liveClassId = req.params.liveClassId;
        if (!liveClassId) {
            return res.status(400).json({
                success: false,
                message: "Live class ID is required",
            });
        }
        const result = await (0, attendance_service_1.markLiveClassLeave)(studentId, liveClassId);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Mark live class leave error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Failed to update live class attendance",
        });
    }
};
exports.markLiveClassLeaveController = markLiveClassLeaveController;
