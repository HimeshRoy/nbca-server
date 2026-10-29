"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudentIdCard = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const prisma_1 = require("../../config/prisma");
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const generateStudentIdCard = async (studentId) => {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id: studentId,
        },
        include: {
            board: true,
            class: true,
            academicSession: true,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    // Generate QR Code
    const verificationUrl = `https://nbca.co.in/verify/${student.studentId}`;
    const qrCodeDataUrl = await qrcode_1.default.toDataURL(verificationUrl);
    const qrImage = Buffer.from(qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
    // Load Student Photo
    let photoBuffer = null;
    if (student.photo) {
        try {
            const response = await fetch(student.photo);
            const arrayBuffer = await response.arrayBuffer();
            const originalBuffer = Buffer.from(arrayBuffer);
            photoBuffer = await (0, sharp_1.default)(originalBuffer)
                .resize(70, 70, {
                fit: "cover",
                position: "centre",
            })
                .png({
                compressionLevel: 0,
            })
                .toBuffer();
        }
        catch (error) {
            console.error("Failed to load student photo:", error);
        }
    }
    const doc = new pdfkit_1.default({
        size: [350, 220],
        margin: 20,
    });
    const logoPath = path_1.default.join(process.cwd(), "src", "assets", "nbca-logo.png");
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    return new Promise((resolve, reject) => {
        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });
        doc.on("error", reject);
        // Header Background
        doc.rect(0, 0, 350, 45).fill("#1E3A8A");
        // Logo
        try {
            doc.image(logoPath, 15, 8, {
                fit: [28, 28],
                align: "center",
                valign: "center",
            });
        }
        catch (error) {
            console.error("Logo load failed");
        }
        // Academy Name
        doc
            .fillColor("white")
            .font("Helvetica-Bold")
            .fontSize(14)
            .text("North Bengal Cloud Academy", 52, 10);
        doc.font("Helvetica").fontSize(8).text("Student Identity Card", 52, 27);
        doc.fillColor("black");
        // Student Photo
        doc.lineWidth(1.5).strokeColor("#1E40AF").rect(18, 58, 74, 74).stroke();
        if (photoBuffer) {
            doc.image(photoBuffer, 20, 60, {
                width: 70,
                height: 70,
            });
        }
        // Student Details
        doc.fontSize(10);
        doc.text(`Name: ${student.name}`, 110, 60);
        doc.text(`Student ID: ${student.studentId}`, 110, 80);
        doc.text(`Class: ${student.class.name}`, 110, 100);
        doc.text(`Board: ${student.board.name}`, 110, 120);
        doc.text(`Session: ${student.academicSession.name}`, 110, 140);
        doc.text(`Guardian: ${student.guardianName || "-"}`, 110, 160);
        // QR Code
        doc.image(qrImage, 255, 120, {
            width: 70,
        });
        doc.rect(5, 5, 340, 210).stroke("#1E40AF");
        doc.end();
    });
};
exports.generateStudentIdCard = generateStudentIdCard;
