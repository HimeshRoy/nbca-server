import { Router } from "express";
import { generateLiveKitTokenController } from "./livekit.controller";

const router = Router();

router.post("/token", generateLiveKitTokenController);

export default router;
