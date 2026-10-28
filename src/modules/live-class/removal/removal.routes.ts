import { Router } from "express";
import { auth } from "../../../middlewares/auth";

import {
  removeStudentController,
  checkStudentRemovalController,
} from "./removal.controller";

const router = Router();

router.delete(
  "/:liveClassId/students/:studentId",
  auth("TEACHER"),
  removeStudentController,
);

router.get(
  "/:liveClassId/status",
  auth("STUDENT"),
  checkStudentRemovalController,
);

export default router;
