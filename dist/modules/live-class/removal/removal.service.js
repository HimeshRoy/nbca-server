"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRemovedStudents = exports.isStudentRemoved = exports.removeStudentFromClass = void 0;
const redis_1 = require("../../../config/redis");
const livekit_service_1 = require("../../../services/livekit/livekit.service");
const getRemovedKey = (liveClassId) => `nbca:live-class:${liveClassId}:removed`;
const removeStudentFromClass = async (liveClassId, studentId, roomName) => {
    // Store removal state first.
    // This prevents the student from immediately
    // requesting a new LiveKit token and rejoining.
    const key = getRemovedKey(liveClassId);
    await redis_1.redis.sadd(key, studentId);
    // Safety fallback.
    await redis_1.redis.expire(key, 60 * 60 * 24);
    // Disconnect the student from the active LiveKit room.
    await (0, livekit_service_1.removeParticipantFromLiveKit)(roomName, studentId);
};
exports.removeStudentFromClass = removeStudentFromClass;
const isStudentRemoved = async (liveClassId, studentId) => {
    const key = getRemovedKey(liveClassId);
    return await redis_1.redis.sismember(key, studentId);
};
exports.isStudentRemoved = isStudentRemoved;
const clearRemovedStudents = async (liveClassId) => {
    const key = getRemovedKey(liveClassId);
    await redis_1.redis.del(key);
};
exports.clearRemovedStudents = clearRemovedStudents;
