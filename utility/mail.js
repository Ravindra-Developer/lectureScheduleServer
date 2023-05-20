var nodemailer = require('nodemailer');

const sendMailController = {}
sendMailController.sendMail = (to, subject, data, callback) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ravindramaurya.developer@gmail.com",
            pass: "ydhatvnczwaaudjt"
        }
    });

    const mailOptions = {
        from: 'ravindramaurya.developer@gmail.com',
        to: to,
        subject: subject,
        html: data
    }

    transporter.sendMail(mailOptions, (error, info) => {
        console.log("Inside send mail")
        if (error) {
            console.log("In Error ", error);
            callback(error, undefined)
        } else {
            console.log(to, "Message %s sent: %s", info.messageId, info.response);
            callback(undefined, "Success")
        }
    });
}

module.exports = sendMailController