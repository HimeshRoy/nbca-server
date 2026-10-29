"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const academic_session_routes_1 = __importDefault(require("./modules/academic-session/academic-session.routes"));
const board_routes_1 = __importDefault(require("./modules/board/board.routes"));
const class_routes_1 = __importDefault(require("./modules/class/class.routes"));
const subject_routes_1 = __importDefault(require("./modules/subject/subject.routes"));
const chapter_routes_1 = __importDefault(require("./modules/chapter/chapter.routes"));
const content_routes_1 = __importDefault(require("./modules/content/content.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const resource_routes_1 = __importDefault(require("./modules/resource/resource.routes"));
const teacher_routes_1 = __importDefault(require("./modules/teacher/teacher.routes"));
const student_routes_1 = __importDefault(require("./modules/student/student.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const teacher_resource_routes_1 = __importDefault(require("./modules/teacher-resource/teacher-resource.routes"));
const assignment_routes_1 = __importDefault(require("./modules/assignment/assignment.routes"));
const submission_routes_1 = __importDefault(require("./modules/submission/submission.routes"));
const attendance_routes_1 = __importDefault(require("./modules/attendance/attendance.routes"));
const test_routes_1 = __importDefault(require("./modules/test/test.routes"));
const question_routes_1 = __importDefault(require("./modules/question/question.routes"));
const test_attempt_routes_1 = __importDefault(require("./modules/test-attempt/test-attempt.routes"));
const result_routes_1 = __importDefault(require("./modules/result/result.routes"));
const notice_routes_1 = __importDefault(require("./modules/notice/notice.routes"));
const live_class_routes_1 = __importDefault(require("./modules/live-class/live-class.routes"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const otp_routes_1 = __importDefault(require("./modules/otp/otp.routes"));
const profile_routes_1 = __importDefault(require("./modules/profile/profile.routes"));
const contact_routes_1 = __importDefault(require("./modules/contact/contact.routes"));
const email_routes_1 = __importDefault(require("./services/email/email.routes"));
const question_bank_routes_1 = __importDefault(require("./modules/question-bank/question-bank.routes"));
const livekit_routes_1 = __importDefault(require("./modules/livekit/livekit.routes"));
const chat_routes_1 = __importDefault(require("./modules/live-class/chat/chat.routes"));
const livekit_webhook_routes_1 = __importDefault(require("./modules/livekit/livekit-webhook.routes"));
const poll_routes_1 = __importDefault(require("./modules/live-class/poll/poll.routes"));
const app = (0, express_1.default)();
app.use("/api/livekit", express_1.default.raw({
    type: "application/webhook+json",
}));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://nbca.co.in",
        "https://www.nbca.co.in",
        "*",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("NBCA Backend Running 🚀");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/academic-sessions", academic_session_routes_1.default);
app.use("/api/boards", board_routes_1.default);
app.use("/api/classes", class_routes_1.default);
app.use("/api/subjects", subject_routes_1.default);
app.use("/api/chapters", chapter_routes_1.default);
app.use("/api/contents", content_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/resources", resource_routes_1.default);
app.use("/api/teachers", teacher_routes_1.default);
app.use("/api/otp", otp_routes_1.default);
app.use("/api/students", student_routes_1.default);
app.use("/api/admins", admin_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/teacher/resources", teacher_resource_routes_1.default);
app.use("/api/assignments", assignment_routes_1.default);
app.use("/api/submissions", submission_routes_1.default);
app.use("/api/attendance", attendance_routes_1.default);
app.use("/api/tests", test_routes_1.default);
app.use("/api/questions", question_routes_1.default);
app.use("/api/test-attempts", test_attempt_routes_1.default);
app.use("/api/results", result_routes_1.default);
app.use("/api/notices", notice_routes_1.default);
app.use("/api/live-classes", live_class_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.use("/api/contact", contact_routes_1.default);
app.use("/api/email", email_routes_1.default);
app.use("/api/question-banks", question_bank_routes_1.default);
app.use("/api/livekit", livekit_routes_1.default);
app.use("/api/livekit", livekit_webhook_routes_1.default);
app.use("/api/live-class/chat", chat_routes_1.default);
app.use("/api/live-class/poll", poll_routes_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
