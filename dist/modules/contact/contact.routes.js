"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
router.post("/", contact_controller_1.sendContactMessageController);
exports.default = router;
