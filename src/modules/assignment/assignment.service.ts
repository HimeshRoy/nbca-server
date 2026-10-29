import { prisma } from "../../config/prisma";
import { deleteFileFromCloudinaryByUrl } from "../../services/cloudinary/cloudinary.service";

export const createAssignment = async (teacherId: string, payload: any) => {
  return prisma.assignment.create({
    data: {
      title: payload.title,

      description: payload.description,

      fileUrl: payload.fileUrl,

      dueDate: new Date(payload.dueDate),

      maxMarks: payload.maxMarks,

      classId: payload.classId,

      subjectId: payload.subjectId,

      teacherId,
    },

    include: {
      class: {
        include: {
          board: true,
        },
      },

      subject: true,
    },
  });
};

export const getAssignments = async (teacherId: string) => {
  return prisma.assignment.findMany({
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

      submissions: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAssignmentById = async (teacherId: string, id: string) => {
  return prisma.assignment.findFirst({
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

      submissions: {
        include: {
          student: true,
        },
      },
    },
  });
};

export const updateAssignment = async (
  teacherId: string,
  id: string,
  payload: any,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      id,
      teacherId,
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return prisma.assignment.update({
    where: {
      id,
    },

    data: payload,
  });
};

export const deleteAssignment = async (teacherId: string, id: string) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      id,
      teacherId,
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  // Delete the assignment file from Cloudinary
  if (assignment.fileUrl) {
    try {
      await deleteFileFromCloudinaryByUrl(assignment.fileUrl);
    } catch (error) {
      console.error("Failed to delete assignment file from Cloudinary:", error);

      throw new Error("Failed to delete assignment file");
    }
  }

  // Delete the assignment from the database
  return prisma.assignment.delete({
    where: {
      id,
    },
  });
};

export const getStudentAssignments = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      classId: student.classId,
      subject: {
        boardId: student.boardId,
      },
    },

    include: {
      subject: true,
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
      submissions: {
        where: {
          studentId,
        },
      },
    },

    orderBy: {
      dueDate: "asc",
    },
  });

  return assignments.map((assignment) => ({
    ...assignment,
    status: assignment.submissions.length > 0 ? "SUBMITTED" : "PENDING",
    isOverdue:
      assignment.submissions.length === 0 &&
      new Date(assignment.dueDate) < new Date(),
  }));
};

export const getStudentAssignmentById = async (
  studentId: string,
  assignmentId: string,
) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,

      classId: student.classId,

      subject: {
        boardId: student.boardId,
      },
    },

    include: {
      subject: true,

      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      submissions: {
        where: {
          studentId,
        },
      },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return {
    ...assignment,

    status: assignment.submissions.length > 0 ? "SUBMITTED" : "PENDING",

    submission: assignment.submissions[0] || null,
  };
};
