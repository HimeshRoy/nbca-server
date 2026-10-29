"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveClassTemplate = void 0;
const liveClassTemplate = (studentName, title, subject, teacher, startTime) => {
    return `
    <h2>New Live Class Scheduled</h2>

    <p>Hello ${studentName},</p>

    <p>A new live class has been scheduled on NBCA.</p>

    <ul>
      <li><strong>Title:</strong> ${title}</li>
      <li><strong>Subject:</strong> ${subject}</li>
      <li><strong>Teacher:</strong> ${teacher}</li>
      <li><strong>Start Time:</strong> ${startTime}</li>
    </ul>

    <p>
      You can join this class from your NBCA student dashboard when the
      session is available.
    </p>

    <p>
      Best Regards,<br/>
      NBCA Team
    </p>
  `;
};
exports.liveClassTemplate = liveClassTemplate;
