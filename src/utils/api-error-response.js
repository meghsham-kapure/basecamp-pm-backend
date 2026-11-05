class ApiErrorResponse extends Error {
  constructor({
    status = 500,
    name = "App-Error",
    message = "Something Went wrong!",
    stack,
    meta = undefined,
  }) {
    super(message);
    this.isSuccessful = false;
    this.status = status;
    this.name = name;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    if (meta) {
      this.meta = meta;
    }
  }
}

export { ApiErrorResponse };
