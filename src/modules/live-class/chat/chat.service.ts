import { redis } from "../../../config/redis";

const getChatKey = (liveClassId: string) =>
  `nbca:live-class:${liveClassId}:chat`;

export type ClassroomChatMessage = {
  id: string;
  identity: string;
  name: string;
  message: string;
  timestamp: number;
};

export const getClassroomChat = async (liveClassId: string) => {
  const key = getChatKey(liveClassId);

  const messages = await redis.lrange<ClassroomChatMessage>(key, 0, -1);

  return messages;
};

export const saveClassroomChatMessage = async (
  liveClassId: string,
  message: ClassroomChatMessage,
) => {
  const key = getChatKey(liveClassId);

  await redis.rpush(key, message);

  // Keep classroom chat temporary.
  // 24 hours is only a safety fallback.
  await redis.expire(key, 60 * 60 * 24);

  return message;
};

export const clearClassroomChat = async (liveClassId: string) => {
  const key = getChatKey(liveClassId);

  await redis.del(key);
};
