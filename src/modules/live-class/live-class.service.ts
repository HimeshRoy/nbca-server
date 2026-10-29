import { prisma } from "../../config/prisma";
import { sendEmail } from "../../services/email/email.service";
import { liveClassTemplate } from "../../services/email/templates/live-class.template";
import { clearClassroomChat } from "./chat/chat.service";

/**
 * Parse and validate a date value.
 */
const parseDate = (
  value: any,
  fieldName: string,
): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `${fieldName} must be a valid date.`,
    );
  }

  return date;
};

/**
 * Calculate the current live-class status.
 *
 * Priority:
 * 1. Manually ended / inactive class -> COMPLETED
 * 2. Before start time -> UPCOMING
 * 3. Between start and end -> LIVE
 * 4. After end time -> COMPLETED
 */
const getLiveClassStatus = (
  isActive: boolean,
  startTime: Date,
  endTime: Date,
  now: Date,
): "UPCOMING" | "LIVE" | "COMPLETED" => {
  if (!isActive) {
    return "COMPLETED";
  }

  if (now < startTime) {
    return "UPCOMING";
  }

  if (now <= endTime) {
    return "LIVE";
  }

  return "COMPLETED";
};

/**
 * Create a new live class.
 */
export const createLiveClass = async (
  teacherId: string,
  payload: any,
) => {
  const startTime = parseDate(
    payload.startTime,
    "Start time",
  );

  const endTime = parseDate(
    payload.endTime,
    "End time",
  );

  if (startTime >= endTime) {
    throw new Error(
      "End time must be later than the start time.",
    );
  }

  /**
   * Prevent the same teacher from having
   * overlapping active classes.
   */
  const existingClass =
    await prisma.liveClass.findFirst({
      where: {
        teacherId,
        isActive: true,

        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

  if (existingClass) {
    throw new Error(
      "You already have another live class scheduled during this time.",
    );
  }

  const liveClass =
    await prisma.liveClass.create({
      data: {
        title: payload.title,
        description: payload.description,

        startTime,
        endTime,

        teacherId,
        classId: payload.classId,
        subjectId: payload.subjectId,
      },

      include: {
        teacher: true,
        class: true,
        subject: true,
      },
    });

  /**
   * Get active students from the selected class
   * so they can receive the live-class email.
   */
  const students =
    await prisma.student.findMany({
      where: {
        classId: payload.classId,
        isActive: true,
      },
    });

  await Promise.all(
    students
      .filter((student) => student.email)
      .map((student) =>
        sendEmail(
          student.email!,
          `New Live Class - ${liveClass.title}`,
          liveClassTemplate(
            student.name,
            liveClass.title,
            liveClass.subject.name,
            liveClass.teacher.name,
            liveClass.startTime,
          ),
        ),
      ),
  );

  return liveClass;
};

/**
 * Get all live classes created by a teacher.
 */
export const getLiveClasses = async (
  teacherId: string,
) => {
  return prisma.liveClass.findMany({
    where: {
      teacherId,
    },

    include: {
      class: {
        include: {
          board: true,
        },
      },

      subject: true,

      teacher: true,
    },

    orderBy: {
      startTime: "asc",
    },
  });
};

/**
 * Get a single live class belonging to a teacher.
 */
export const getLiveClassById = async (
  teacherId: string,
  id: string,
) => {
  return prisma.liveClass.findFirst({
    where: {
      id,
      teacherId,
    },

    include: {
      class: {
        include: {
          board: true,
        },
      },

      subject: true,

      teacher: true,
    },
  });
};

/**
 * Update a live class.
 */
export const updateLiveClass = async (
  teacherId: string,
  id: string,
  payload: any,
) => {
  const startTime = parseDate(
    payload.startTime,
    "Start time",
  );

  const endTime = parseDate(
    payload.endTime,
    "End time",
  );

  if (startTime >= endTime) {
    throw new Error(
      "End time must be later than the start time.",
    );
  }

  const liveClass =
    await prisma.liveClass.findFirst({
      where: {
        id,
        teacherId,
      },
    });

  if (!liveClass) {
    throw new Error(
      "Live class not found.",
    );
  }

  /**
   * Prevent overlapping active classes
   * for the same teacher.
   *
   * The current class is excluded.
   */
  const existingClass =
    await prisma.liveClass.findFirst({
      where: {
        teacherId,

        id: {
          not: id,
        },

        isActive: true,

        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

  if (existingClass) {
    throw new Error(
      "You already have another live class scheduled during this time.",
    );
  }

  return prisma.liveClass.update({
    where: {
      id,
    },

    data: {
      title: payload.title,
      description: payload.description,

      startTime,
      endTime,

      classId: payload.classId,
      subjectId: payload.subjectId,

      /**
       * Preserve existing isActive behaviour.
       *
       * Normal editing does not change the active
       * state unless the frontend explicitly sends it.
       */
      ...(typeof payload.isActive === "boolean"
        ? {
            isActive: payload.isActive,
          }
        : {}),
    },

    include: {
      teacher: true,
      class: true,
      subject: true,
    },
  });
};

/**
 * Delete a live class.
 */
export const deleteLiveClass = async (
  teacherId: string,
  id: string,
) => {
  const liveClass =
    await prisma.liveClass.findFirst({
      where: {
        id,
        teacherId,
      },
    });

  if (!liveClass) {
    throw new Error(
      "Live Class not found",
    );
  }

  return prisma.liveClass.delete({
    where: {
      id,
    },
  });
};

/**
 * End a currently running live class.
 *
 * IMPORTANT:
 * When a teacher manually ends a class:
 *
 * isActive = false
 * endTime = current time
 *
 * This prevents the teacher and student sides
 * from showing contradictory LIVE/COMPLETED states.
 */
export const endLiveClass = async (
  teacherId: string,
  id: string,
) => {
  const liveClass =
    await prisma.liveClass.findFirst({
      where: {
        id,
        teacherId,
      },
    });

  if (!liveClass) {
    throw new Error(
      "Live class not found",
    );
  }

  /**
   * If the class is already inactive,
   * simply return it.
   *
   * This makes the endpoint safe against
   * duplicate End Class requests.
   */
  if (!liveClass.isActive) {
    return liveClass;
  }

  /**
   * Delete temporary classroom chat.
   */
  await clearClassroomChat(id);

  /**
   * Manually end the class.
   *
   * The actual end time becomes the time
   * when the teacher clicked End Class.
   */
  const endedClass =
    await prisma.liveClass.update({
      where: {
        id,
      },

      data: {
        isActive: false,
        endTime: new Date(),
      },

      include: {
        teacher: true,
        class: true,
        subject: true,
      },
    });

  return endedClass;
};

/**
 * Get upcoming classes.
 */
export const getUpcomingClasses =
  async () => {
    const now = new Date();

    return prisma.liveClass.findMany({
      where: {
        startTime: {
          gte: now,
        },

        isActive: true,
      },

      include: {
        teacher: true,
        class: true,
        subject: true,
      },

      orderBy: {
        startTime: "asc",
      },
    });
  };

/**
 * Get live classes for a student.
 *
 * IMPORTANT:
 * We intentionally DO NOT filter by isActive here.
 *
 * Why?
 *
 * The student page has:
 * - UPCOMING
 * - LIVE
 * - COMPLETED
 *
 * Therefore completed classes must also be returned.
 *
 * A manually ended class has isActive=false and will
 * correctly appear as COMPLETED.
 */
export const getStudentLiveClasses = async (
  studentId: string,
) => {
  const student =
    await prisma.student.findUnique({
      where: {
        id: studentId,
      },

      select: {
        id: true,
        name: true,
        classId: true,
        isActive: true,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found",
    );
  }

  if (!student.isActive) {
    throw new Error(
      "Student account is inactive",
    );
  }

  const now = new Date();

  /**
   * Get all live classes belonging to
   * the student's class.
   */
  const liveClasses =
    await prisma.liveClass.findMany({
      where: {
        classId: student.classId,
      },

      include: {
        teacher: true,
        class: true,
        subject: true,

        attendances: {
          where: {
            studentId,
          },

          select: {
            id: true,
          },
        },
      },

      orderBy: {
        startTime: "asc",
      },
    });

  return liveClasses.map(
    (liveClass) => {
      /**
       * Student can join 10 minutes
       * before the scheduled start.
       */
      const joinTime = new Date(
        liveClass.startTime,
      );

      joinTime.setMinutes(
        joinTime.getMinutes() - 10,
      );

      const status =
        getLiveClassStatus(
          liveClass.isActive,
          liveClass.startTime,
          liveClass.endTime,
          now,
        );

      return {
        ...liveClass,

        status,

        /**
         * Student can join only when:
         *
         * 1. Class is active
         * 2. Join window has started
         * 3. Class has not ended
         */
        canJoin:
          liveClass.isActive &&
          now >= joinTime &&
          now <= liveClass.endTime,

        hasAttended:
          liveClass.attendances.length > 0,
      };
    },
  );
};

/**
 * Legacy student join validation.
 *
 * The actual classroom connection is handled
 * by the LiveKit room token flow.
 */
export const joinLiveClass = async (
  studentId: string,
  liveClassId: string,
) => {
  const student =
    await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found",
    );
  }

  if (!student.isActive) {
    throw new Error(
      "Student account is inactive",
    );
  }

  const liveClass =
    await prisma.liveClass.findFirst({
      where: {
        id: liveClassId,
        classId: student.classId,
        isActive: true,
      },

      include: {
        teacher: true,
        class: true,
        subject: true,
      },
    });

  if (!liveClass) {
    throw new Error(
      "You are not allowed to access this class.",
    );
  }

  const now = new Date();

  /**
   * Same 10-minute join window used
   * by getStudentLiveClasses().
   */
  const joinTime = new Date(
    liveClass.startTime,
  );

  const JOIN_WINDOW_MINUTES = 10;

  joinTime.setMinutes(
    joinTime.getMinutes() -
      JOIN_WINDOW_MINUTES,
  );

  if (now < joinTime) {
    throw new Error(
      "You can join this class only 10 minutes before it starts.",
    );
  }

  if (now > liveClass.endTime) {
    throw new Error(
      "This live class has already ended.",
    );
  }

  return {
    message:
      "Live class access granted.",

    liveClass,
  };
};

/**
 * Get attendance for a specific live class.
 */
export const getLiveClassAttendance =
  async (
    teacherId: string,
    liveClassId: string,
  ) => {
    const liveClass =
      await prisma.liveClass.findFirst({
        where: {
          id: liveClassId,
          teacherId,
        },
      });

    if (!liveClass) {
      throw new Error(
        "Live class not found",
      );
    }

    return prisma.attendance.findMany({
      where: {
        liveClassId,
      },

      include: {
        student: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  };

/**
 * Get live-class statistics for a teacher.
 */
export const getLiveClassStats = async (
  teacherId: string,
) => {
  const now = new Date();

  /**
   * Total classes created by teacher.
   */
  const totalClasses =
    await prisma.liveClass.count({
      where: {
        teacherId,
      },
    });

  /**
   * Upcoming means:
   * - still active
   * - start time is in the future
   */
  const upcomingClasses =
    await prisma.liveClass.count({
      where: {
        teacherId,

        isActive: true,

        startTime: {
          gt: now,
        },
      },
    });

  /**
   * Completed means either:
   *
   * 1. Teacher manually ended it
   *    -> isActive=false
   *
   * OR
   *
   * 2. Scheduled end time has passed.
   */
  const completedClasses =
    await prisma.liveClass.count({
      where: {
        teacherId,

        OR: [
          {
            isActive: false,
          },

          {
            endTime: {
              lt: now,
            },
          },
        ],
      },
    });

  /**
   * Total attendance records belonging
   * to live classes.
   */
  const totalAttendance =
    await prisma.attendance.count({
      where: {
        teacherId,

        liveClassId: {
          not: null,
        },
      },
    });

  return {
    totalClasses,
    upcomingClasses,
    completedClasses,
    totalAttendance,
  };
};