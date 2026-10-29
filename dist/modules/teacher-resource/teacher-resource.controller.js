"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherResourceStatsController = exports.uploadTeacherResourceController = exports.deleteTeacherResourceController = exports.updateTeacherResourceController = exports.getTeacherResourceByIdController = exports.getTeacherResourcesController = exports.createTeacherResourceController = void 0;
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const teacher_resource_service_1 = require("./teacher-resource.service");
const createTeacherResourceController = async (req, res) => {
    const user = req.user;
    const result = await (0, teacher_resource_service_1.createTeacherResource)(user.id, req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createTeacherResourceController = createTeacherResourceController;
const getTeacherResourcesController = async (req, res) => {
    const user = req.user;
    const result = await (0, teacher_resource_service_1.getTeacherResources)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getTeacherResourcesController = getTeacherResourcesController;
const getTeacherResourceByIdController = async (req, res) => {
    const user = req.user;
    const result = await (0, teacher_resource_service_1.getTeacherResourceById)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getTeacherResourceByIdController = getTeacherResourceByIdController;
const updateTeacherResourceController = async (req, res) => {
    const user = req.user;
    const result = await (0, teacher_resource_service_1.updateTeacherResource)(user.id, req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateTeacherResourceController = updateTeacherResourceController;
const deleteTeacherResourceController = async (req, res) => {
    const user = req.user;
    const result = await (0, teacher_resource_service_1.deleteTeacherResource)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteTeacherResourceController = deleteTeacherResourceController;
const uploadTeacherResourceController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
        return res.status(200).json({
            success: true,
            data: {
                fileUrl: uploadResult.secure_url,
                fileSize: req.file.size,
            },
        });
    }
    catch (error) {
        console.error("Teacher resource Cloudinary upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};
exports.uploadTeacherResourceController = uploadTeacherResourceController;
const getTeacherResourceStatsController = async (req, res) => {
    const user = req.user;
    const result = await (0, teacher_resource_service_1.getTeacherResourceStats)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getTeacherResourceStatsController = getTeacherResourceStatsController;
