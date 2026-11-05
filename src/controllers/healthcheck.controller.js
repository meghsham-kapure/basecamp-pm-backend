import os from "node:os";

import mongoose from "mongoose";

const DB_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const toMB = (bytes) => Math.round(bytes / 1024 / 1024);

const pingDatabase = async () => {
  if (mongoose.connection.readyState !== 1) return null;

  const start = performance.now();
  try {
    await mongoose.connection.db.admin().ping();
    return Math.round(performance.now() - start);
  } catch {
    return null;
  }
};

export const healthcheck = async (req, res) => {
  const dbState = DB_STATES[mongoose.connection.readyState];
  const dbLatencyMs = await pingDatabase();
  const healthy = dbState === "connected" && dbLatencyMs !== null;

  const memory = process.memoryUsage();

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? "ok" : "unavailable",
    timestamp: new Date().toISOString(),
    app: {
      name: process.env.APP_NAME,
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
      uptimeSeconds: Math.round(process.uptime()),
    },
    database: {
      state: dbState,
      name: mongoose.connection.name,
      latencyMs: dbLatencyMs,
    },
    system: {
      node: process.version,
      pid: process.pid,
      hostname: os.hostname(),
      platform: process.platform,
      memoryMB: { rss: toMB(memory.rss), heapUsed: toMB(memory.heapUsed) },
      loadAverage: os.loadavg().map((n) => Number(n.toFixed(2))),
    },
    traceId: req.trace?.id,
  });
};
