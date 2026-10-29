"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentTestByIdController = exports.getStudentTestsController = exports.deleteTestController = exports.updateTestController = exports.getTestByIdController = exports.getTestsController = exports.createTestController = void 0;
const test_service_1 = require("./test.service");
const createTestController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_service_1.createTest)(user.id, req.body);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.createTestController = createTestController;
const getTestsController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_service_1.getTests)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getTestsController = getTestsController;
const getTestByIdController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_service_1.getTestById)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getTestByIdController = getTestByIdController;
const updateTestController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_service_1.updateTest)(user.id, req.params.id, req.body);
    res.json({
        success: true,
        data: result,
    });
};
exports.updateTestController = updateTestController;
const deleteTestController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_service_1.deleteTest)(user.id, req.params.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.deleteTestController = deleteTestController;
const getStudentTestsController = async (req, res) => {
    try {
        const tests = await (0, test_service_1.getStudentTests)(req.user.id);
        res.status(200).json({
            success: true,
            message: "Student tests fetched successfully",
            data: tests,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStudentTestsController = getStudentTestsController;
const getStudentTestByIdController = async (req, res) => {
    try {
        const test = await (0, test_service_1.getStudentTestById)(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            message: "Student test fetched successfully",
            data: test,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStudentTestByIdController = getStudentTestByIdController;
