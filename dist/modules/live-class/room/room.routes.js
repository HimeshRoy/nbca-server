"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const room_controller_1 = require("./room.controller");
const router = (0, express_1.Router)();
router.post("/:id/join", (0, auth_1.auth)("TEACHER", "STUDENT"), room_controller_1.joinLiveClassRoomController);
exports.default = router;
