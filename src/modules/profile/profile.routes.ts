import { Router } from "express";

import {
  getMyProfileController,
  updateMyProfileController,
  getStudentIdCardController,
  viewStudentIdCardController,
  verifyStudentCardController,
  downloadStudentIdCardController,
} from "./profile.controller";

import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

const router = Router();

router.get("/me", auth(), getMyProfileController);

router.put("/me", auth(), upload.single("photo"), updateMyProfileController);

router.get("/id-card", auth(), getStudentIdCardController);

router.get("/id-card/view", auth("STUDENT"), viewStudentIdCardController);

router.get("/id-card/pdf", auth("STUDENT"), downloadStudentIdCardController);

router.get("/verify/:studentId", verifyStudentCardController);

export default router;
