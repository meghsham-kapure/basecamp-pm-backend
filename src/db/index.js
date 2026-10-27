import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connection Successful!");
  } catch (err) {
    console.log("MongoDB Connection Error", err);
    process.exit();
  }
};

export default connectDB;
