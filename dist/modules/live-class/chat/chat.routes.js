"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
router.get("/:liveClassId", chat_controller_1.getClassroomChatController);
router.post("/:liveClassId", chat_controller_1.saveClassroomChatController);
exports.default = router;
