import { Router } from "express";
import { auth } from "../../middlewares/auth";

import {
  createAttendanceController,
  getAttendanceController,
  getMyAttendanceController,
  markLiveClassLeaveController,
} from "./attendance.controller";

const router = Router();

router.post("/", auth("TEACHER"), createAttendanceController);

router.get("/", auth("TEACHER"), getAttendanceController);

router.get("/my", auth("STUDENT"), getMyAttendanceController);
router.post(
  "/live-class/:liveClassId/leave",
  auth("STUDENT"),
  markLiveClassLeaveController,
);

export default router;
