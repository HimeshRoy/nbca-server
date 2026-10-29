import { Request, Response } from "express";

import {
  closePoll,
  createPoll,
  getActivePoll,
  votePoll,
  hasStudentVoted,
} from "./poll.service";

/* ============================================================
   GET POLL
============================================================ */

export const getPollController = async (req: Request, res: Response) => {
  try {
    const liveClassId = req.params.liveClassId as string;

    if (!liveClassId) {
      return res.status(400).json({
        message: "Live class ID is required.",
      });
    }

    const poll = await getActivePoll(liveClassId);

    const user = (req as any).user;

    if (!poll) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    /* ========================================================
       STUDENT + ACTIVE POLL
       
       Do NOT reveal correct answer.
       ======================================================== */

    if (user?.role === "STUDENT" && poll.isActive) {
      const hasVoted = user?.id
        ? await hasStudentVoted(liveClassId, user.id)
        : false;

      const studentPoll = {
        ...poll,
        correctOptionId: undefined,
        hasVoted,
      };

      return res.status(200).json({
        success: true,
        data: studentPoll,
      });
    }

    /* ========================================================
       TEACHER
       OR
       STUDENT + CLOSED POLL
       
       Correct answer is allowed here.
       ======================================================== */

    let hasVoted = false;

    if (user?.role === "STUDENT" && user?.id) {
      hasVoted = await hasStudentVoted(liveClassId, user.id);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...poll,
        hasVoted,
      },
    });
  } catch (error) {
    console.error("Get poll error:", error);

    return res.status(500).json({
      message: "Failed to load poll.",
    });
  }
};

/* ============================================================
   CREATE POLL
============================================================ */

export const createPollController = async (req: Request, res: Response) => {
  try {
    const liveClassId = req.params.liveClassId as string;

    const { question, options, correctOptionIndex } = req.body;

    if (!liveClassId) {
      return res.status(400).json({
        message: "Live class ID is required.",
      });
    }

    if (typeof question !== "string") {
      return res.status(400).json({
        message: "Poll question is required.",
      });
    }

    if (!Array.isArray(options)) {
      return res.status(400).json({
        message: "Poll options are required.",
      });
    }

    /* ========================================================
       CORRECT ANSWER
       ======================================================== */

    if (
      typeof correctOptionIndex !== "number" ||
      !Number.isInteger(correctOptionIndex)
    ) {
      return res.status(400).json({
        message: "Correct answer is required.",
      });
    }

    /* ========================================================
       CREATE
       ======================================================== */

    const poll = await createPoll(
      liveClassId,
      question,
      options,
      correctOptionIndex,
    );

    return res.status(201).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error("Create poll error:", error);

    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create poll.",
    });
  }
};

/* ============================================================
   VOTE
============================================================ */

export const votePollController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const liveClassId = req.params.liveClassId as string;

    const { optionId } = req.body;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!liveClassId) {
      return res.status(400).json({
        message: "Live class ID is required.",
      });
    }

    if (typeof optionId !== "string") {
      return res.status(400).json({
        message: "Poll option is required.",
      });
    }

    const poll = await votePoll(liveClassId, user.id, optionId);

    return res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error("Vote poll error:", error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to vote.",
    });
  }
};

/* ============================================================
   CLOSE POLL
============================================================ */

export const closePollController = async (req: Request, res: Response) => {
  try {
    const liveClassId = req.params.liveClassId as string;

    if (!liveClassId) {
      return res.status(400).json({
        message: "Live class ID is required.",
      });
    }

    const poll = await closePoll(liveClassId);

    return res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error("Close poll error:", error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to close poll.",
    });
  }
};
