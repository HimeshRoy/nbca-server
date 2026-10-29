"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const sendEmail = async (to, subject, html) => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: {
                name: "NBCA",
                email: "info@nbca.co.in",
            },
            to: [
                {
                    email: to,
                },
            ],
            subject,
            htmlContent: html,
        }),
    });
    const data = await response.json();
    console.log("BREVO RESPONSE:", data);
    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }
    return data;
};
exports.sendEmail = sendEmail;
