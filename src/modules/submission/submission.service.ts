import { prisma } from "../../config/prisma";

export const submitAssignment = async (
  studentId: string,
  assignmentId: string,
  payload: any,
) => {
  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (new Date() > assignment.dueDate) {
    throw new Error("Assignment submission deadline has passed.");
  }

  const existingSubmission = await prisma.assignmentSubmission.findFirst({
    where: {
      assignmentId,
      studentId,
    },
  });

  if (existingSubmission) {
    throw new Error("Assignment already submitted");
  }

  return prisma.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId,
      fileUrl: payload.fileUrl,
    },

    include: {
      assignment: true,
      student: true,
    },
  });
};

export const getMySubmissions = async (studentId: string) => {
  return prisma.assignmentSubmission.findMany({
    where: {
      studentId,
    },

    include: {
      assignment: true,
    },

    orderBy: {
      submittedAt: "desc",
    },
  });
};

export const getAssignmentSubmissions = async (assignmentId: string) => {
  return prisma.assignmentSubmission.findMany({
    where: {
      assignmentId,
    },

    include: {
      student: true,
    },
  });
};

export const evaluateSubmission = async (
  submissionId: string,
  payload: {
    marks: number;
    remarks?: string;
  },
) => {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: {
      id: submissionId,
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }
  if (payload.marks < 0) {
    throw new Error("Invalid marks");
  }

  return prisma.assignmentSubmission.update({
    where: {
      id: submissionId,
    },

    data: {
      marks: payload.marks,
      remarks: payload.remarks,
    },
  });
};
