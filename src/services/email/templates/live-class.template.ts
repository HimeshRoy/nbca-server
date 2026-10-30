export const liveClassTemplate = (
  studentName: string,
  title: string,
  subject: string,
  teacher: string,
  startTime: Date,
) => {
  const formattedDate = startTime.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const formattedTime = startTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `
    <table width="100%" bgcolor="#F4F7F9" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Logo Section -->
            <tr>
              <td align="center" style="padding: 30px 20px; background-color: #ffffff;">
                <img src="https://nbca.co.in/logo.png" height="40" alt="NBCA Logo" style="display:block; border: 0;" />
              </td>
            </tr>

            <!-- Hero/Banner Section -->
            <tr>
              <td align="center" style="background-color: #4F46E5; padding: 40px 30px;">
                <p style="margin: 0; color: #A5B4FC; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                  Live Class Scheduled
                </p>
                <h1 style="margin: 12px 0 0 0; color: #ffffff; font-size: 26px; font-weight: 800; line-height: 1.2;">
                  ${title}
                </h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 35px 35px 15px 35px;">
                <p style="margin: 0; color: #111827; font-size: 16px; line-height: 24px;">
                  Hi <strong>${studentName}</strong>,
                </p>
                <p style="margin: 10px 0 0 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                  Your upcoming live session is ready. Please review the details below so you can arrive prepared.
                </p>
              </td>
            </tr>

            <!-- Detailed Info Box -->
            <tr>
              <td style="padding: 15px 35px 30px 35px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5E7EB; border-radius: 8px; background-color: #FAFAFA;">
                  <tr>
                    <td style="padding: 25px;">
                      
                      <!-- Date & Time -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                        <tr>
                          <td width="28" valign="top">
                            <img src="https://img.icons8.com/material-rounded/24/4F46E5/calendar.png" alt="Date" width="20" height="20" style="display:block; margin-top:2px;" />
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; font-size: 11px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Schedule</p>
                            <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827; font-weight: 600;">${formattedDate}<br/>at ${formattedTime}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Subject -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                        <tr>
                          <td width="28" valign="top">
                            <img src="https://img.icons8.com/material-rounded/24/4F46E5/book.png" alt="Subject" width="20" height="20" style="display:block; margin-top:2px;" />
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; font-size: 11px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Subject</p>
                            <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827; font-weight: 600;">${subject}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Teacher -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="28" valign="top">
                            <img src="https://img.icons8.com/material-rounded/24/4F46E5/user.png" alt="Teacher" width="20" height="20" style="display:block; margin-top:2px;" />
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; font-size: 11px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Teacher</p>
                            <p style="margin: 4px 0 0 0; font-size: 15px; color: #111827; font-weight: 600;">${teacher}</p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Call to Action -->
            <tr>
              <td align="center" style="padding: 0 35px 40px 35px;">
                <a href="https://nbca.co.in/student/live-classes" target="_blank" style="background-color: #4F46E5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                  Go to Classroom
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 24px 35px; background-color: #F9FAFB; border-top: 1px solid #F3F4F6;">
                <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 18px;">
                  &copy; ${new Date().getFullYear()} North Bengal Cloud Academy.<br/>
                  This is an automated notification. Please do not reply.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;
};