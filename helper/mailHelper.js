const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sksatenderkumar59@gmail.com",
        pass: "yuvkanrfxsia gylg"
    }
});

const sendMail = async (to, subject, text) => {
    const info = {
        from: "Trimaster Private limited <sksatenderkumar59@gmail.com>",
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(info);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error in sending mail:", error);
    }
};

module.exports = { sendMail };
