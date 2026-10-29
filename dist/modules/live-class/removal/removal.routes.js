"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const removal_controller_1 = require("./removal.controller");
const router = (0, express_1.Router)();
router.delete("/:liveClassId/students/:studentId", (0, auth_1.auth)("TEACHER"), removal_controller_1.removeStudentController);
router.get("/:liveClassId/status", (0, auth_1.auth)("STUDENT"), removal_controller_1.checkStudentRemovalController);
exports.default = router;
