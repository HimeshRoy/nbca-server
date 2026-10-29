"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateSubmissionController = exports.getAssignmentSubmissionsController = exports.getMySubmissionsController = exports.submitAssignmentController = void 0;
const submission_service_1 = require("./submission.service");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const submitAssignmentController = async (req, res) => {
    try {
        const user = req.user;
        let fileUrl;
        if (req.file) {
            const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
            fileUrl = uploadResult.secure_url;
        }
        const result = await (0, submission_service_1.submitAssignment)(user.id, req.params.assignmentId, {
            ...req.body,
            fileUrl,
        });
        return res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Assignment submission failed:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Assignment submission failed",
        });
    }
};
exports.submitAssignmentController = submitAssignmentController;
const getMySubmissionsController = async (req, res) => {
    try {
        const user = req.user;
        const result = await (0, submission_service_1.getMySubmissions)(user.id);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to get submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get submissions",
        });
    }
};
exports.getMySubmissionsController = getMySubmissionsController;
const getAssignmentSubmissionsController = async (req, res) => {
    try {
        const result = await (0, submission_service_1.getAssignmentSubmissions)(req.params.assignmentId);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to get assignment submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get assignment submissions",
        });
    }
};
exports.getAssignmentSubmissionsController = getAssignmentSubmissionsController;
const evaluateSubmissionController = async (req, res) => {
    try {
        const result = await (0, submission_service_1.evaluateSubmission)(req.params.id, req.body);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Failed to evaluate submission:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to evaluate submission",
        });
    }
};
exports.evaluateSubmissionController = evaluateSubmissionController;
