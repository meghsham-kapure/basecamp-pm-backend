export const emailVerificationMailContent = (userName, verificationUrl) => {
  console.log(`Email verification for ${userName} : ${verificationUrl}`);

  return {
    body: {
      name: userName,
      intro: "Welcome to our App! We're excited to have you on board!",
      action: {
        instructions: `To verify your email, open this link: ${verificationUrl} or click the button below.`,
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const forgotPasswordMailContent = (userName, passwordResetUrl) => {
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
      outro:
        "Need help or have question? Just reply to this email, we'd love to help.",
    },
  };
};
