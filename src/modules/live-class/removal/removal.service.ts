import { redis } from "../../../config/redis";
import {
  removeParticipantFromLiveKit,
} from "../../../services/livekit/livekit.service";

const getRemovedKey = (liveClassId: string) =>
  `nbca:live-class:${liveClassId}:removed`;

export const removeStudentFromClass = async (
  liveClassId: string,
  studentId: string,
  roomName: string,
) => {
  // Store removal state first.
  // This prevents the student from immediately
  // requesting a new LiveKit token and rejoining.
  const key = getRemovedKey(liveClassId);

  await redis.sadd(key, studentId);

  // Safety fallback.
  await redis.expire(key, 60 * 60 * 24);

  // Disconnect the student from the active LiveKit room.
  await removeParticipantFromLiveKit(
    roomName,
    studentId,
  );
};

export const isStudentRemoved = async (
  liveClassId: string,
  studentId: string,
) => {
  const key = getRemovedKey(liveClassId);

  return await redis.sismember(key, studentId);
};

export const clearRemovedStudents = async (
  liveClassId: string,
) => {
  const key = getRemovedKey(liveClassId);

  await redis.del(key);
};