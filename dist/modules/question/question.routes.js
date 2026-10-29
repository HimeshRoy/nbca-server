"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const upload_1 = require("../../middlewares/upload");
const question_controller_1 = require("./question.controller");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("TEACHER"), upload_1.upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
]), question_controller_1.createQuestionController);
router.post("/upload", (0, auth_1.auth)("TEACHER"), upload_1.upload.single("file"), question_controller_1.uploadQuestionImageController);
router.post("/upload-excel", (0, auth_1.auth)("TEACHER"), upload_1.upload.single("file"), question_controller_1.uploadQuestionsExcelController);
router.get("/test/:testId", (0, auth_1.auth)("TEACHER"), question_controller_1.getQuestionsController);
router.get("/:id", (0, auth_1.auth)("TEACHER"), question_controller_1.getQuestionByIdController);
router.patch("/:id", (0, auth_1.auth)("TEACHER"), upload_1.upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
]), question_controller_1.updateQuestionController);
router.delete("/:id", (0, auth_1.auth)("TEACHER"), question_controller_1.deleteQuestionController);
exports.default = router;
