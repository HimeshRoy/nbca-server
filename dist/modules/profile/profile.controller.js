"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadStudentIdCardController = exports.verifyStudentCardController = exports.viewStudentIdCardController = exports.getStudentIdCardController = exports.updateMyProfileController = exports.getMyProfileController = void 0;
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const profile_service_1 = require("./profile.service");
const id_card_service_1 = require("./id-card.service");
const getMyProfileController = async (req, res) => {
    const result = await (0, profile_service_1.getMyProfile)(req.user.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getMyProfileController = getMyProfileController;
const updateMyProfileController = async (req, res) => {
    try {
        const user = req.user;
        let photo;
        if (req.file) {
            const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
            photo = uploadResult.secure_url;
        }
        const result = await (0, profile_service_1.updateMyProfile)(user.id, {
            ...req.body,
            ...(photo && { photo }),
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Profile update failed",
        });
    }
};
exports.updateMyProfileController = updateMyProfileController;
const getStudentIdCardController = async (req, res) => {
    const result = await (0, profile_service_1.getStudentIdCard)(req.user.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getStudentIdCardController = getStudentIdCardController;
const viewStudentIdCardController = async (req, res) => {
    const pdf = await (0, id_card_service_1.generateStudentIdCard)(req.user.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="NBCA-ID-Card.pdf"');
    res.send(pdf);
};
exports.viewStudentIdCardController = viewStudentIdCardController;
const verifyStudentCardController = async (req, res) => {
    const result = await (0, profile_service_1.verifyStudentCard)(req.params.studentId);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.verifyStudentCardController = verifyStudentCardController;
const downloadStudentIdCardController = async (req, res) => {
    const pdf = await (0, id_card_service_1.generateStudentIdCard)(req.user.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="NBCA-ID-Card.pdf"');
    res.send(pdf);
};
exports.downloadStudentIdCardController = downloadStudentIdCardController;
