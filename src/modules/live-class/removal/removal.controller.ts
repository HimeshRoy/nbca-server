import { Request, Response } from "express";
import { prisma } from "../../../config/prisma";
import { removeStudentFromClass, isStudentRemoved } from "./removal.service";

export const removeStudentController = async (req: Request, res: Response) => {
  try {
    const teacherId = (req as any).user.id;
    const liveClassId = req.params.liveClassId as string;
    const studentId = req.params.studentId as string;

    if (!liveClassId || !studentId) {
      return res.status(400).json({
        message: "Live class ID and student ID are required",
      });
    }

    // Make sure the teacher owns this live class.
    const liveClass = await prisma.liveClass.findFirst({
      where: {
        id: liveClassId,
        teacherId,
      },
    });

    if (!liveClass) {
      return res.status(404).json({
        message: "Live class not found or you are not authorized",
      });
    }

    // Make sure the student exists and belongs
    // to the same class.
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.classId !== liveClass.classId) {
      return res.status(403).json({
        message: "Student is not enrolled in this class",
      });
    }

    const roomName = `nbca-live-class-${liveClass.id}`;

    await removeStudentFromClass(liveClass.id, student.id, roomName);

    return res.status(200).json({
      success: true,
      message: "Student removed from classroom successfully",
    });
  } catch (error) {
    console.error("Remove student error:", error);

    return res.status(500).json({
      message: "Failed to remove student from classroom",
    });
  }
};

export const checkStudentRemovalController = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentId = (req as any).user.id;
    const liveClassId = req.params.liveClassId as string;

    if (!liveClassId) {
      return res.status(400).json({
        message: "Live class ID is required",
      });
    }

    const removed = await isStudentRemoved(liveClassId, studentId);

    return res.status(200).json({
      removed,
    });
  } catch (error) {
    console.error("Check student removal error:", error);

    return res.status(500).json({
      message: "Failed to check classroom removal status",
    });
  }
};
