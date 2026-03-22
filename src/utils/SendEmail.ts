import mongoose, { ObjectId } from "mongoose";
import nodemailer from "nodemailer";

const SendEmail = async ({
    username,
    email,
    emailType,
    otp,
    id
}: {
    username: string;
    email: string;
    emailType: string;
    otp: string;
    id: mongoose.Types.ObjectId
}) => {
    try {

        const EmailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#2563eb; padding:20px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; margin-bottom:16px;">
                Hello,
              </p>

              <p style="font-size:16px; margin-bottom:16px;">
                Thank you for signing up. Please use the OTP below to verify your email address.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  background:#f1f5f9;
                  padding:15px 25px;
                  border-radius:6px;
                  color:#111827;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:14px; color:#555555; text-align:center;">
                This OTP is valid for <strong>5 minutes</strong>.
              </p>

              <!-- Verify Button -->
              <div style="text-align:center; margin:35px 0;">
                <a 
                  href="${process.env.ORIGIN}/verifyEmail/?id=${id}"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    padding:14px 30px;
                    text-decoration:none;
                    border-radius:6px;
                    font-size:16px;
                    display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#555555;">
                If you did not request this, please ignore this email.
              </p>

              <p style="font-size:14px; color:#555555;">
                Thanks,<br />
                <strong>Your App Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#666666;">
              © 2026 Your App. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

        // Looking to send emails in production? Check out our Email API/SMTP product!
        //For production replace all this with the google OAuth 2,0 provider
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
                user: process.env.SMTP_USER || "61ad75a28b5c59",
                pass: process.env.SMTP_PASS || "5456571c9d9317"
            }
        });

        const EmailOptions = {
            from: process.env.SMTP_FROM || '"Horrila" <no-reply@horrila.com>',
            to: email,
            subject: emailType == "Verify" ? "Verify Your Account" : "Reset Your Password",
            html: EmailHTML,
        }

        const info = await transport.sendMail(EmailOptions);
        return !!info.messageId;

    } catch (err) {
        console.error("Error in sending email: ", err);
        return false;
    }
}

export default SendEmail