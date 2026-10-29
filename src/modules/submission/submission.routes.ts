import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

import {
  submitAssignmentController,
  getMySubmissionsController,
  getAssignmentSubmissionsController,
  evaluateSubmissionController,
} from "./submission.controller";

const router = Router();

router.post(
  "/:assignmentId",
  auth("STUDENT"),
  upload.single("file"),
  submitAssignmentController,
);

router.get("/my", auth("STUDENT"), getMySubmissionsController);

router.patch("/:id/evaluate", auth("TEACHER"), evaluateSubmissionController);

router.get(
  "/assignment/:assignmentId",
  auth("TEACHER"),
  getAssignmentSubmissionsController,
);

export default router;
