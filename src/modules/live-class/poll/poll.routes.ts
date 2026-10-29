import { Router } from "express";

import { auth } from "../../../middlewares/auth";

import {
  createPollController,
  getPollController,
  votePollController,
  closePollController,
} from "./poll.controller";

const router = Router();

/* ============================================================
   GET CURRENT POLL
   Teacher + Student
============================================================ */

router.get("/:liveClassId", auth("TEACHER", "STUDENT"), getPollController);

/* ============================================================
   CREATE POLL
   Teacher only
============================================================ */

router.post("/:liveClassId", auth("TEACHER"), createPollController);

/* ============================================================
   VOTE
   Student only
============================================================ */

router.post("/:liveClassId/vote", auth("STUDENT"), votePollController);

/* ============================================================
   CLOSE POLL
   Teacher only
============================================================ */

router.post("/:liveClassId/close", auth("TEACHER"), closePollController);

export default router;
