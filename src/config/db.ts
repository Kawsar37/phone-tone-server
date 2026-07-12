import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global Node.js object to store the cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB() {
  // If we already have a connection, use it (Prevents multiple connections in serverless)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "phonetone", // Force the database name
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected (Serverless Cached)");
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
