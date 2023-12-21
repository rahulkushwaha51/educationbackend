const nodemailer = require("nodemailer");
require('dotenv').config
async function sendEmail(to, subject, text) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        to, subject, text,
    })
}

module.exports = sendEmail;