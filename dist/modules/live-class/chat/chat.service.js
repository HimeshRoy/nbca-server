"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearClassroomChat = exports.saveClassroomChatMessage = exports.getClassroomChat = void 0;
const redis_1 = require("../../../config/redis");
const getChatKey = (liveClassId) => `nbca:live-class:${liveClassId}:chat`;
const getClassroomChat = async (liveClassId) => {
    const key = getChatKey(liveClassId);
    const messages = await redis_1.redis.lrange(key, 0, -1);
    return messages;
};
exports.getClassroomChat = getClassroomChat;
const saveClassroomChatMessage = async (liveClassId, message) => {
    const key = getChatKey(liveClassId);
    await redis_1.redis.rpush(key, message);
    // Keep classroom chat temporary.
    // 24 hours is only a safety fallback.
    await redis_1.redis.expire(key, 60 * 60 * 24);
    return message;
};
exports.saveClassroomChatMessage = saveClassroomChatMessage;
const clearClassroomChat = async (liveClassId) => {
    const key = getChatKey(liveClassId);
    await redis_1.redis.del(key);
};
exports.clearClassroomChat = clearClassroomChat;
