export const forgotPasswordTemplate = (
  otp: string
) => {
  return `
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; padding: 20px;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom: 15px; padding-top: 10px;">
                <img src="https://nbca.co.in/logo.png" height="32" alt="NBCA" style="display: block; border: 0;" />
              </td>
            </tr>

            <!-- Top Links -->
            <tr>
              <td align="center" style="padding-bottom: 20px; font-size: 13px; color: #4b5563;">
                <a href="https://nbca.co.in" style="color: #4b5563; text-decoration: none;">Home</a> &nbsp;|&nbsp; 
                <a href="mailto:support@nbca.co.in" style="color: #4b5563; text-decoration: none;">Support</a> &nbsp;|&nbsp; 
                <a href="https://nbca.co.in/login" style="color: #4b5563; text-decoration: none;">Login</a>
              </td>
            </tr>

            <!-- Dark Greeting Bar -->
            <tr>
              <td style="background-color: #0b0f19; border-radius: 8px; padding: 16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="color: #ffffff; font-size: 15px; font-weight: bold;">
                      <img src="https://img.icons8.com/ios-filled/24/ffffff/lock.png" width="14" height="14" alt="Lock" style="vertical-align: middle; margin-right: 6px; padding-bottom: 3px;" /> 
                      Account Security
                    </td>
                    <td align="right" style="font-size: 14px;">
                      <a href="https://nbca.co.in/login" style="color: #ffffff; text-decoration: underline; font-weight: 600;">Back to login</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Big Headline -->
            <tr>
              <td align="center" style="padding: 40px 20px 20px;">
                <h1 style="margin: 0; font-size: 34px; font-weight: 800; line-height: 1.2; color: #0b0f19; letter-spacing: -1px;">
                  Password Reset Request
                </h1>
              </td>
            </tr>

            <!-- Subheading -->
            <tr>
              <td align="center" style="padding: 0 20px 30px;">
                <p style="margin: 0; font-size: 16px; font-weight: 500; color: #4b5563; line-height: 24px;">
                  We received a request to reset your NBCA password. Enter the code below to proceed.
                </p>
              </td>
            </tr>

            <!-- OTP Display Box -->
            <tr>
              <td align="center" style="padding: 10px 20px 40px;">
                <div style="background-color: #eef2ff; border-radius: 16px; padding: 24px 32px; display: inline-block; border: 1px solid #c7d2fe;">
                  <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #3949ab; margin-right: -12px;">${otp}</span>
                </div>
              </td>
            </tr>

            <!-- Security Instructions -->
            <tr>
              <td style="padding: 0 10px 40px;">
                
                <!-- 1. Timer -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #eef2ff; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/3949ab/timer.png" width="20" height="20" alt="Timer" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 15px; line-height: 24px; color: #374151;">
                      This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
                    </td>
                  </tr>
                </table>

                <!-- 2. Warning -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #fef2f2; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/dc2626/shield.png" width="20" height="20" alt="Security" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 15px; line-height: 24px; color: #374151;">
                      If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="left" style="padding-top: 30px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; line-height: 18px;">
                <img src="https://nbca.co.in/logo.png" height="24" alt="NBCA" style="margin-bottom: 16px; display: block;" />
                Please do not reply directly to this email. For questions or assistance, contact our support team.<br/><br/>
                &copy; ${new Date().getFullYear()} North Bengal Cloud Academy. All rights reserved.<br/><br/>
                <a href="https://nbca.co.in/privacy" style="color: #6b7280; text-decoration: underline;">Privacy and Cookies Statement</a> &nbsp;|&nbsp; 
                <a href="https://nbca.co.in/terms" style="color: #6b7280; text-decoration: underline;">Terms of Service</a>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  `;
};