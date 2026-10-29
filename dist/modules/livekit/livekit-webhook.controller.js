"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveKitWebhookController = void 0;
const livekit_webhook_service_1 = require("./livekit-webhook.service");
const liveKitWebhookController = async (req, res) => {
    try {
        const authorization = req.get("Authorization");
        const body = req.body.toString("utf8");
        await (0, livekit_webhook_service_1.handleLiveKitWebhook)(body, authorization);
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        console.error("LiveKit webhook error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid LiveKit webhook",
        });
    }
};
exports.liveKitWebhookController = liveKitWebhookController;
