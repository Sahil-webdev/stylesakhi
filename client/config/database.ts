import mongoose from "mongoose";

const mongoDbUri = process.env.MONGODB_URI ?? "";

if (!mongoDbUri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: CachedConnection;
};

const cached = globalWithMongoose.mongooseConnection ?? {
  conn: null,
  promise: null,
};

globalWithMongoose.mongooseConnection = cached;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoDbUri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
