const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "luxurystay7@outlook.com",
    pass: "Consolidation@340",
  },
});

// Function to send email
const sendEmail = async (to, subject, text, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: '"Luxury Stay" <luxurystay7@outlook.com>',
      to: to,
      subject: subject,
      text: text,
      html: htmlContent,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Usage

module.exports = { sendEmail };
