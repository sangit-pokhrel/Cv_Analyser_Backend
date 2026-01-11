const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


async function sendEmail({ to, subject, text, html }) {
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}


function verificationEmail({ user, token }) {
  const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
  return {
    to: user.email,
    subject: 'Verify your email',
    text: `Please verify your email by visiting ${verifyUrl}`,
    html: `<p>Hello ${user.firstName || ''},</p>
           <p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>
           <p>If you didn't create an account, ignore this email.</p>`
  };
}

module.exports = {
  sendEmail,
  verificationEmail
};
