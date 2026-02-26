const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const {
  LEVELS,
  buildStatsSnapshot,
  getUtcDateKey,
  toNonNegativeInteger,
  toNonNegativeNumber,
  updateStreak
} = require("./util/stats");

const router = express.Router();

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwtSecret;
};

const asObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const firstDefined = (...values) => values.find((value) => value !== undefined);

const parseNonNegativeNumber = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return null;
  }
  return numeric;
};

const parseNonNegativeInteger = (value) => {
  const numeric = parseNonNegativeNumber(value);
  if (numeric === null) {
    return null;
  }
  return Math.floor(numeric);
};

const ensureStatsContainer = (userDoc) => {
  if (!userDoc.stats) {
    userDoc.stats = {};
  }
  if (!userDoc.stats.levelMastery) {
    userDoc.stats.levelMastery = {};
  }
  LEVELS.forEach((level) => {
    if (!userDoc.stats.levelMastery[level]) {
      userDoc.stats.levelMastery[level] = {};
    }
  });
};

const requireAuthUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const tokenEmail = String(decoded.userEmail || decoded.email || "").trim().toLowerCase();
    const query = decoded.userId ? { _id: decoded.userId } : tokenEmail ? { email: tokenEmail } : null;

    if (!query) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userDoc = await User.findOne(query);
    if (!userDoc && decoded.userId && tokenEmail) {
      req.userDoc = await User.findOne({ email: tokenEmail });
    } else {
      req.userDoc = userDoc;
    }

    if (!req.userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    return next();
  } catch (error) {
    console.error("Stats auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.get("/api/stats/me", requireAuthUser, async (req, res) => {
  return res.json({ stats: buildStatsSnapshot(req.userDoc.stats) });
});

router.patch("/api/stats/me", requireAuthUser, async (req, res) => {
  try {
    const body = asObject(req.body);
    const errors = [];
    let touched = false;

    ensureStatsContainer(req.userDoc);

    const updateField = (incomingValue, parser, message, apply) => {
      if (incomingValue === undefined) {
        return;
      }
      const parsed = parser(incomingValue);
      if (parsed === null) {
        errors.push(message);
        return;
      }
      apply(parsed);
      touched = true;
    };

    updateField(
      firstDefined(body.score, body.points),
      parseNonNegativeNumber,
      "score must be a non-negative number",
      (value) => {
        req.userDoc.stats.score = value;
      }
    );
    updateField(
      firstDefined(body.testsTaken, body.tests),
      parseNonNegativeInteger,
      "testsTaken must be a non-negative integer",
      (value) => {
        req.userDoc.stats.testsTaken = value;
      }
    );
    updateField(body.knownWords, parseNonNegativeInteger, "knownWords must be a non-negative integer", (value) => {
      req.userDoc.stats.knownWords = value;
    });
    updateField(
      body.correctAnswers,
      parseNonNegativeInteger,
      "correctAnswers must be a non-negative integer",
      (value) => {
        req.userDoc.stats.correctAnswers = value;
      }
    );
    updateField(
      body.totalAnswers,
      parseNonNegativeInteger,
      "totalAnswers must be a non-negative integer",
      (value) => {
        req.userDoc.stats.totalAnswers = value;
      }
    );
    updateField(body.streak, parseNonNegativeInteger, "streak must be a non-negative integer", (value) => {
      req.userDoc.stats.streak = value;
    });

    if (body.levelMastery !== undefined) {
      const levelMastery = asObject(body.levelMastery);
      LEVELS.forEach((level) => {
        if (!(level in levelMastery)) {
          return;
        }
        const patch = asObject(levelMastery[level]);
        const target = req.userDoc.stats.levelMastery[level] || {};

        updateField(
          patch.known,
          parseNonNegativeInteger,
          `levelMastery.${level}.known must be a non-negative integer`,
          (value) => {
            target.known = value;
            req.userDoc.stats.levelMastery[level] = target;
          }
        );
        updateField(
          patch.answered,
          parseNonNegativeInteger,
          `levelMastery.${level}.answered must be a non-negative integer`,
          (value) => {
            target.answered = value;
            req.userDoc.stats.levelMastery[level] = target;
          }
        );
        updateField(
          patch.score,
          parseNonNegativeNumber,
          `levelMastery.${level}.score must be a non-negative number`,
          (value) => {
            target.score = value;
            req.userDoc.stats.levelMastery[level] = target;
          }
        );
        updateField(
          patch.maxScore,
          parseNonNegativeNumber,
          `levelMastery.${level}.maxScore must be a non-negative number`,
          (value) => {
            target.maxScore = value;
            req.userDoc.stats.levelMastery[level] = target;
          }
        );
      });
    }

    if (body.markActiveToday === true || body.activityAt !== undefined) {
      const activityAt = body.activityAt === undefined ? new Date() : body.activityAt;
      if (!getUtcDateKey(activityAt)) {
        errors.push("activityAt must be a valid date");
      } else {
        const next = updateStreak(req.userDoc.stats.streak, req.userDoc.stats.lastActiveDate, activityAt);
        req.userDoc.stats.streak = next.streak;
        req.userDoc.stats.lastActiveDate = next.lastActiveDate;
        touched = true;
      }
    }

    if (toNonNegativeInteger(req.userDoc.stats.correctAnswers) > toNonNegativeInteger(req.userDoc.stats.totalAnswers)) {
      errors.push("correctAnswers cannot exceed totalAnswers");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], details: errors });
    }
    if (!touched) {
      return res.status(400).json({ message: "No stats fields provided to update" });
    }

    req.userDoc.markModified("stats.levelMastery");
    await req.userDoc.save();
    return res.json({ message: "Stats updated", stats: buildStatsSnapshot(req.userDoc.stats) });
  } catch (error) {
    console.error("Stats patch error:", error.message);
    return res.status(500).json({ message: "Failed to update stats" });
  }
});

router.post("/api/stats/me/session", requireAuthUser, async (req, res) => {
  try {
    const body = asObject(req.body);
    const scoreDelta = parseNonNegativeNumber(firstDefined(body.score, body.points, 0));
    const testsDelta = parseNonNegativeInteger(firstDefined(body.testsDelta, 1));
    const knownWordsDelta = parseNonNegativeInteger(firstDefined(body.knownWords, body.knownCount, 0));
    const totalWordsDelta = parseNonNegativeInteger(firstDefined(body.totalWords, body.totalCount, knownWordsDelta));
    const completedAt = firstDefined(body.completedAt, body.activityAt, new Date());

    if ([scoreDelta, testsDelta, knownWordsDelta, totalWordsDelta].includes(null)) {
      return res.status(400).json({ message: "Session payload contains invalid numeric values" });
    }
    if (knownWordsDelta > totalWordsDelta) {
      return res.status(400).json({ message: "knownWords cannot exceed totalWords" });
    }
    if (!getUtcDateKey(completedAt)) {
      return res.status(400).json({ message: "completedAt must be a valid date" });
    }

    ensureStatsContainer(req.userDoc);
    req.userDoc.stats.score = toNonNegativeNumber(req.userDoc.stats.score) + scoreDelta;
    req.userDoc.stats.testsTaken = toNonNegativeInteger(req.userDoc.stats.testsTaken) + testsDelta;
    req.userDoc.stats.knownWords = toNonNegativeInteger(req.userDoc.stats.knownWords) + knownWordsDelta;
    req.userDoc.stats.correctAnswers = toNonNegativeInteger(req.userDoc.stats.correctAnswers) + knownWordsDelta;
    req.userDoc.stats.totalAnswers = toNonNegativeInteger(req.userDoc.stats.totalAnswers) + totalWordsDelta;

    const next = updateStreak(req.userDoc.stats.streak, req.userDoc.stats.lastActiveDate, completedAt);
    req.userDoc.stats.streak = next.streak;
    req.userDoc.stats.lastActiveDate = next.lastActiveDate;

    await req.userDoc.save();
    return res.status(201).json({
      message: "Session stats recorded",
      stats: buildStatsSnapshot(req.userDoc.stats)
    });
  } catch (error) {
    console.error("Stats session error:", error.message);
    return res.status(500).json({ message: "Failed to record session stats" });
  }
});

module.exports = router;
