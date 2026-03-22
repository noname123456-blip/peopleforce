import mongoose from "mongoose";
import "@/models"; 

const URI = process.env.DB_URI || "";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Avoid buffering if connection fails
    };

    cached.promise = mongoose.connect(URI, opts).then((mongoose) => {
      console.log("DB connected successfully!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error in connection DB: ", e);
    throw e;
  }

  return cached.conn;
}