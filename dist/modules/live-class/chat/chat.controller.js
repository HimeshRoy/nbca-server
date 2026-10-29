"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveClassroomChatController = exports.getClassroomChatController = void 0;
const chat_service_1 = require("./chat.service");
const getClassroomChatController = async (req, res) => {
    try {
        const liveClassId = req.params.liveClassId;
        if (!liveClassId) {
            return res.status(400).json({
                message: "Live class ID is required",
            });
        }
        const messages = await (0, chat_service_1.getClassroomChat)(liveClassId);
        return res.status(200).json({
            messages,
        });
    }
    catch (error) {
        console.error("Get classroom chat error:", error);
        return res.status(500).json({
            message: "Failed to load classroom chat",
        });
    }
};
exports.getClassroomChatController = getClassroomChatController;
const saveClassroomChatController = async (req, res) => {
    try {
        const liveClassId = req.params.liveClassId;
        const { identity, name, message, timestamp, } = req.body;
        if (!liveClassId ||
            !identity ||
            !name ||
            !message) {
            return res.status(400).json({
                message: "liveClassId, identity, name and message are required",
            });
        }
        const chatMessage = {
            id: crypto.randomUUID(),
            identity,
            name,
            message: message.trim(),
            timestamp: timestamp || Date.now(),
        };
        const savedMessage = await (0, chat_service_1.saveClassroomChatMessage)(liveClassId, chatMessage);
        return res.status(201).json({
            message: savedMessage,
        });
    }
    catch (error) {
        console.error("Save classroom chat error:", error);
        return res.status(500).json({
            message: "Failed to save classroom chat",
        });
    }
};
exports.saveClassroomChatController = saveClassroomChatController;
