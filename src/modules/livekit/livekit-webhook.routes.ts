import { Router } from "express";

import { liveKitWebhookController } from "./livekit-webhook.controller";

const router = Router();

router.post("/webhook", liveKitWebhookController);

export default router;
