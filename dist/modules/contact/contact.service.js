"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactMessage = void 0;
const email_service_1 = require("../../services/email/email.service");
const sendContactMessage = async (payload) => {
    await (0, email_service_1.sendEmail)(process.env.EMAIL_USER, `New Contact Form Submission - ${payload.name}`, `
      <h2>New Contact Message</h2>

      <p><strong>Name:</strong> ${payload.name}</p>

      <p><strong>Email:</strong> ${payload.email}</p>

      <p><strong>Phone:</strong> ${payload.phone || "Not Provided"}</p>

      <p><strong>Message:</strong></p>

      <p>${payload.message}</p>
    `);
    return {
        message: "Message sent successfully",
    };
};
exports.sendContactMessage = sendContactMessage;
