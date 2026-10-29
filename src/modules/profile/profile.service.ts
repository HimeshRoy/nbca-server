import { prisma } from "../../config/prisma";
import { deleteFileFromCloudinaryByUrl } from "../../services/cloudinary/cloudinary.service";

export const getMyProfile = async (studentId: string) => {
  return prisma.student.findUnique({
    where: {
      id: studentId,
    },

    include: {
      board: true,
      class: true,
      academicSession: true,
      teacher: true,
    },
  });
};

export const updateMyProfile = async (studentId: string, payload: any) => {
  const updateData: any = {};

  if (payload.name !== undefined) updateData.name = payload.name;

  if (payload.email !== undefined) updateData.email = payload.email;

  if (payload.phone !== undefined) updateData.phone = payload.phone;

  if (payload.gender !== undefined) updateData.gender = payload.gender;

  if (payload.address !== undefined) updateData.address = payload.address;

  if (payload.guardianName !== undefined)
    updateData.guardianName = payload.guardianName;

  if (payload.guardianPhone !== undefined)
    updateData.guardianPhone = payload.guardianPhone;

  if (payload.photo) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        photo: true,
        photoUpdateCount: true,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.photo !== payload.photo) {
      if (student.photoUpdateCount >= 3) {
        throw new Error(
          "You have reached the maximum profile photo update limit.",
        );
      }

      if (student.photo) {
        try {
          await deleteFileFromCloudinaryByUrl(student.photo);
        } catch (error) {
          console.error(
            "Failed to delete old profile photo from Cloudinary:",
            error,
          );

          throw new Error("Failed to delete old profile photo");
        }
      }

      updateData.photo = payload.photo;

      updateData.photoUpdateCount = {
        increment: 1,
      };
    }
  }

  return prisma.student.update({
    where: {
      id: studentId,
    },
    data: updateData,
    include: {
      board: true,
      class: true,
      academicSession: true,
      teacher: true,
    },
  });
};

export const getStudentIdCard = async (studentId: string) => {
  return prisma.student.findUnique({
    where: {
      id: studentId,
    },

    include: {
      board: true,
      class: true,
      academicSession: true,
    },
  });
};

export const verifyStudentCard = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: {
      studentId,
    },

    include: {
      board: true,
      class: true,
      academicSession: true,
    },
  });

  if (!student) {
    throw new Error("Invalid Student ID");
  }

  return {
    valid: true,
    studentId: student.studentId,
    name: student.name,
    board: student.board.name,
    class: student.class.name,
    status: student.isActive ? "ACTIVE" : "INACTIVE",
    session: student.academicSession.name,
  };
};
