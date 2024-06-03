const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "luxurystay7@outlook.com", // your Outlook email
    pass: "Consolidation@340", // your Outlook password
  },
});

// Function to send email
const sendEmail = async (to, subject, text,htmlContent) => {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Luxury Stay" <luxurystay7@outlook.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: htmlContent
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Usage

module.exports = { sendEmail };
