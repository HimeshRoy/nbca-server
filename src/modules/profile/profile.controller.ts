import { Request, Response } from "express";
import { uploadFileToCloudinary } from "../../services/cloudinary/cloudinary.service";
import {
  getMyProfile,
  updateMyProfile,
  getStudentIdCard,
  verifyStudentCard,
} from "./profile.service";
import { generateStudentIdCard } from "./id-card.service";
export const getMyProfileController = async (req: Request, res: Response) => {
  const result = await getMyProfile((req as any).user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const updateMyProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    let photo: string | undefined;

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      photo = uploadResult.secure_url;
    }

    const result = await updateMyProfile(user.id, {
      ...req.body,
      ...(photo && { photo }),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Profile update failed:", error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Profile update failed",
    });
  }
};

export const getStudentIdCardController = async (
  req: Request,
  res: Response,
) => {
  const result = await getStudentIdCard((req as any).user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const viewStudentIdCardController = async (
  req: Request,
  res: Response,
) => {
  const pdf = await generateStudentIdCard((req as any).user.id);

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader("Content-Disposition", 'inline; filename="NBCA-ID-Card.pdf"');

  res.send(pdf);
};

export const verifyStudentCardController = async (
  req: Request,
  res: Response,
) => {
  const result = await verifyStudentCard(req.params.studentId as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const downloadStudentIdCardController = async (
  req: Request,
  res: Response,
) => {
  const pdf = await generateStudentIdCard((req as any).user.id);

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="NBCA-ID-Card.pdf"',
  );

  res.send(pdf);
};
