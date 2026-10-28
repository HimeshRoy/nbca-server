import { prisma } from "../../config/prisma";

export const createAttendance = async (
  teacherId: string,
  payload: {
    studentId: string;
    status: "PRESENT" | "ABSENT" | "LATE";
    liveClassId?: string;
  },
) => {
  const today = new Date();

  const existingAttendance =
    await prisma.attendance.findFirst({
      where: {
        studentId: payload.studentId,

        date: {
          gte: new Date(
            today.setHours(0, 0, 0, 0),
          ),

          lte: new Date(
            today.setHours(23, 59, 59, 999),
          ),
        },

        ...(payload.liveClassId
          ? {
              liveClassId:
                payload.liveClassId,
            }
          : {}),
      },
    });

  if (existingAttendance) {
    throw new Error(
      "Attendance already marked",
    );
  }

  return prisma.attendance.create({
    data: {
      studentId: payload.studentId,

      status: payload.status,

      teacherId,

      liveClassId:
        payload.liveClassId || null,

      date: new Date(),
    },

    include: {
      student: true,
      teacher: true,
      liveClass: true,
    },
  });
};

export const getAttendance = async (
  teacherId: string,
) => {
  return prisma.attendance.findMany({
    where: {
      teacherId,
    },

    include: {
      student: true,
      liveClass: true,
    },

    orderBy: {
      date: "desc",
    },
  });
};

export const getMyAttendance = async (
  studentId: string,
) => {
  return prisma.attendance.findMany({
    where: {
      studentId,
    },

    include: {
      liveClass: true,
    },

    orderBy: {
      date: "desc",
    },
  });
};


/* -----------------------------------------
   LIVE CLASS ATTENDANCE
------------------------------------------ */

export const markLiveClassJoin = async (
  studentId: string,
  liveClassId: string,
) => {
  const liveClass =
    await prisma.liveClass.findUnique({
      where: {
        id: liveClassId,
      },
    });

  if (!liveClass) {
    throw new Error(
      "Live class not found",
    );
  }

  const existingAttendance =
    await prisma.attendance.findUnique({
      where: {
        studentId_liveClassId: {
          studentId,
          liveClassId,
        },
      },
    });

  if (existingAttendance) {
    return existingAttendance;
  }

  return prisma.attendance.create({
    data: {
      studentId,

      teacherId:
        liveClass.teacherId,

      liveClassId,

      date: new Date(),

      status: "PRESENT",

      joinedAt: new Date(),
    },
  });
};


export const markLiveClassLeave = async (
  studentId: string,
  liveClassId: string,
) => {
  const attendance =
    await prisma.attendance.findUnique({
      where: {
        studentId_liveClassId: {
          studentId,
          liveClassId,
        },
      },
    });

  if (!attendance) {
    return null;
  }

  if (!attendance.joinedAt) {
    return attendance;
  }

  const leftAt = new Date();

  const duration = Math.max(
    0,
    Math.floor(
      (leftAt.getTime() -
        attendance.joinedAt.getTime()) /
        1000,
    ),
  );

  return prisma.attendance.update({
    where: {
      id: attendance.id,
    },

    data: {
      leftAt,

      duration,
    },
  });
};