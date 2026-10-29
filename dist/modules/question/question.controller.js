"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQuestionsExcelController = exports.uploadQuestionImageController = exports.deleteQuestionController = exports.updateQuestionController = exports.getQuestionByIdController = exports.getQuestionsController = exports.createQuestionController = void 0;
const XLSX = __importStar(require("xlsx"));
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const question_service_1 = require("./question.service");
const uploadQuestionImages = async (files) => {
    const imageFields = [
        "questionImage",
        "optionAImage",
        "optionBImage",
        "optionCImage",
        "optionDImage",
    ];
    const imageUrls = {};
    if (!files) {
        return imageUrls;
    }
    for (const field of imageFields) {
        const file = files[field]?.[0];
        if (!file) {
            continue;
        }
        const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(file.buffer, file.originalname, file.mimetype);
        imageUrls[field] = uploadResult.secure_url;
    }
    return imageUrls;
};
const createQuestionController = async (req, res) => {
    try {
        const files = req.files;
        const imageUrls = await uploadQuestionImages(files);
        const result = await (0, question_service_1.createQuestion)({
            ...req.body,
            ...imageUrls,
            marks: Number(req.body.marks) || 1,
        });
        return res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Question creation failed:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Question creation failed",
        });
    }
};
exports.createQuestionController = createQuestionController;
const getQuestionsController = async (req, res) => {
    try {
        const result = await (0, question_service_1.getQuestions)(req.params.testId);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to get questions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get questions",
        });
    }
};
exports.getQuestionsController = getQuestionsController;
const getQuestionByIdController = async (req, res) => {
    try {
        const result = await (0, question_service_1.getQuestionById)(req.params.id);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to get question:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get question",
        });
    }
};
exports.getQuestionByIdController = getQuestionByIdController;
const updateQuestionController = async (req, res) => {
    try {
        const files = req.files;
        const imageUrls = await uploadQuestionImages(files);
        const result = await (0, question_service_1.updateQuestion)(req.params.id, {
            ...req.body,
            ...imageUrls,
            ...(req.body.marks !== undefined && {
                marks: Number(req.body.marks) || 1,
            }),
        });
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to update question:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to update question",
        });
    }
};
exports.updateQuestionController = updateQuestionController;
const deleteQuestionController = async (req, res) => {
    try {
        const result = await (0, question_service_1.deleteQuestion)(req.params.id);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to delete question:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to delete question",
        });
    }
};
exports.deleteQuestionController = deleteQuestionController;
const uploadQuestionImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
        return res.status(201).json({
            success: true,
            data: {
                fileUrl: uploadResult.secure_url,
            },
        });
    }
    catch (error) {
        console.error("Question image Cloudinary upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};
exports.uploadQuestionImageController = uploadQuestionImageController;
const uploadQuestionsExcelController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const questions = data.map((row) => ({
            question: String(row.question),
            optionA: String(row.optionA),
            optionB: String(row.optionB),
            optionC: String(row.optionC),
            optionD: String(row.optionD),
            correctAnswer: String(row.correctAnswer),
            marks: Number(row.marks) || 1,
            difficulty: row.difficulty || "EASY",
            explanation: row.explanation || "",
            testId: req.body.testId,
        }));
        console.log("FILE:", req.file);
        console.log("BODY:", req.body);
        console.log("QUESTIONS:", questions);
        await prisma_1.prisma.question.createMany({
            data: questions,
        });
        return res.status(201).json({
            success: true,
            message: `${questions.length} questions imported`,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Excel upload failed",
        });
    }
};
exports.uploadQuestionsExcelController = uploadQuestionsExcelController;
