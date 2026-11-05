const required = [
  "NODE_ENV",
  "APP_NAME",
  "MONGODB_URI",
  "FRONTEND_URL",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "BCRYPT_HASH_ROUNDS",
  "MAILTRAP_SMTP_HOST",
  "MAILTRAP_SMTP_PORT",
  "MAILTRAP_SMTP_USER",
  "MAILTRAP_SMTP_PASS",
];

export const validateEnv = async () => {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};
