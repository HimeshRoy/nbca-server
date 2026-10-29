"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentChapterResourcesController = exports.getStudentResourcesController = exports.deleteResourceController = exports.updateResourceController = exports.getResourceByIdController = exports.getAllResourcesController = exports.createResourceController = void 0;
const resource_service_1 = require("./resource.service");
const resource_service_2 = require("./resource.service");
const createResourceController = async (req, res) => {
    const result = await (0, resource_service_2.createResource)(req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createResourceController = createResourceController;
const getAllResourcesController = async (req, res) => {
    const result = await (0, resource_service_2.getAllResources)();
    res.json({
        success: true,
        data: result,
    });
};
exports.getAllResourcesController = getAllResourcesController;
const getResourceByIdController = async (req, res) => {
    const result = await (0, resource_service_2.getResourceById)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getResourceByIdController = getResourceByIdController;
const updateResourceController = async (req, res) => {
    const result = await (0, resource_service_2.updateResource)(req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateResourceController = updateResourceController;
const deleteResourceController = async (req, res) => {
    const result = await (0, resource_service_2.deleteResource)(req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteResourceController = deleteResourceController;
const getStudentResourcesController = async (req, res) => {
    const result = await (0, resource_service_1.getStudentResources)(req.user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getStudentResourcesController = getStudentResourcesController;
const getStudentChapterResourcesController = async (req, res) => {
    const result = await (0, resource_service_2.getStudentChapterResources)(req.user.id, req.params.chapterId);
    res.json({
        success: true,
        data: result,
    });
};
exports.getStudentChapterResourcesController = getStudentChapterResourcesController;
