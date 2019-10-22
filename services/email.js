var nodemailer = require("nodemailer");
var emailConfig = require("../external-config/email-config");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailConfig.emailId,
        pass: emailConfig.password
    }
});
module.exports = {
    sendMail: function (subject, html, to) {
        transporter.sendMail({
            to: to ? to : emailConfig.emailId,
            subject: subject,
            html: html
        });
    }
}