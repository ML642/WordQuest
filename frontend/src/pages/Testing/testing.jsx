import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./testing.module.css";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LEVEL_POINTS = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6
};

const SESSION_SIZE = 24;

const shuffleArray = (input) => {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const cleanWord = (rawWord) => String(rawWord || "").trim().replace(/\s+/g, " ");

const buildWordPool = (wordBank) => {
    const seen = new Set();
    const pool = [];

    LEVELS.forEach((level) => {
        const words = wordBank[level] || [];
        words.forEach((rawWord) => {
            const word = cleanWord(rawWord);
            if (!word) {
                return;
            }

            const key = `${level}:${word.toLowerCase()}`;
            if (seen.has(key)) {
                return;
            }

            seen.add(key);
            pool.push({
                word,
                level,
                points: LEVEL_POINTS[level]
            });
        });
    });

    return pool;
};

const createSession = (pool) => {
    if (!pool.length) {
        return [];
    }

    return shuffleArray(pool).slice(0, Math.min(SESSION_SIZE, pool.length));
};

const getRatingLabel = (percent) => {
    if (percent >= 90) {
        return "Elite";
    }
    if (percent >= 75) {
        return "Strong";
    }
    if (percent >= 55) {
        return "Developing";
    }
    return "Starter";
};

const Testing = () => {
    const [wordPool, setWordPool] = useState([]);
    const [sessionWords, setSessionWords] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastAward, setLastAward] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        let active = true;

        const loadWords = async () => {
            setIsLoading(true);
            setLoadError("");

            try {
                const response = await fetch("/cefr_words.json");
                if (!response.ok) {
                    throw new Error(`Unable to load testing words (${response.status})`);
                }

                const data = await response.json();
                const pool = buildWordPool(data);

                if (!pool.length) {
                    throw new Error("No words available for testing.");
                }

                if (!active) {
                    return;
                }

                setWordPool(pool);
                setSessionWords(createSession(pool));
                setAnswers([]);
                setCurrentIndex(0);
                setLastAward("");
            } catch (error) {
                console.error("Error loading testing words:", error);
                if (active) {
                    setLoadError("Could not load test words right now. Try again.");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadWords();
        return () => {
            active = false;
        };
    }, []);

    const currentWord = sessionWords[currentIndex] || null;
    const isComplete = sessionWords.length > 0 && currentIndex >= sessionWords.length;
    const answeredCount = answers.length;
    const knownCount = useMemo(() => answers.filter((item) => item.knows).length, [answers]);
    const score = useMemo(
        () => answers.reduce((total, item) => total + item.earnedPoints, 0),
        [answers]
    );
    const maxScore = useMemo(
        () => sessionWords.reduce((total, item) => total + item.points, 0),
        [sessionWords]
    );
    const scorePercent = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const rating = getRatingLabel(scorePercent);

    const unknownWords = useMemo(() => {
        const seen = new Set();
        return answers
            .filter((item) => !item.knows)
            .filter((item) => {
                const key = `${item.level}:${item.word.toLowerCase()}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
    }, [answers]);

    const levelStats = useMemo(() => {
        return LEVELS.map((level) => {
            const levelAnswers = answers.filter((item) => item.level === level);
            if (!levelAnswers.length) {
                return null;
            }

            return {
                level,
                answered: levelAnswers.length,
                known: levelAnswers.filter((item) => item.knows).length,
                earned: levelAnswers.reduce((sum, item) => sum + item.earnedPoints, 0),
                max: levelAnswers.reduce((sum, item) => sum + item.points, 0)
            };
        }).filter(Boolean);
    }, [answers]);

    const answerWord = useCallback(
        (knowsWord) => {
            if (!currentWord || isComplete) {
                return;
            }

            const earnedPoints = knowsWord ? currentWord.points : 0;
            setAnswers((prev) => [
                ...prev,
                {
                    ...currentWord,
                    knows: knowsWord,
                    earnedPoints
                }
            ]);
            setCurrentIndex((prev) => prev + 1);
            setLastAward(
                knowsWord
                    ? `+${earnedPoints} points (${currentWord.level})`
                    : `+0 points (${currentWord.level})`
            );
        },
        [currentWord, isComplete]
    );

    const startNewTest = () => {
        if (!wordPool.length) {
            return;
        }

        setSessionWords(createSession(wordPool));
        setAnswers([]);
        setCurrentIndex(0);
        setLastAward("");
    };

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Testing</h1>
                <p className={styles.subtitle}>
                    First run starts with a random pull of CEFR words. Each answer gets points based on word level.
                </p>
            </section>

            {isLoading && <section className={styles.statusCard}>Loading test words...</section>}
            {loadError && !isLoading && <section className={styles.errorCard}>{loadError}</section>}

            {!isLoading && !loadError && sessionWords.length > 0 && (
                <>
                    {!isComplete ? (
                        <section className={styles.testCard}>
                            <div className={styles.testHeader}>
                                <span>
                                    Question {Math.min(currentIndex + 1, sessionWords.length)} / {sessionWords.length}
                                </span>
                                <span className={styles.scoreBadge}>
                                    Score: {score}/{maxScore}
                                </span>
                            </div>

                            <div className={styles.progressTrack}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${Math.round((answeredCount / sessionWords.length) * 100)}%` }}
                                />
                            </div>

                            {currentWord && (
                                <div className={styles.wordBlock}>
                                    <span className={styles.levelBadge}>{currentWord.level}</span>
                                    <span className={styles.pointBadge}>Worth {currentWord.points} pts</span>
                                    <h2 className={styles.word}>{currentWord.word}</h2>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    className={`${styles.answerButton} ${styles.missButton}`}
                                    onClick={() => answerWord(false)}
                                >
                                    I Don&apos;t Know
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.answerButton} ${styles.knowButton}`}
                                    onClick={() => answerWord(true)}
                                >
                                    I Know It
                                </button>
                            </div>

                            <div className={styles.lastAward}>{lastAward || "Answer to receive a level-based rating."}</div>
                        </section>
                    ) : (
                        <section className={styles.resultCard}>
                            <h2 className={styles.resultTitle}>Test Complete</h2>
                            <div className={styles.resultGrid}>
                                <article className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Rating</span>
                                    <span className={styles.resultValue}>{rating}</span>
                                </article>
                                <article className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Score</span>
                                    <span className={styles.resultValue}>{score}/{maxScore}</span>
                                </article>
                                <article className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Weighted %</span>
                                    <span className={styles.resultValue}>{scorePercent}%</span>
                                </article>
                                <article className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Known Words</span>
                                    <span className={styles.resultValue}>{knownCount}/{sessionWords.length}</span>
                                </article>
                            </div>

                            {levelStats.length > 0 && (
                                <div className={styles.levelSummary}>
                                    <h3>Per Level Performance</h3>
                                    <div className={styles.levelRows}>
                                        {levelStats.map((entry) => (
                                            <div key={entry.level} className={styles.levelRow}>
                                                <span>{entry.level}</span>
                                                <span>{entry.earned}/{entry.max} pts</span>
                                                <span>{entry.known}/{entry.answered} known</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {unknownWords.length > 0 && (
                                <div className={styles.unknownWords}>
                                    <h3>Words To Review</h3>
                                    <div className={styles.wordTags}>
                                        {unknownWords.map((item) => (
                                            <span key={`${item.level}-${item.word}`} className={styles.wordTag}>
                                                {item.word} ({item.level})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button type="button" className={styles.restartButton} onClick={startNewTest}>
                                Start Another Random Test
                            </button>
                        </section>
                    )}
                </>
            )}
        </main>
    );
};

export default Testing;
