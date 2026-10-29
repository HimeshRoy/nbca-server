import { Router } from "express";

import { upload } from "../../middlewares/upload";

import { uploadFile, deleteFile } from "./upload.controller";

const router = Router();

router.post("/", upload.single("file"), uploadFile);

router.delete("/:id", deleteFile);

export default router;
