"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentAssignmentsControllerById = exports.getStudentAssignmentsController = exports.deleteAssignmentController = exports.updateAssignmentController = exports.getAssignmentByIdController = exports.getAssignmentsController = exports.createAssignmentController = void 0;
const assignment_service_1 = require("./assignment.service");
const createAssignmentController = async (req, res) => {
    const user = req.user;
    const result = await (0, assignment_service_1.createAssignment)(user.id, req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createAssignmentController = createAssignmentController;
const getAssignmentsController = async (req, res) => {
    const user = req.user;
    const result = await (0, assignment_service_1.getAssignments)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getAssignmentsController = getAssignmentsController;
const getAssignmentByIdController = async (req, res) => {
    const user = req.user;
    const result = await (0, assignment_service_1.getAssignmentById)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getAssignmentByIdController = getAssignmentByIdController;
const updateAssignmentController = async (req, res) => {
    const user = req.user;
    const result = await (0, assignment_service_1.updateAssignment)(user.id, req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateAssignmentController = updateAssignmentController;
const deleteAssignmentController = async (req, res) => {
    const user = req.user;
    const result = await (0, assignment_service_1.deleteAssignment)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteAssignmentController = deleteAssignmentController;
const getStudentAssignmentsController = async (req, res) => {
    const result = await (0, assignment_service_1.getStudentAssignments)(req.user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getStudentAssignmentsController = getStudentAssignmentsController;
const getStudentAssignmentsControllerById = async (req, res) => {
    const user = req.user;
    const result = await (0, assignment_service_1.getStudentAssignmentById)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getStudentAssignmentsControllerById = getStudentAssignmentsControllerById;
