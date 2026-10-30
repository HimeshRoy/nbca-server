export const welcomeTeacherTemplate = (
  teacher: {
    name: string;
    email: string;
  }
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
                <a href="https://nbca.co.in/login" style="color: #4b5563; text-decoration: none;">Dashboard</a> &nbsp;|&nbsp; 
                <a href="https://nbca.co.in/login" style="color: #4b5563; text-decoration: none;">Live Classes</a> &nbsp;|&nbsp; 
                <a href="https://nbca.co.in/login" style="color: #4b5563; text-decoration: none;">Assignments</a>
              </td>
            </tr>

            <!-- Dark Greeting Bar -->
            <tr>
              <td style="background-color: #001856; border-radius: 8px; padding: 16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="color: #ffffff; font-size: 15px; font-weight: bold;">
                      <img src="https://img.icons8.com/ios-filled/24/ffffff/user.png" width="14" height="14" alt="User" style="vertical-align: middle; margin-right: 6px; padding-bottom: 3px;" /> 
                      Hi, ${teacher.name}
                    </td>
                    <td align="right" style="font-size: 14px;">
                      <a href="https://nbca.co.in/login" style="color: #ffffff; text-decoration: underline; font-weight: 600;">Your profile</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Big Headline -->
            <tr>
              <td align="center" style="padding: 40px 20px 30px;">
                <h1 style="margin: 0; font-size: 38px; font-weight: 800; line-height: 1.1; color: #001856; letter-spacing: -1px;">
                  Welcome aboard, your<br/>classroom awaits
                </h1>
              </td>
            </tr>

            <!-- Subheading -->
            <tr>
              <td align="left" style="padding: 0 10px 24px;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #001856;">Here are your account details:</h2>
              </td>
            </tr>

            <!-- List Items -->
            <!-- 1. Name -->
            <tr>
              <td style="padding: 12px 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #eef2ff; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/3949ab/name.png" width="20" height="20" alt="Name" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 16px; line-height: 24px; color: #374151;">
                      <strong>Name:</strong> ${teacher.name}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 2. Email -->
            <tr>
              <td style="padding: 12px 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #eef2ff; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/3949ab/new-post.png" width="20" height="20" alt="Email" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 16px; line-height: 24px; color: #374151;">
                      <strong>Email:</strong> ${teacher.email}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3. Role -->
            <tr>
              <td style="padding: 12px 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #eef2ff; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/3949ab/briefcase.png" width="20" height="20" alt="Role" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 16px; line-height: 24px; color: #374151;">
                      <strong>Role:</strong> Teacher
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 4. Portal Access Info -->
            <tr>
              <td style="padding: 12px 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #eef2ff; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/3949ab/mac-client.png" width="20" height="20" alt="Portal" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 16px; line-height: 24px; color: #374151;">
                      You now have full access to manage classes, assignments, tests, and resources from your Teacher Portal.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 5. Login Instruction -->
            <tr>
              <td style="padding: 12px 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="42" height="42" align="center" valign="middle" style="background-color: #eef2ff; border-radius: 50%;">
                            <img src="https://img.icons8.com/ios-filled/50/3949ab/password.png" width="20" height="20" alt="Key" style="display: block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" style="padding-left: 15px; font-size: 16px; line-height: 24px; color: #374151;">
                      Use your <strong>Email</strong> and your <strong>password</strong> as your login credentials to access the platform.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Pill CTA Button -->
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <a href="https://nbca.co.in/login" style="background-color: #001856; color: #ffffff; padding: 18px 48px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 40px; display: inline-block;">Log In to Portal</a>
              </td>
            </tr>

            <!-- Help / Banner Section -->
            <tr>
              <td style="padding: 0 0 50px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eef2ff; border-radius: 12px; padding: 30px 20px;">
                  <tr>
                    <td align="center">
                      <h3 style="margin: 0 0 10px 0; color: #001856; font-size: 22px; font-weight: 800;">Need help logging in?</h3>
                      <p style="margin: 0 0 20px 0; font-size: 15px; color: #4b5563;">Our administration team is ready to assist you anytime.</p>
                      <a href="mailto:support@nbca.co.in" style="background-color: #001856; color: #ffffff; padding: 14px 32px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 30px; display: inline-block;">Contact Admin</a>
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