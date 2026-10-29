"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePollController = exports.votePollController = exports.createPollController = exports.getPollController = void 0;
const poll_service_1 = require("./poll.service");
/* ============================================================
   GET POLL
============================================================ */
const getPollController = async (req, res) => {
    try {
        const liveClassId = req.params.liveClassId;
        if (!liveClassId) {
            return res.status(400).json({
                message: "Live class ID is required.",
            });
        }
        const poll = await (0, poll_service_1.getActivePoll)(liveClassId);
        const user = req.user;
        if (!poll) {
            return res.status(200).json({
                success: true,
                data: null,
            });
        }
        /* ========================================================
           STUDENT + ACTIVE POLL
           
           Do NOT reveal correct answer.
           ======================================================== */
        if (user?.role === "STUDENT" && poll.isActive) {
            const hasVoted = user?.id
                ? await (0, poll_service_1.hasStudentVoted)(liveClassId, user.id)
                : false;
            const studentPoll = {
                ...poll,
                correctOptionId: undefined,
                hasVoted,
            };
            return res.status(200).json({
                success: true,
                data: studentPoll,
            });
        }
        /* ========================================================
           TEACHER
           OR
           STUDENT + CLOSED POLL
           
           Correct answer is allowed here.
           ======================================================== */
        let hasVoted = false;
        if (user?.role === "STUDENT" && user?.id) {
            hasVoted = await (0, poll_service_1.hasStudentVoted)(liveClassId, user.id);
        }
        return res.status(200).json({
            success: true,
            data: {
                ...poll,
                hasVoted,
            },
        });
    }
    catch (error) {
        console.error("Get poll error:", error);
        return res.status(500).json({
            message: "Failed to load poll.",
        });
    }
};
exports.getPollController = getPollController;
/* ============================================================
   CREATE POLL
============================================================ */
const createPollController = async (req, res) => {
    try {
        const liveClassId = req.params.liveClassId;
        const { question, options, correctOptionIndex } = req.body;
        if (!liveClassId) {
            return res.status(400).json({
                message: "Live class ID is required.",
            });
        }
        if (typeof question !== "string") {
            return res.status(400).json({
                message: "Poll question is required.",
            });
        }
        if (!Array.isArray(options)) {
            return res.status(400).json({
                message: "Poll options are required.",
            });
        }
        /* ========================================================
           CORRECT ANSWER
           ======================================================== */
        if (typeof correctOptionIndex !== "number" ||
            !Number.isInteger(correctOptionIndex)) {
            return res.status(400).json({
                message: "Correct answer is required.",
            });
        }
        /* ========================================================
           CREATE
           ======================================================== */
        const poll = await (0, poll_service_1.createPoll)(liveClassId, question, options, correctOptionIndex);
        return res.status(201).json({
            success: true,
            data: poll,
        });
    }
    catch (error) {
        console.error("Create poll error:", error);
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create poll.",
        });
    }
};
exports.createPollController = createPollController;
/* ============================================================
   VOTE
============================================================ */
const votePollController = async (req, res) => {
    try {
        const user = req.user;
        const liveClassId = req.params.liveClassId;
        const { optionId } = req.body;
        if (!user?.id) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }
        if (!liveClassId) {
            return res.status(400).json({
                message: "Live class ID is required.",
            });
        }
        if (typeof optionId !== "string") {
            return res.status(400).json({
                message: "Poll option is required.",
            });
        }
        const poll = await (0, poll_service_1.votePoll)(liveClassId, user.id, optionId);
        return res.status(200).json({
            success: true,
            data: poll,
        });
    }
    catch (error) {
        console.error("Vote poll error:", error);
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to vote.",
        });
    }
};
exports.votePollController = votePollController;
/* ============================================================
   CLOSE POLL
============================================================ */
const closePollController = async (req, res) => {
    try {
        const liveClassId = req.params.liveClassId;
        if (!liveClassId) {
            return res.status(400).json({
                message: "Live class ID is required.",
            });
        }
        const poll = await (0, poll_service_1.closePoll)(liveClassId);
        return res.status(200).json({
            success: true,
            data: poll,
        });
    }
    catch (error) {
        console.error("Close poll error:", error);
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to close poll.",
        });
    }
};
exports.closePollController = closePollController;
