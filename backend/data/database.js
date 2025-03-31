import mongoose from "mongoose";
import { config } from "dotenv";

config();

const port = process.env.PORT || 4000;
const mode = process.env.NODE_ENV || "development";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "UdemyCourse",
    });

    console.log(`Server connected to database ${connection.host}`);
  } catch (error) {
    console.log("Some Error Occurred", error);
    process.exit(1);
  }
};
