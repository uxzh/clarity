const nodemailer = require('nodemailer');

class MailService {
    static config = {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: Boolean(process.env.MAIL_SECURE),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    }

    static transporter = nodemailer.createTransport(MailService.config);

    static from = process.env.MAIL_FROM;

    static async send(to, message) {
        const mailOptions = {
            from: MailService.from,
            to,
            subject: message.subject,
            text: message.text,
            html: message.html
        };

        await MailService.transporter.sendMail(mailOptions);
    }
}

module.exports = {
    MailSender: MailService
}
