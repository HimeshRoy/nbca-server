import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

import {
  createQuestionController,
  getQuestionsController,
  getQuestionByIdController,
  updateQuestionController,
  deleteQuestionController,
  uploadQuestionImageController,
  uploadQuestionsExcelController,
} from "./question.controller";

const router = Router();

router.post(
  "/",
  auth("TEACHER"),
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
  ]),
  createQuestionController,
);

router.post(
  "/upload",
  auth("TEACHER"),
  upload.single("file"),
  uploadQuestionImageController,
);

router.post(
  "/upload-excel",
  auth("TEACHER"),
  upload.single("file"),
  uploadQuestionsExcelController,
);

router.get("/test/:testId", auth("TEACHER"), getQuestionsController);

router.get("/:id", auth("TEACHER"), getQuestionByIdController);

router.patch(
  "/:id",
  auth("TEACHER"),
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
  ]),
  updateQuestionController,
);

router.delete("/:id", auth("TEACHER"), deleteQuestionController);

export default router;
