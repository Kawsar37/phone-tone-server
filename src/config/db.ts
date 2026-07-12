import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "phonetone",
    });
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} | Database: ${conn.connection.db?.databaseName}`,
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
