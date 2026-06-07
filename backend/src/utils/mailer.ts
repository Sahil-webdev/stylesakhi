import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const SMTP_USER = process.env.SMTP_USER || 'sahilshh777@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials are not configured. Add SMTP_USER and SMTP_PASS to backend .env');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendAdminOtpEmail(params: { email: string; otp: string; name: string }) {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: SMTP_FROM,
    to: params.email,
    subject: 'StyleSakhi Admin Password Reset OTP',
    text: `Hello ${params.name}, your StyleSakhi admin OTP is ${params.otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f7f8fc; padding:32px;">
        <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:18px; padding:32px; border:1px solid #e4e7f0;">
          <div style="text-align:center; margin-bottom:24px;">
            <div style="width:56px; height:56px; margin:0 auto 16px; border-radius:999px; background:#ece9ff; color:#4d44e3; font-size:28px; line-height:56px;">🔐</div>
            <h1 style="margin:0; font-size:30px; color:#202636;">Reset Password OTP</h1>
            <p style="margin:12px 0 0; color:#5f6673; font-size:15px;">Use this one-time password to continue resetting your admin password.</p>
          </div>

          <div style="background:#f7f8ff; border:1px solid #dfe3ff; border-radius:14px; padding:22px; text-align:center;">
            <p style="margin:0 0 12px; color:#5f6673; font-size:14px;">Your verification code</p>
            <div style="font-size:32px; letter-spacing:12px; font-weight:700; color:#312a9f;">${params.otp}</div>
          </div>

          <p style="margin:22px 0 0; color:#5f6673; font-size:14px; line-height:1.7;">
            This OTP is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
