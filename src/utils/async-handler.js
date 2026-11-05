import { ApiErrorResponse } from "./api-error-response.js";

export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error("Error :", err);
      let responseData;
      if (err instanceof ApiErrorResponse) {
        responseData = {
          isSuccessful: err.isSuccessful,
          status: err.status,
          name: err.name,
          message: err.message,
          stack: err.stack,
        };

        if (String(process.env.NODE_ENV).toUpperCase().startsWith("DEV")) {
          responseData = {
            ...responseData,
            stack: err?.stack,
          };
        }
      } else {
        responseData = {
          isSuccessful: false,
          status: 500,
          name: "Unknown-App-Error",
          message: "Something went wrong!",
        };

        if (String(process.env.NODE_ENV).toUpperCase().startsWith("DEV")) {
          responseData = {
            ...responseData,
            stack: err?.stack,
          };
        }
      }

      console.log(responseData);

      return res.status(responseData.status).json(responseData);
    });
  };
};
