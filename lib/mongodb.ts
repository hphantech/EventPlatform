import mongoose from 'mongoose';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// TypeScript interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize cached connection object
// In development, use a global variable to preserve the connection across module reloads (hot reloading)
// In production, the connection is scoped to this module
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and maintains a connection to MongoDB using Mongoose
 * 
 * @returns Promise resolving to the Mongoose instance
 * 
 * This function implements connection caching to prevent multiple connections:
 * - In development: Caches connection globally to survive hot reloads
 * - In production: Prevents redundant connections across serverless function invocations
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if connection is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Await the connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error so next call can retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
