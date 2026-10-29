"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStudentRemovalController = exports.removeStudentController = void 0;
const prisma_1 = require("../../../config/prisma");
const removal_service_1 = require("./removal.service");
const removeStudentController = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const liveClassId = req.params.liveClassId;
        const studentId = req.params.studentId;
        if (!liveClassId || !studentId) {
            return res.status(400).json({
                message: "Live class ID and student ID are required",
            });
        }
        // Make sure the teacher owns this live class.
        const liveClass = await prisma_1.prisma.liveClass.findFirst({
            where: {
                id: liveClassId,
                teacherId,
            },
        });
        if (!liveClass) {
            return res.status(404).json({
                message: "Live class not found or you are not authorized",
            });
        }
        // Make sure the student exists and belongs
        // to the same class.
        const student = await prisma_1.prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });
        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }
        if (student.classId !== liveClass.classId) {
            return res.status(403).json({
                message: "Student is not enrolled in this class",
            });
        }
        const roomName = `nbca-live-class-${liveClass.id}`;
        await (0, removal_service_1.removeStudentFromClass)(liveClass.id, student.id, roomName);
        return res.status(200).json({
            success: true,
            message: "Student removed from classroom successfully",
        });
    }
    catch (error) {
        console.error("Remove student error:", error);
        return res.status(500).json({
            message: "Failed to remove student from classroom",
        });
    }
};
exports.removeStudentController = removeStudentController;
const checkStudentRemovalController = async (req, res) => {
    try {
        const studentId = req.user.id;
        const liveClassId = req.params.liveClassId;
        if (!liveClassId) {
            return res.status(400).json({
                message: "Live class ID is required",
            });
        }
        const removed = await (0, removal_service_1.isStudentRemoved)(liveClassId, studentId);
        return res.status(200).json({
            removed,
        });
    }
    catch (error) {
        console.error("Check student removal error:", error);
        return res.status(500).json({
            message: "Failed to check classroom removal status",
        });
    }
};
exports.checkStudentRemovalController = checkStudentRemovalController;
