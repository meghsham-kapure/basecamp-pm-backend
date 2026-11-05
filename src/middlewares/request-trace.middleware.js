import { randomUUID } from "node:crypto";

export const traceRequest = (req, res, next) => {
  const traceData = {
    route: `${req.method} ${req.originalUrl}`,
    id: randomUUID(),
  };

  req.trace = { ...traceData };

  next();
};
