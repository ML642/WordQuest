const mongoose = require("mongoose");

let connectionPromise = null;
let activeConnectionLabel = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getConnectionTargets = () => {
  const primary = process.env.MONGODB_URI;
  const fallback = process.env.MONGODB_FALLBACK_URI;

  if (!primary) {
    throw new Error("MONGODB_URI is not set");
  }

  const targets = [{ label: "primary", uri: primary }];
  if (fallback) {
    targets.push({ label: "fallback", uri: fallback });
  }
  return targets;
};

const connectOptions = {
  serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 12000
};

const configuredIpFamily = Number(process.env.MONGODB_IP_FAMILY);
if (Number.isInteger(configuredIpFamily) && (configuredIpFamily === 4 || configuredIpFamily === 6)) {
  connectOptions.family = configuredIpFamily;
}

const maxRetriesPerTarget = Math.max(1, Number(process.env.MONGODB_CONNECT_RETRIES) || 2);
const retryDelayMs = Math.max(500, Number(process.env.MONGODB_CONNECT_RETRY_DELAY_MS) || 1500);

const tryConnectTarget = async (target) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetriesPerTarget; attempt += 1) {
    try {
      const conn = await mongoose.connect(target.uri, connectOptions);
      activeConnectionLabel = target.label;
      if (target.label === "fallback") {
        console.warn("Connected to MongoDB fallback target");
      } else {
        console.log("Connected to MongoDB primary target");
      }
      return conn;
    } catch (err) {
      lastError = err;
      const atlasServerHint = "Could not connect to any servers in your MongoDB Atlas cluster";

      if (err?.message?.includes(atlasServerHint)) {
        console.error(
          "Atlas connection failed. Check Network Access IP whitelist, URI format, and cluster status."
        );
      }
      if (err?.message?.includes("querySrv")) {
        console.error(
          "Atlas DNS SRV lookup failed. Check your DNS/network settings, or use Atlas standard (non-SRV) URI as fallback."
        );
      }

      console.error(
        `MongoDB ${target.label} connect attempt ${attempt}/${maxRetriesPerTarget} failed: ${err.message}`
      );

      if (attempt < maxRetriesPerTarget) {
        await sleep(retryDelayMs);
      }
    }
  }

  throw lastError;
};

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const targets = getConnectionTargets();

  connectionPromise = (async () => {
    let lastError = null;

    for (const target of targets) {
      try {
        return await tryConnectTarget(target);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  })().catch((err) => {
    connectionPromise = null;
    throw err;
  });

  return connectionPromise;
}

const getDbMeta = () => ({
  readyState: mongoose.connection.readyState,
  readyStateLabel:
    mongoose.connection.readyState === 1
      ? "connected"
      : mongoose.connection.readyState === 2
        ? "connecting"
        : mongoose.connection.readyState === 3
          ? "disconnecting"
          : "disconnected",
  activeTarget: activeConnectionLabel
});

module.exports = {
  connectDB,
  getDbMeta
};
