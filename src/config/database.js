import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env file");
    }

    console.log("Connecting to MongoDB Atlas...");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB Atlas connection failed:", error.message);
    console.log("\nTrying local MongoDB...");
    
    try {
      const localUri = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/couponsscript';
      const localConn = await mongoose.connect(localUri);
      console.log(`Local MongoDB Connected: ${localConn.connection.host}`);
    } catch (localError) {
      console.error("Local MongoDB failed:", localError.message);
      console.log("\nFix: Check MongoDB Atlas credentials in .env");
      process.exit(1);
    }
  }
};

export default connectDB;
