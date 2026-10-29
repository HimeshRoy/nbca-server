"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const upload_1 = require("../../middlewares/upload");
const question_bank_controller_1 = require("./question-bank.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(), question_bank_controller_1.getQuestionBanksController);
router.post("/", (0, auth_1.auth)(), upload_1.upload.single("questionImage"), question_bank_controller_1.createQuestionBankController);
router.get("/:id", (0, auth_1.auth)(), question_bank_controller_1.getQuestionBankByIdController);
router.patch("/:id", (0, auth_1.auth)(), upload_1.upload.single("questionImage"), question_bank_controller_1.updateQuestionBankController);
router.delete("/:id", (0, auth_1.auth)(), question_bank_controller_1.deleteQuestionBankController);
exports.default = router;
