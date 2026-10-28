import { prisma } from "../../config/prisma";
import { sendEmail } from "../../services/email/email.service";
import { liveClassTemplate } from "../../services/email/templates/live-class.template";
import { clearClassroomChat } from "./chat/chat.service";

export const createLiveClass = async (teacherId: string, payload: any) => {
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);

  if (startTime >= endTime) {
    throw new Error("End time must be later than the start time.");
  }

  const existingClass = await prisma.liveClass.findFirst({
    where: {
      teacherId,

      isActive: true,

      AND: [
        {
          startTime: {
            lt: new Date(payload.endTime),
          },
        },
        {
          endTime: {
            gt: new Date(payload.startTime),
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

  const liveClass = await prisma.liveClass.create({
    data: {
      title: payload.title,
      description: payload.description,
      meetingLink: payload.meetingLink,
      startTime: payload.startTime,
      endTime: payload.endTime,

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

  const students = await prisma.student.findMany({
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
            liveClass.meetingLink,
            liveClass.startTime,
          ),
        ),
      ),
  );

  return liveClass;
};

export const getLiveClasses = async (teacherId: string) => {
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

export const getLiveClassById = async (teacherId: string, id: string) => {
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

export const updateLiveClass = async (
  teacherId: string,
  id: string,
  payload: any,
) => {
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);

  if (startTime >= endTime) {
    throw new Error("End time must be later than the start time.");
  }

  const liveClass = await prisma.liveClass.findFirst({
    where: {
      id,
      teacherId,
    },
  });

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  const existingClass = await prisma.liveClass.findFirst({
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
      meetingLink: payload.meetingLink,
      startTime,
      endTime,
      classId: payload.classId,
      subjectId: payload.subjectId,
      isActive: payload.isActive,
    },

    include: {
      teacher: true,
      class: true,
      subject: true,
    },
  });
};

export const deleteLiveClass = async (teacherId: string, id: string) => {
  const liveClass = await prisma.liveClass.findFirst({
    where: {
      id,
      teacherId,
    },
  });

  if (!liveClass) {
    throw new Error("Live Class not found");
  }

  return prisma.liveClass.delete({
    where: {
      id,
    },
  });
};

export const endLiveClass = async (teacherId: string, id: string) => {
  const liveClass = await prisma.liveClass.findFirst({
    where: {
      id,
      teacherId,
    },
  });

  if (!liveClass) {
    throw new Error("Live class not found");
  }

  // Delete temporary classroom chat
  await clearClassroomChat(id);

  // End the live class
  const endedClass = await prisma.liveClass.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
    include: {
      teacher: true,
      class: true,
      subject: true,
    },
  });

  return endedClass;
};

export const getUpcomingClasses = async () => {
  return prisma.liveClass.findMany({
    where: {
      startTime: {
        gte: new Date(),
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

export const getStudentLiveClasses = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const liveClasses = await prisma.liveClass.findMany({
    where: {
      classId: student.classId,
      isActive: true,
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

  const now = new Date();

  return liveClasses.map((liveClass) => {
    const joinTime = new Date(liveClass.startTime);

    joinTime.setMinutes(joinTime.getMinutes() - 10);

    let status: "UPCOMING" | "LIVE" | "COMPLETED";

    if (now < liveClass.startTime) {
      status = "UPCOMING";
    } else if (now > liveClass.endTime) {
      status = "COMPLETED";
    } else {
      status = "LIVE";
    }

    return {
      ...liveClass,

      status,

      canJoin: now >= joinTime && now <= liveClass.endTime,

      hasAttended: liveClass.attendances.length > 0,

      meetingLink:
        now >= joinTime && now <= liveClass.endTime
          ? liveClass.meetingLink
          : null,
    };
  });
};

export const joinLiveClass = async (studentId: string, liveClassId: string) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const liveClass = await prisma.liveClass.findFirst({
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
    throw new Error("You are not allowed to access this class.");
  }

  const now = new Date();

  const joinTime = new Date(liveClass.startTime);

  const JOIN_WINDOW_MINUTES = 5;

  joinTime.setMinutes(joinTime.getMinutes() - JOIN_WINDOW_MINUTES);

  if (now < joinTime) {
    throw new Error("You can join this class only 5 minutes before it starts.");
  }

  if (now > liveClass.endTime) {
    throw new Error("This live class has already ended.");
  }

  if (!liveClass.meetingLink) {
    throw new Error("Meeting link is not available.");
  }

  await prisma.attendance.upsert({
    where: {
      studentId_liveClassId: {
        studentId,
        liveClassId: liveClass.id,
      },
    },

    update: {
      status: "PRESENT",
      date: new Date(),
    },

    create: {
      date: new Date(),
      status: "PRESENT",
      studentId,
      teacherId: liveClass.teacherId,
      liveClassId: liveClass.id,
    },
  });

  return {
    message: "Live class joined successfully.",
    meetingLink: liveClass.meetingLink,
    liveClass,
  };
};

export const getLiveClassAttendance = async (
  teacherId: string,
  liveClassId: string,
) => {
  const liveClass = await prisma.liveClass.findFirst({
    where: {
      id: liveClassId,
      teacherId,
    },
  });

  if (!liveClass) {
    throw new Error("Live class not found");
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

export const getLiveClassStats = async (teacherId: string) => {
  const now = new Date();

  const totalClasses = await prisma.liveClass.count({
    where: {
      teacherId,
    },
  });

  const upcomingClasses = await prisma.liveClass.count({
    where: {
      teacherId,
      startTime: {
        gt: now,
      },
    },
  });

  const completedClasses = await prisma.liveClass.count({
    where: {
      teacherId,
      endTime: {
        lt: now,
      },
    },
  });

  const totalAttendance = await prisma.attendance.count({
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
