import { prisma } from "../../../config/prisma";
import { createLiveKitToken } from "../../../services/livekit/livekit.service";
import { isStudentRemoved } from "../removal/removal.service";
import { markLiveClassJoin } from "../../attendance/attendance.service";

export const createLiveClassRoomToken = async (
  liveClassId: string,
  userId: string,
  role: "TEACHER" | "STUDENT",
) => {
  const liveClass = await prisma.liveClass.findUnique({
    where: {
      id: liveClassId,
    },
    include: {
      teacher: true,
      class: true,
      subject: true,
    },
  });

  if (!liveClass) {
    throw new Error("Live class not found");
  }

  let displayName = "";

  /*
   * TEACHER ACCESS
   */
  if (role === "TEACHER") {
    if (liveClass.teacherId !== userId) {
      throw new Error("You are not authorized to join this class");
    }

    displayName = liveClass.teacher.name;
  }

  /*
   * STUDENT ACCESS
   */
  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: {
        id: userId,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.classId !== liveClass.classId) {
      throw new Error("You are not enrolled in this class");
    }

    const removed = await isStudentRemoved(liveClass.id, userId);

    if (removed) {
      throw new Error("You have been removed from this classroom");
    }

    await markLiveClassJoin(userId, liveClass.id);

    displayName = student.name;
  }

  if (!displayName) {
    throw new Error("Participant name not found");
  }

  /*
   * Generate a stable room name.
   *
   * Every participant joining the same LiveClass
   * must receive the same room name.
   */
  const roomName = `nbca-live-class-${liveClass.id}`;

  const token = await createLiveKitToken(userId, roomName, role, displayName);

  return {
    token,
    url: process.env.LIVEKIT_URL,
    roomName,
    liveClassId: liveClass.id,
    role,
    displayName,
  };
};
