const nodemailer = require('nodemailer');
const fs = require("fs");
const path = require('path');

exports.main = async (event) => {
  try {
    const messages = event.Records.map((record) => {
      return JSON.parse(record.body);
    });

    console.log("All Messages:" + JSON.stringify(messages));

    for (const message of messages) {
      console.log('Received message:', message.Message);

      const data = JSON.parse(message.Message);

      const templateName = data.templateName;
      const params = data.params;

      console.log(templateName);
      console.log(params);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });

      const templatePath = path.join(process.cwd(), 'templates', `${templateName}.html`);
      console.log(templatePath);
      const emailTemplate = fs.readFileSync(templatePath, "utf-8");
      let emailBody = emailTemplate;

      for (const [key, value] of Object.entries(params)) {
        const regex = new RegExp(`{${key}}`, 'g');
        emailBody = emailBody.replace(regex, value);
      }

      const mailOptions = {
        from: process.env.EMAIL,
        to: params.email,
        subject: '[Trivia Titans] Notification',
        html: emailBody
      };

      await transporter.sendMail(mailOptions);
      console.log('Email notification sent.');
    }
  } catch (error) {
    console.log('Error:', error);
  }
};
