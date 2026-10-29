"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const livekit_controller_1 = require("./livekit.controller");
const router = (0, express_1.Router)();
router.post("/token", livekit_controller_1.generateLiveKitTokenController);
exports.default = router;
