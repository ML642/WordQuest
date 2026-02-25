import { useMemo } from "react";
import { Link } from "react-router";
import styles from "./myStats.module.css";

const STATS_STORAGE_KEY = "wordquest_profile_stats";

const parseJson = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const firstNumber = (...values) => {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 0) {
      return numeric;
    }
  }
  return null;
};

const formatMaybeNumber = (value, fallback = "--") => (value === null ? fallback : value);

const readStatsSnapshot = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const rawStats = localStorage.getItem(STATS_STORAGE_KEY) || sessionStorage.getItem(STATS_STORAGE_KEY);

  const user = parseJson(rawUser);
  const stats = parseJson(rawStats);

  const score = firstNumber(user?.score, user?.points, stats?.score, stats?.points);
  const streak = firstNumber(user?.streak, stats?.streak);
  const testsTaken = firstNumber(user?.testsTaken, user?.tests, stats?.testsTaken, stats?.tests);
  const knownWords = firstNumber(user?.knownWords, stats?.knownWords);
  const accuracy = firstNumber(user?.accuracy, stats?.accuracy);

  return {
    isLoggedIn: Boolean(token),
    items: [
      { label: "Score", value: formatMaybeNumber(score), detail: "Total weighted points" },
      {
        label: "Current Streak",
        value: streak === null ? "--" : `${streak}d`,
        detail: "Consecutive active days"
      },
      { label: "Tests Taken", value: formatMaybeNumber(testsTaken), detail: "Completed testing sessions" },
      { label: "Known Words", value: formatMaybeNumber(knownWords), detail: "Words marked as known" },
      {
        label: "Accuracy",
        value: accuracy === null ? "--" : `${accuracy}%`,
        detail: "Correct answers in tests"
      },
      { label: "Level Mastery", value: "Coming Soon", detail: "Per-level proficiency tracking" }
    ]
  };
};

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const MyStats = () => {
  const snapshot = useMemo(() => readStatsSnapshot(), []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>My Stats</h1>
        <p className={styles.subtitle}>
          Personal learning analytics. This page is prepared for backend-driven stats sync.
        </p>
        {!snapshot.isLoggedIn ? (
          <p className={styles.loginHint}>
            You are currently signed out.{" "}
            <Link to="/Login" className={styles.inlineLink}>
              Sign in
            </Link>{" "}
            to track your progress.
          </p>
        ) : null}
      </section>

      <section className={styles.statsGrid}>
        {snapshot.items.map((item) => (
          <article key={item.label} className={styles.statCard}>
            <p className={styles.statLabel}>{item.label}</p>
            <p className={styles.statValue}>{item.value}</p>
            <p className={styles.statDetail}>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Level Breakdown</h2>
        <p className={styles.panelHint}>Frontend placeholder ready for per-level metrics.</p>
        <div className={styles.levelRows}>
          {LEVELS.map((level) => (
            <div key={level} className={styles.levelRow}>
              <span className={styles.levelLabel}>{level}</span>
              <div className={styles.levelTrack}>
                <div className={styles.levelFill} style={{ width: "0%" }} />
              </div>
              <span className={styles.levelValue}>--</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MyStats;
