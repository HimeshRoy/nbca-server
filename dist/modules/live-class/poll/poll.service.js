"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasStudentVoted = exports.clearPoll = exports.closePoll = exports.votePoll = exports.createPoll = exports.getActivePoll = void 0;
const redis_1 = require("../../../config/redis");
/* ============================================================
   REDIS KEYS
============================================================ */
const getPollKey = (liveClassId) => `nbca:live-class:${liveClassId}:poll`;
const getPollVotesKey = (liveClassId) => `nbca:live-class:${liveClassId}:poll:voters`;
/* ============================================================
   GET ACTIVE POLL
============================================================ */
const getActivePoll = async (liveClassId) => {
    const key = getPollKey(liveClassId);
    const poll = await redis_1.redis.get(key);
    if (!poll) {
        return null;
    }
    return poll;
};
exports.getActivePoll = getActivePoll;
/* ============================================================
   CREATE POLL
============================================================ */
const createPoll = async (liveClassId, question, optionTexts, correctOptionIndex) => {
    const existingPoll = await (0, exports.getActivePoll)(liveClassId);
    if (existingPoll?.isActive) {
        throw new Error("There is already an active poll in this classroom.");
    }
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
        throw new Error("Poll question is required.");
    }
    if (optionTexts.length < 2 ||
        optionTexts.length > 6) {
        throw new Error("A poll must have between 2 and 6 options.");
    }
    const cleanedOptions = optionTexts
        .map((option) => option.trim())
        .filter(Boolean);
    if (cleanedOptions.length < 2) {
        throw new Error("At least 2 valid options are required.");
    }
    if (cleanedOptions.length > 6) {
        throw new Error("A poll can have a maximum of 6 options.");
    }
    /* ==========================================================
       CHECK DUPLICATE OPTIONS
    ========================================================== */
    const duplicateOptions = new Set(cleanedOptions.map((option) => option.toLowerCase()));
    if (duplicateOptions.size !==
        cleanedOptions.length) {
        throw new Error("Poll options must be unique.");
    }
    /* ==========================================================
       VALIDATE CORRECT ANSWER INDEX
    ========================================================== */
    if (!Number.isInteger(correctOptionIndex) ||
        correctOptionIndex < 0 ||
        correctOptionIndex >=
            cleanedOptions.length) {
        throw new Error("Please select a valid correct answer.");
    }
    /* ==========================================================
       GENERATE REAL OPTION IDS
    ========================================================== */
    const pollOptionIds = cleanedOptions.map(() => crypto.randomUUID());
    /* ==========================================================
       CONVERT INDEX → REAL OPTION ID
    ========================================================== */
    const correctOptionId = pollOptionIds[correctOptionIndex];
    if (!correctOptionId) {
        throw new Error("Failed to determine the correct answer.");
    }
    /* ==========================================================
       CREATE POLL
    ========================================================== */
    const poll = {
        id: crypto.randomUUID(),
        liveClassId,
        question: trimmedQuestion,
        options: cleanedOptions.map((text, index) => ({
            id: pollOptionIds[index],
            text,
            votes: 0,
        })),
        correctOptionId,
        isActive: true,
        createdAt: Date.now(),
    };
    /* ==========================================================
       SAVE POLL
    ========================================================== */
    await redis_1.redis.set(getPollKey(liveClassId), poll);
    /* ==========================================================
       RESET VOTERS
    ========================================================== */
    await redis_1.redis.del(getPollVotesKey(liveClassId));
    /* ==========================================================
       EXPIRATION
    ========================================================== */
    await redis_1.redis.expire(getPollKey(liveClassId), 60 * 60 * 24);
    await redis_1.redis.expire(getPollVotesKey(liveClassId), 60 * 60 * 24);
    return poll;
};
exports.createPoll = createPoll;
/* ============================================================
   VOTE
============================================================ */
const votePoll = async (liveClassId, studentId, optionId) => {
    const poll = await (0, exports.getActivePoll)(liveClassId);
    if (!poll ||
        !poll.isActive) {
        throw new Error("There is no active poll.");
    }
    /* ==========================================================
       CHECK IF STUDENT ALREADY VOTED
    ========================================================== */
    const alreadyVoted = await redis_1.redis.sismember(getPollVotesKey(liveClassId), studentId);
    if (alreadyVoted) {
        throw new Error("You have already voted in this poll.");
    }
    /* ==========================================================
       FIND OPTION
    ========================================================== */
    const option = poll.options.find((item) => item.id === optionId);
    if (!option) {
        throw new Error("Invalid poll option.");
    }
    /* ==========================================================
       INCREMENT VOTE
    ========================================================== */
    option.votes += 1;
    /* ==========================================================
       SAVE UPDATED POLL
    ========================================================== */
    await redis_1.redis.set(getPollKey(liveClassId), poll);
    /* ==========================================================
       MARK STUDENT AS VOTED
    ========================================================== */
    await redis_1.redis.sadd(getPollVotesKey(liveClassId), studentId);
    return poll;
};
exports.votePoll = votePoll;
/* ============================================================
   CLOSE POLL
============================================================ */
const closePoll = async (liveClassId) => {
    const poll = await (0, exports.getActivePoll)(liveClassId);
    if (!poll) {
        throw new Error("Poll not found.");
    }
    if (!poll.isActive) {
        return poll;
    }
    const closedPoll = {
        ...poll,
        isActive: false,
        closedAt: Date.now(),
    };
    await redis_1.redis.set(getPollKey(liveClassId), closedPoll);
    /*
     * Keep closed results available
     * for the remainder of the classroom.
     */
    await redis_1.redis.expire(getPollKey(liveClassId), 60 * 60 * 24);
    return closedPoll;
};
exports.closePoll = closePoll;
/* ============================================================
   CLEAR POLL
============================================================ */
const clearPoll = async (liveClassId) => {
    await redis_1.redis.del(getPollKey(liveClassId));
    await redis_1.redis.del(getPollVotesKey(liveClassId));
};
exports.clearPoll = clearPoll;
/* ============================================================
   CHECK IF STUDENT HAS VOTED
============================================================ */
const hasStudentVoted = async (liveClassId, studentId) => {
    return Boolean(await redis_1.redis.sismember(getPollVotesKey(liveClassId), studentId));
};
exports.hasStudentVoted = hasStudentVoted;
