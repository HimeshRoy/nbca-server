"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestionBankController = exports.updateQuestionBankController = exports.getQuestionBankByIdController = exports.getQuestionBanksController = exports.createQuestionBankController = void 0;
const question_bank_service_1 = require("./question-bank.service");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const createQuestionBankController = async (req, res) => {
    try {
        const user = req.user;
        let questionImage;
        if (req.file) {
            const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
            questionImage = uploadResult.secure_url;
        }
        const result = await (0, question_bank_service_1.createQuestionBank)(user.id, {
            ...req.body,
            ...(questionImage && { questionImage }),
        });
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Question bank creation failed:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Question bank creation failed",
        });
    }
};
exports.createQuestionBankController = createQuestionBankController;
const getQuestionBanksController = async (req, res) => {
    try {
        const user = req.user;
        const result = await (0, question_bank_service_1.getQuestionBanks)(user.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to get question banks:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get question banks",
        });
    }
};
exports.getQuestionBanksController = getQuestionBanksController;
const getQuestionBankByIdController = async (req, res) => {
    try {
        const result = await (0, question_bank_service_1.getQuestionBankById)(req.params.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to get question bank:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get question bank",
        });
    }
};
exports.getQuestionBankByIdController = getQuestionBankByIdController;
const updateQuestionBankController = async (req, res) => {
    try {
        let questionImage;
        if (req.file) {
            const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
            questionImage = uploadResult.secure_url;
        }
        const result = await (0, question_bank_service_1.updateQuestionBank)(req.params.id, {
            ...req.body,
            ...(questionImage && { questionImage }),
        });
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to update question bank:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update question bank",
        });
    }
};
exports.updateQuestionBankController = updateQuestionBankController;
const deleteQuestionBankController = async (req, res) => {
    try {
        const result = await (0, question_bank_service_1.deleteQuestionBank)(req.params.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to delete question bank:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete question bank",
        });
    }
};
exports.deleteQuestionBankController = deleteQuestionBankController;
