"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const livekit_webhook_controller_1 = require("./livekit-webhook.controller");
const router = (0, express_1.Router)();
router.post("/webhook", livekit_webhook_controller_1.liveKitWebhookController);
exports.default = router;
