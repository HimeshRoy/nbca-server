"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactMessageController = void 0;
const contact_service_1 = require("./contact.service");
const sendContactMessageController = async (req, res) => {
    const result = await (0, contact_service_1.sendContactMessage)(req.body);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.sendContactMessageController = sendContactMessageController;
