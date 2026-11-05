import { matchedData, validationResult } from "express-validator";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiErrorResponse } from "../utils/api-error-response.js";

const validate = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    req.validated = matchedData(req);
    return next();
  } else {
    let extractedErrors = "";

    errors.array().map((err) => {
      if (extractedErrors !== "") extractedErrors += ", ";
      extractedErrors += err.msg;
    });

    throw new ApiErrorResponse({
      status: 400,
      name: "Validation Error",
      message: extractedErrors + ".",
    });
  }
});

export { validate };
