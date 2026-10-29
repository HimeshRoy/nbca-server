"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentTestResultController = exports.getTestAttemptsController = exports.getMyAttemptsController = exports.attemptTestController = void 0;
const test_attempt_service_1 = require("./test-attempt.service");
const attemptTestController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_attempt_service_1.attemptTest)(user.id, req.params.testId, req.body.answers);
    res.status(201).json({
        success: true,
        data: result,
    });
};
exports.attemptTestController = attemptTestController;
const getMyAttemptsController = async (req, res) => {
    const user = req.user;
    const result = await (0, test_attempt_service_1.getMyAttempts)(user.id);
    res.json({
        success: true,
        data: result,
    });
};
exports.getMyAttemptsController = getMyAttemptsController;
const getTestAttemptsController = async (req, res) => {
    const result = await (0, test_attempt_service_1.getTestAttempts)(req.params.testId);
    res.json({
        success: true,
        data: result,
    });
};
exports.getTestAttemptsController = getTestAttemptsController;
const getStudentTestResultController = async (req, res) => {
    try {
        const result = await (0, test_attempt_service_1.getStudentTestResult)(req.user.id, req.params.testId);
        res.status(200).json({
            success: true,
            message: "Result fetched successfully.",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStudentTestResultController = getStudentTestResultController;
