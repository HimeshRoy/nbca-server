import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { joinLiveClassRoomController } from "./room.controller";

const router = Router();

router.post(
  "/:id/join",
  auth("TEACHER", "STUDENT"),
  joinLiveClassRoomController,
);

export default router;