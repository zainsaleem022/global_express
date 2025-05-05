import mongoose, { Connection } from "mongoose";

// Declare global variable to track connection status
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Initialize global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global function to connect to MongoDB
 * This creates a cached connection for better performance
 */
export async function connectToDatabase(): Promise<Connection> {
  // If we already have a connection, return it
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // If a connection is in progress, wait for it
  if (!global.mongoose.promise) {
    // Set connection options
    const opts = {
      bufferCommands: true,
    };

    // Create the connection promise
    global.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("Connected to MongoDB");
        return mongooseInstance.connection; // Return the Connection object
      });
  }

  // Wait for the connection to be established
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

// Export the connection function and mongoose
export default mongoose;
