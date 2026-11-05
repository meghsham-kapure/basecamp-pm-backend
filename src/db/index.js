import mongoose from "mongoose";

mongoose.set("sanitizeFilter", true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    process.exit();
  }
};

export { connectDB };
