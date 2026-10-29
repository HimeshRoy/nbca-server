"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = require("./email.controller");
const router = (0, express_1.Router)();
router.post("/test-email", email_controller_1.testEmailController);
exports.default = router;
