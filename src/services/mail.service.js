import Mailgen from "mailgen";

import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
  // Create a new instance of Mailgen with the desired theme and product information
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Management App",
      link: process.env.FRONTEND_URL,
    },
  });

  // Generate the email content using Mailgen
  const emailTextual = mailGenerator.generatePlaintext(
    options.mailGeneratorContent,
  );

  // Generate the HTML version of the email content using Mailgen
  const emailHtml = mailGenerator.generate(options.mailGeneratorContent);

  // Create a transporter using nodemailer with the Mailtrap SMTP configuration
  const credentials = {
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  };

  const transporter = nodeMailer.createTransport(credentials);

  // Define the email options including sender, recipient, subject, and content
  const mail = {
    from: process.env.FRONTEND_URL,
    to: options.to,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  // Send the email using the transporter and handle any errors that may occur
  try {
    await transporter.sendMail(mail);
  } catch (err) {
    console.error(
      "Error sending email:",
      +err
        ? JSON.stringify(err, Object.getOwnPropertyNames(err))
        : "NO ERROR OBJECT FOUND",
    );
  }
};
