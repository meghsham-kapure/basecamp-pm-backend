import os from "node:os";

import * as healthRepository from "../repositories/health.repository.js";

const toMB = (bytes) => Math.round(bytes / 1024 / 1024);

export const getHealthReport = async () => {
  const state = healthRepository.getDatabaseState();
  const latencyMs = await healthRepository.pingDatabase();
  const healthy = state === "connected" && latencyMs !== null;
  const memory = process.memoryUsage();

  return {
    healthy,
    report: {
      status: healthy ? "ok" : "unavailable",
      timestamp: new Date().toISOString(),
      app: {
        name: process.env.APP_NAME,
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version,
        uptimeSeconds: Math.round(process.uptime()),
      },
      database: {
        state,
        name: healthRepository.getDatabaseName(),
        latencyMs,
      },
      system: {
        node: process.version,
        pid: process.pid,
        hostname: os.hostname(),
        platform: process.platform,
        memoryMB: { rss: toMB(memory.rss), heapUsed: toMB(memory.heapUsed) },
        loadAverage: os.loadavg().map((n) => Number(n.toFixed(2))),
      },
    },
  };
};
