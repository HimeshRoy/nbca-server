"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const poll_controller_1 = require("./poll.controller");
const router = (0, express_1.Router)();
/* ============================================================
   GET CURRENT POLL
   Teacher + Student
============================================================ */
router.get("/:liveClassId", (0, auth_1.auth)("TEACHER", "STUDENT"), poll_controller_1.getPollController);
/* ============================================================
   CREATE POLL
   Teacher only
============================================================ */
router.post("/:liveClassId", (0, auth_1.auth)("TEACHER"), poll_controller_1.createPollController);
/* ============================================================
   VOTE
   Student only
============================================================ */
router.post("/:liveClassId/vote", (0, auth_1.auth)("STUDENT"), poll_controller_1.votePollController);
/* ============================================================
   CLOSE POLL
   Teacher only
============================================================ */
router.post("/:liveClassId/close", (0, auth_1.auth)("TEACHER"), poll_controller_1.closePollController);
exports.default = router;
