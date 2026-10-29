import express from "express";

import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

import {
  createQuestionBankController,
  getQuestionBanksController,
  getQuestionBankByIdController,
  updateQuestionBankController,
  deleteQuestionBankController,
} from "./question-bank.controller";

const router = express.Router();

router.get("/", auth(), getQuestionBanksController);

router.post(
  "/",
  auth(),
  upload.single("questionImage"),
  createQuestionBankController,
);

router.get("/:id", auth(), getQuestionBankByIdController);

router.patch(
  "/:id",
  auth(),
  upload.single("questionImage"),
  updateQuestionBankController,
);

router.delete("/:id", auth(), deleteQuestionBankController);

export default router;
