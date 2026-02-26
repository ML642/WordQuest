const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

const { connectDB, getDbMeta } = require("./database");
const Word = require("./models/words");
const Auth = require("./auth");
const Oauth = require("./Oauth");
const Stats = require("./stats");

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5000"];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : DEFAULT_ALLOWED_ORIGINS;

const PORT = Number(process.env.PORT) || 5000;

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  const db = getDbMeta();
  const isHealthy = db.readyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    db
  });
});

app.get("/api/words", async (req, res, next) => {
  try {
    const limitFromQuery = Number(req.query.limit);
    const limit = Number.isFinite(limitFromQuery) && limitFromQuery > 0
      ? Math.min(Math.floor(limitFromQuery), 500)
      : null;

    const query = Word.find().sort({ createdAt: -1 });
    if (limit) {
      query.limit(limit);
    }

    const words = await query;
    res.json(words);
  } catch (error) {
    next(error);
  }
});

app.post("/api/words", async (req, res, next) => {
  try {
    const word = String(req.body.word || "").trim();
    const meaning = String(req.body.meaning || "").trim();
    const synonymsInput = Array.isArray(req.body.synonyms) ? req.body.synonyms : [];

    if (!word || !meaning) {
      return res.status(400).json({ message: "Word and meaning are required" });
    }

    const synonyms = [...new Set(
      synonymsInput
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )].slice(0, 10);

    const newWord = await Word.create({ word, meaning, synonyms });
    return res.status(201).json(newWord);
  } catch (error) {
    next(error);
  }
});

app.use(Auth);
app.use(Oauth);
app.use(Stats);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err && err.message === "Origin not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  console.error("Unhandled server error:", err.message);
  return res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log("available endpoints:", listEndpoints(app));
      console.log(`server is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      if (error && error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Stop the running process on this port or set a different PORT in server/.env.`
        );
        process.exit(1);
        return;
      }

      console.error("Server failed to listen:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
