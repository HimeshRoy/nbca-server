"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_service_1 = require("../../services/cloudinary/cloudinary.service");
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const uploadResult = await (0, cloudinary_service_1.uploadFileToCloudinary)(req.file.buffer, req.file.originalname, req.file.mimetype);
        const savedFile = await prisma_1.prisma.file.create({
            data: {
                fileName: req.file.originalname,
                fileUrl: uploadResult.secure_url,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
            },
        });
        return res.status(201).json({
            success: true,
            data: savedFile,
        });
    }
    catch (error) {
        console.error("Cloudinary file upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await prisma_1.prisma.file.findUnique({
            where: {
                id,
            },
        });
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }
        // Delete the actual file from Cloudinary
        if (file.fileUrl) {
            try {
                await (0, cloudinary_service_1.deleteFileFromCloudinaryByUrl)(file.fileUrl);
            }
            catch (error) {
                console.error("Failed to delete file from Cloudinary:", error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete file from Cloudinary",
                });
            }
        }
        // Delete the database record
        const deletedFile = await prisma_1.prisma.file.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            data: deletedFile,
        });
    }
    catch (error) {
        console.error("File deletion failed:", error);
        return res.status(500).json({
            success: false,
            message: "File deletion failed",
        });
    }
};
exports.deleteFile = deleteFile;
