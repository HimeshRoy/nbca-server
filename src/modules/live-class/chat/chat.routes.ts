import { Router } from "express";
import {
  getClassroomChatController,
  saveClassroomChatController,
} from "./chat.controller";

const router = Router();

router.get("/:liveClassId", getClassroomChatController);

router.post("/:liveClassId", saveClassroomChatController);

export default router;
