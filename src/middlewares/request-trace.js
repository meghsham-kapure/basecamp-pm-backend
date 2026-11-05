import { randomUUID } from "node:crypto";

export const startTrace = (req, res, next) => {
  const traceData = {
    route: `${req.method} ${req.originalUrl}`,
    id: randomUUID(),
  };

  req.trace = { ...traceData };

  next();
};
