const nodemailer = require('nodemailer');

class MailSender {
  static config = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: Boolean(process.env.MAIL_SECURE),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  }

  static transporter = nodemailer.createTransport(MailSender.config);

  static from = process.env.MAIL_FROM;

  static async send(to, message) {
    const mailOptions = {
      from: MailSender.from,
      to,
      subject: message.subject,
      text: message.text,
      html: message.html
    };

    await MailSender.transporter.sendMail(mailOptions);
  }
}

module.exports = {
  MailSender
}