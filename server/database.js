const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  const connectOptions = {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 12000,
    family: 4
  };

  connectionPromise = mongoose
    .connect(mongoUri, connectOptions)
    .then((conn) => {
      console.log("Connected to MongoDB");
      return conn;
    })
    .catch((err) => {
      connectionPromise = null;
      const atlasServerHint =
        "Could not connect to any servers in your MongoDB Atlas cluster";

      if (err?.message?.includes(atlasServerHint)) {
        console.error(
          "Atlas connection failed. Check Network Access IP whitelist, URI format, and cluster status."
        );
      }

      throw err;
    });

  return connectionPromise;
}

module.exports = connectDB;
