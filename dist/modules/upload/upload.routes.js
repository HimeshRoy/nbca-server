"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../../middlewares/upload");
const upload_controller_1 = require("./upload.controller");
const router = (0, express_1.Router)();
router.post("/", upload_1.upload.single("file"), upload_controller_1.uploadFile);
router.delete("/:id", upload_controller_1.deleteFile);
exports.default = router;
