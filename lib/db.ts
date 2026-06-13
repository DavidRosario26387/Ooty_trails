import mongoose from "mongoose";

/**
 * Cached Mongoose connection.
 *
 * Next.js (and serverless-style hosts) can invoke many times within one
 * process; without caching we'd open a new connection on every request and
 * exhaust the Atlas free-tier connection limit. We stash the connection on
 * the global object so it survives module reloads in dev.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  // Read at call time (not module load) so dotenv / runtime env injection has run.
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example) or the Render dashboard.",
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 5,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
