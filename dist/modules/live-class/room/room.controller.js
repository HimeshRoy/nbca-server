"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinLiveClassRoomController = void 0;
const room_service_1 = require("./room.service");
const joinLiveClassRoomController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const userId = user.id;
        const role = user.role;
        if (role !== "TEACHER" && role !== "STUDENT") {
            return res.status(403).json({
                success: false,
                message: "Invalid classroom role",
            });
        }
        const result = await (0, room_service_1.createLiveClassRoomToken)(id, userId, role);
        return res.status(200).json({
            success: true,
            message: "Successfully joined classroom",
            data: result,
        });
    }
    catch (error) {
        console.error("Join Live Class Room Error:", error);
        if (error.message === "Live class not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        if (error.message ===
            "You are not authorized to join this class" ||
            error.message ===
                "You are not enrolled in this class") {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to join classroom",
        });
    }
};
exports.joinLiveClassRoomController = joinLiveClassRoomController;
