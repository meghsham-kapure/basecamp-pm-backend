export const getEnvironment = () =>
  String(process.env.ENVIRONMENT).toUpperCase();

export const isDev = () => getEnvironment().startsWith("DEV");

export const isProd = () => getEnvironment().startsWith("PROD");
