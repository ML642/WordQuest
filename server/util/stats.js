const LEVELS = Object.freeze(["A1", "A2", "B1", "B2", "C1", "C2"]);

const toNonNegativeNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return fallback;
  }
  return numeric;
};

const toNonNegativeInteger = (value, fallback = 0) =>
  Math.floor(toNonNegativeNumber(value, fallback));

const getUtcDateKey = (value) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const keyToUtcDate = (dateKey) => {
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const getDayDiff = (olderKey, newerKey) => {
  const older = keyToUtcDate(olderKey);
  const newer = keyToUtcDate(newerKey);

  if (!older || !newer) {
    return null;
  }

  return Math.round((newer.getTime() - older.getTime()) / 86_400_000);
};

const computeAccuracy = (correctAnswers, totalAnswers) => {
  const correct = toNonNegativeInteger(correctAnswers);
  const total = toNonNegativeInteger(totalAnswers);
  if (total === 0) {
    return 0;
  }
  return Math.round((correct / total) * 100);
};

const normalizeLevelEntry = (rawEntry = {}) => {
  const known = toNonNegativeInteger(rawEntry.known);
  const answered = toNonNegativeInteger(rawEntry.answered);
  const score = toNonNegativeNumber(rawEntry.score);
  const maxScore = toNonNegativeNumber(rawEntry.maxScore);

  return {
    known,
    answered,
    score,
    maxScore,
    accuracy: computeAccuracy(known, answered)
  };
};

const normalizeLevelMastery = (rawMastery = {}) => {
  const levelMastery = {};

  LEVELS.forEach((level) => {
    levelMastery[level] = normalizeLevelEntry(rawMastery[level] || {});
  });

  return levelMastery;
};

const updateStreak = (currentStreak, lastActiveDate, activityDateInput) => {
  const activityKey = getUtcDateKey(activityDateInput || new Date());
  const safeActivityKey = activityKey || getUtcDateKey(new Date());
  const lastActiveKey = getUtcDateKey(lastActiveDate);
  const baseStreak = toNonNegativeInteger(currentStreak);

  let streak = baseStreak;

  if (!lastActiveKey) {
    streak = Math.max(baseStreak, 1);
  } else {
    const diff = getDayDiff(lastActiveKey, safeActivityKey);
    if (diff === 0) {
      streak = Math.max(baseStreak, 1);
    } else if (diff === 1) {
      streak = baseStreak + 1;
    } else {
      streak = 1;
    }
  }

  return {
    streak,
    lastActiveDate: keyToUtcDate(safeActivityKey)
  };
};

const buildStatsSnapshot = (source) => {
  const stats = source && source.stats ? source.stats : source || {};

  const score = toNonNegativeNumber(stats.score);
  const testsTaken = toNonNegativeInteger(stats.testsTaken);
  const knownWords = toNonNegativeInteger(stats.knownWords);
  const correctAnswers = toNonNegativeInteger(stats.correctAnswers);
  const totalAnswers = toNonNegativeInteger(stats.totalAnswers);
  const streak = toNonNegativeInteger(stats.streak);
  const accuracy = computeAccuracy(correctAnswers, totalAnswers);

  return {
    score,
    points: score,
    testsTaken,
    tests: testsTaken,
    knownWords,
    streak,
    correctAnswers,
    totalAnswers,
    accuracy,
    lastActiveDate: getUtcDateKey(stats.lastActiveDate),
    levelMastery: normalizeLevelMastery(stats.levelMastery || {})
  };
};

module.exports = {
  LEVELS,
  buildStatsSnapshot,
  computeAccuracy,
  getUtcDateKey,
  toNonNegativeInteger,
  toNonNegativeNumber,
  updateStreak
};
