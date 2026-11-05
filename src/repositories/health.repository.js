import mongoose from "mongoose";

const DB_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export const getDatabaseState = () => DB_STATES[mongoose.connection.readyState];

export const getDatabaseName = () => mongoose.connection.name;

export const pingDatabase = async () => {
  if (mongoose.connection.readyState !== 1) return null;

  const start = performance.now();
  try {
    await mongoose.connection.db.admin().ping();
    return Math.round(performance.now() - start);
  } catch {
    return null;
  }
};
