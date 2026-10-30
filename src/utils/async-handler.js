const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error("========== ERROR ==========");
      console.error(`Name:    ${err.name}`);
      console.error(`Message: ${err.message}`);
      console.error(`Route:   ${req.method} ${req.originalUrl}`);
      console.error(`Time:    ${new Date().toISOString()}`);
      if (err.statusCode) console.error(`Status:  ${err.statusCode}`);
      if (err.cause) console.error("Cause:  ", err.cause);
      console.error(`Stack:\n${err.stack}`);
      next(err);
    });
  };
};

export { asyncHandler };
