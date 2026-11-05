import * as healthService from "../services/health.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const healthcheck = asyncHandler(async (req, res) => {
  const { healthy, report } = await healthService.getHealthReport();

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    ...report,
    traceId: req.trace?.id,
  });
});
