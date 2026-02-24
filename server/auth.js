const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const router = express.Router();

const SALT_ROUNDS = 12;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const LOGIN_WINDOW_MS = Math.max(60_000, Number(process.env.LOGIN_LIMIT_WINDOW_MS) || 15 * 60_000);
const LOGIN_MAX_ATTEMPTS = Math.max(3, Number(process.env.LOGIN_LIMIT_MAX_ATTEMPTS) || 10);

const loginAttempts = new Map();

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeUsername = (username) => String(username || "").trim();
const normalizeIp = (ip) => String(ip || "unknown").trim();

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
};

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      username: user.username
    },
    getJwtSecret(),
    { expiresIn: "1h" }
  );

const buildAuthPayload = (user, token, message) => ({
  success: true,
  message,
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email
  }
});

const getAttemptKey = (req, email) => `${normalizeIp(req.ip)}:${email || "unknown"}`;

const pruneAndReadAttempts = (key) => {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (!entry || now - entry.startedAt >= LOGIN_WINDOW_MS) {
    const resetEntry = { startedAt: now, attempts: 0 };
    loginAttempts.set(key, resetEntry);
    return resetEntry;
  }

  return entry;
};

const recordFailedAttempt = (key) => {
  const entry = pruneAndReadAttempts(key);
  entry.attempts += 1;
  loginAttempts.set(key, entry);
  return entry.attempts;
};

const clearAttempts = (key) => {
  if (loginAttempts.has(key)) {
    loginAttempts.delete(key);
  }
};

const cleanupStaleAttempts = () => {
  const now = Date.now();
  for (const [key, entry] of loginAttempts.entries()) {
    if (now - entry.startedAt >= LOGIN_WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }
};

router.post("/api/register", async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "").trim();

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = createToken(newUser);

    return res
      .status(201)
      .json(buildAuthPayload(newUser, token, "User registered successfully"));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }

    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    cleanupStaleAttempts();

    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const attemptKey = getAttemptKey(req, email);
    const attemptsEntry = pruneAndReadAttempts(attemptKey);

    if (attemptsEntry.attempts >= LOGIN_MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil(
        (LOGIN_WINDOW_MS - (Date.now() - attemptsEntry.startedAt)) / 1000
      );
      res.set("Retry-After", String(Math.max(1, retryAfterSeconds)));
      return res.status(429).json({
        message: "Too many login attempts. Try again later."
      });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      recordFailedAttempt(attemptKey);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      recordFailedAttempt(attemptKey);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    clearAttempts(attemptKey);

    const token = createToken(user);

    return res.status(201).json(buildAuthPayload(user, token, "Login successful"));
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Error logging in user" });
  }
});

router.get("/api/userInfo", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("User info error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
