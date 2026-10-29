import express from "express";
import cors from "cors";
import academicSessionRoutes from "./modules/academic-session/academic-session.routes";
import boardRoutes from "./modules/board/board.routes";
import classRoutes from "./modules/class/class.routes";
import subjectRoutes from "./modules/subject/subject.routes";
import chapterRoutes from "./modules/chapter/chapter.routes";
import contentRoutes from "./modules/content/content.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import resourceRoutes from "./modules/resource/resource.routes";
import teacherRoutes from "./modules/teacher/teacher.routes";
import studentRoutes from "./modules/student/student.routes";
import adminRoutes from "./modules/admin/admin.routes";
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import teacherResourceRoutes from "./modules/teacher-resource/teacher-resource.routes";
import assignmentRoutes from "./modules/assignment/assignment.routes";
import submissionRoutes from "./modules/submission/submission.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes";
import testRoutes from "./modules/test/test.routes";
import questionRoutes from "./modules/question/question.routes";
import testAttemptRoutes from "./modules/test-attempt/test-attempt.routes";
import resultRoutes from "./modules/result/result.routes";
import noticeRoutes from "./modules/notice/notice.routes";
import liveClassRoutes from "./modules/live-class/live-class.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import otpRoutes from "./modules/otp/otp.routes";
import profileRoutes from "./modules/profile/profile.routes";
import contactRoutes from "./modules/contact/contact.routes";
import emailRoutes from "./services/email/email.routes";
import questionBankRoutes from "./modules/question-bank/question-bank.routes";
import liveKitRoutes from "./modules/livekit/livekit.routes";
import chatRoutes from "./modules/live-class/chat/chat.routes";
import liveKitWebhookRoutes from "./modules/livekit/livekit-webhook.routes";
import pollRoutes from "./modules/live-class/poll/poll.routes";

const app = express();

app.use(
  "/api/livekit",
  express.raw({
    type: "application/webhook+json",
  }),
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nbca.co.in",
      "https://www.nbca.co.in",
      "*",
    ],

    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("NBCA Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/academic-sessions", academicSessionRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/teacher/resources", teacherResourceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/test-attempts", testAttemptRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/live-classes", liveClassRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/question-banks", questionBankRoutes);
app.use("/api/livekit", liveKitRoutes);
app.use("/api/livekit", liveKitWebhookRoutes);
app.use("/api/live-class/chat", chatRoutes);
app.use("/api/live-class/poll", pollRoutes);

app.use(globalErrorHandler);

export default app;
