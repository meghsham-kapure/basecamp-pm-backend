import Mailgen from "mailgen";
import { Verify } from "node:crypto";

import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  // Create a new instance of Mailgen with the desired theme and product information
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Management App",
      link: process.env.FRONTEND_URL,
    },
  });

  // Generate the email content using Mailgen
  const emailTextual = mailGenerator.generatePlaintext(options.mailGeneratorContent);

  // Generate the HTML version of the email content using Mailgen
  const emailHtml = mailGenerator.generate(options.mailGeneratorContent);

  // Create a transporter using nodemailer with the Mailtrap SMTP configuration
  const transporter = nodeMailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      password: process.env.MAILTRAP_SMTP_PASSWORD,
    },
  });

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
  } catch (error) {
    console.error("Error sending email:", error);
    // throw new Error("Failed to send email");
  }
};

const emailVerificationMailgenContent = (userName, verificationUrl) => {
  return {
    body: {
      name: userName,
      intro: "Welcome to out App! We'are excited to have you on board! ",
      action: {
        instruction: "To verify your email please click on the following button.",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro: "Need help or have question? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (userName, passwordResetUrl) => {
  return {
    body: {
      name: userName,
      intro: "You have requested to reset your password. ",
      action: {
        instruction: "To reset your password please click on the below button.",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro: "Need help or have question? Just reply to this email, we'd love to help.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
