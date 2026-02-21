import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./wordArch.module.css";

const SESSION_SIZE_OPTIONS = [20, 40, 80, 120];
const TIME_LIMIT_OPTIONS = [
    { value: "none", label: "No time limit" },
    { value: "60", label: "1 minute" },
    { value: "180", label: "3 minutes" },
    { value: "300", label: "5 minutes" },
    { value: "600", label: "10 minutes" }
];
const ORDER_OPTIONS = [
    { value: "random", label: "Random order" },
    { value: "alphabetical", label: "Alphabetical order" }
];

const DEFAULT_MENU_CONFIG = {
    wordCount: 40,
    timeLimit: "none",
    order: "random"
};

const CEFR_LEVEL_DATA = [
    {
        level: "A1",
        name: "Beginner",
        description:
            "Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others, ask and answer questions about personal details."
    },
    {
        level: "A2",
        name: "Elementary",
        description:
            "Can understand sentences and frequently used expressions related to most relevant areas. Can communicate in simple and routine tasks requiring a simple and direct exchange of information."
    },
    {
        level: "B1",
        name: "Intermediate",
        description:
            "Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise while travelling."
    },
    {
        level: "B2",
        name: "Upper Intermediate",
        description:
            "Can understand the main ideas of complex text on both concrete and abstract topics. Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible."
    },
    {
        level: "C1",
        name: "Advanced",
        description:
            "Can understand a wide range of demanding, longer texts, and recognize implicit meaning. Can express ideas fluently and spontaneously without much obvious searching for expressions."
    },
    {
        level: "C2",
        name: "Mastery",
        description:
            "Can understand with ease virtually everything heard or read. Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations."
    },
    {
        level: "Mixed",
        name: "All Levels",
        description:
            "A diverse selection of words from all CEFR levels. Perfect for mixed practice and general vocabulary enhancement."
    }
];

const EXAMPLE_WORDS = {
    A1: ["hello", "please", "water", "happy", "book", "house"],
    A2: ["yesterday", "different", "travel", "weather", "shopping", "because"],
    B1: ["participate", "solution", "experience", "consider", "achievement", "language"],
    B2: ["consequently", "negotiate", "implement", "significant", "analysis", "interpret"],
    C1: ["hypothetical", "empirical", "ubiquitous", "derivative", "subsequent", "scrutinize"],
    C2: ["idiosyncratic", "ephemeral", "paradoxical", "quintessential", "ameliorate", "proliferation"],
    Mixed: ["adapt", "insight", "implement", "ubiquitous", "paradoxical", "legacy"]
};

const shuffleArray = (input) => {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const cleanWord = (rawWord) => String(rawWord || "").trim().replace(/\s+/g, " ");

const dedupeWords = (words) => {
    const seen = new Set();
    const unique = [];

    words.forEach((rawWord) => {
        const normalized = cleanWord(rawWord);
        if (!normalized) {
            return;
        }

        const key = normalized.toLowerCase();
        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        unique.push(normalized);
    });

    return unique;
};

const getLevelWords = (wordBank, level) => {
    if (!wordBank) {
        return [];
    }

    if (level === "Mixed") {
        return dedupeWords(Object.values(wordBank).flat());
    }

    return dedupeWords(wordBank[level] || []);
};

const pickSessionWords = (allWords, requestedSize, order) => {
    if (!allWords.length) {
        return [];
    }

    const size = Math.max(1, Math.min(requestedSize, allWords.length));

    if (order === "alphabetical") {
        return [...allWords]
            .sort((a, b) => a.localeCompare(b))
            .slice(0, size);
    }

    return shuffleArray(allWords).slice(0, size);
};

const removeLastOccurrence = (arr, value) => {
    const index = arr.lastIndexOf(value);
    if (index === -1) {
        return arr;
    }

    return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

const isEditableElement = (element) => {
    if (!element) {
        return false;
    }

    const editableTags = ["INPUT", "SELECT", "TEXTAREA"];
    return editableTags.includes(element.tagName) || element.isContentEditable;
};

const formatSeconds = (seconds) => {
    if (seconds === null) {
        return "No limit";
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getLevelMeta = (level) => CEFR_LEVEL_DATA.find((entry) => entry.level === level);

const LevelBlocks = ({ onSelectLevel, selectedLevel }) => (
    <div className={styles.tableContainer}>
        <div className={styles.levelGrid}>
            {CEFR_LEVEL_DATA.map((level) => (
                <article
                    key={level.level}
                    className={`${styles.levelCard} ${selectedLevel === level.level ? styles.selectedCard : ""}`}
                    onClick={() => onSelectLevel(level.level)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onSelectLevel(level.level);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                >
                    <header className={styles.levelCardHeader}>
                        <span className={styles.levelName}>{level.level}</span>
                        <span className={styles.levelTitle}>{level.name}</span>
                    </header>
                    <p className={styles.descriptionContent}>{level.description}</p>
                    <div className={styles.examplesContainer}>
                        <span className={styles.examplesLabel}>Example words</span>
                        <div className={styles.exampleTags}>
                            {EXAMPLE_WORDS[level.level].map((word) => (
                                <span key={word} className={styles.exampleTag}>
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </div>
);

const SessionSetupMenu = ({ level, config, onChange, onCancel, onStart }) => {
    const levelMeta = getLevelMeta(level);

    return (
        <div className={styles.setupOverlay} onClick={onCancel}>
            <div className={styles.setupCard} onClick={(event) => event.stopPropagation()}>
                <h3 className={styles.setupTitle}>Start {level} Session</h3>
                <p className={styles.setupDescription}>
                    {levelMeta ? levelMeta.name : "Practice"}: choose your session settings.
                </p>

                <div className={styles.setupFields}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="menu-time-limit">
                            Time
                        </label>
                        <select
                            id="menu-time-limit"
                            className={styles.fieldSelect}
                            value={config.timeLimit}
                            onChange={(event) => onChange("timeLimit", event.target.value)}
                        >
                            {TIME_LIMIT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="menu-word-count">
                            Words
                        </label>
                        <select
                            id="menu-word-count"
                            className={styles.fieldSelect}
                            value={config.wordCount}
                            onChange={(event) => onChange("wordCount", Number(event.target.value))}
                        >
                            {SESSION_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size} words
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="menu-order">
                            Extra: order
                        </label>
                        <select
                            id="menu-order"
                            className={styles.fieldSelect}
                            value={config.order}
                            onChange={(event) => onChange("order", event.target.value)}
                        >
                            {ORDER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.setupActions}>
                    <button type="button" className={styles.secondaryAction} onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className={styles.primaryAction} onClick={onStart}>
                        Start Session
                    </button>
                </div>
            </div>
        </div>
    );
};

const WordCheck = ({ level, levelTitle, words, timeLimitSeconds, onClose }) => {
    const [sessionWords, setSessionWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [knownWords, setKnownWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState([]);
    const [answerHistory, setAnswerHistory] = useState([]);
    const [copyStatus, setCopyStatus] = useState("");
    const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
    const [timedOut, setTimedOut] = useState(false);

    const startSession = useCallback(
        (sourceWords) => {
            setSessionWords([...sourceWords]);
            setCurrentIndex(0);
            setKnownWords([]);
            setUnknownWords([]);
            setAnswerHistory([]);
            setCopyStatus("");
            setTimeLeft(timeLimitSeconds);
            setTimedOut(false);
        },
        [timeLimitSeconds]
    );

    useEffect(() => {
        startSession(words);
    }, [words, startSession]);

    const totalWords = sessionWords.length;
    const answeredCount = knownWords.length + unknownWords.length;
    const isComplete = totalWords > 0 && answeredCount === totalWords;
    const sessionEnded = isComplete || timedOut;
    const currentWord = sessionWords[currentIndex] || "";
    const progressPercent = totalWords ? Math.round((answeredCount / totalWords) * 100) : 0;
    const successRate = answeredCount ? Math.round((knownWords.length / answeredCount) * 100) : 0;
    const uniqueUnknownWords = useMemo(() => dedupeWords(unknownWords), [unknownWords]);
    const unattemptedWords = Math.max(0, totalWords - answeredCount);

    useEffect(() => {
        if (timeLimitSeconds === null || sessionEnded || timeLeft === null) {
            return;
        }

        if (timeLeft <= 0) {
            setTimedOut(true);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) {
                    return null;
                }
                return Math.max(prev - 1, 0);
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timeLeft, timeLimitSeconds, sessionEnded]);

    const handleResponse = useCallback(
        (knowsWord) => {
            if (!currentWord || sessionEnded) {
                return;
            }

            setAnswerHistory((prev) => [...prev, { word: currentWord, knows: knowsWord }]);

            if (knowsWord) {
                setKnownWords((prev) => [...prev, currentWord]);
            } else {
                setUnknownWords((prev) => [...prev, currentWord]);
            }

            setCurrentIndex((prev) => prev + 1);
        },
        [currentWord, sessionEnded]
    );

    const handleUndo = useCallback(() => {
        if (!answerHistory.length || answeredCount === 0 || sessionEnded) {
            return;
        }

        const lastAnswer = answerHistory[answerHistory.length - 1];
        setAnswerHistory((prev) => prev.slice(0, -1));

        if (lastAnswer.knows) {
            setKnownWords((prev) => removeLastOccurrence(prev, lastAnswer.word));
        } else {
            setUnknownWords((prev) => removeLastOccurrence(prev, lastAnswer.word));
        }

        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, [answerHistory, answeredCount, sessionEnded]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (sessionEnded || isEditableElement(document.activeElement)) {
                return;
            }

            const key = event.key.toLowerCase();

            if (key === "arrowright" || key === "k") {
                event.preventDefault();
                handleResponse(true);
                return;
            }

            if (key === "arrowleft" || key === "d") {
                event.preventDefault();
                handleResponse(false);
                return;
            }

            if ((key === "u" || (event.ctrlKey && key === "z")) && answerHistory.length) {
                event.preventDefault();
                handleUndo();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [sessionEnded, answerHistory.length, handleResponse, handleUndo]);

    const restartSession = () => {
        startSession(words);
    };

    const retryUnknownWords = () => {
        if (!uniqueUnknownWords.length) {
            return;
        }

        startSession(uniqueUnknownWords);
    };

    const handleCopyUnknown = async () => {
        if (!uniqueUnknownWords.length) {
            setCopyStatus("No unknown words to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(uniqueUnknownWords.join("\n"));
            setCopyStatus("Unknown words copied.");
        } catch {
            setCopyStatus("Clipboard access unavailable.");
        }
    };

    const handleDownloadUnknown = () => {
        if (!uniqueUnknownWords.length) {
            setCopyStatus("No unknown words to export.");
            return;
        }

        const fileContent = uniqueUnknownWords.join("\n");
        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `word-archive-${level}-unknown.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
        setCopyStatus("Unknown words exported.");
    };

    return (
        <div className={styles.wordCheckSection}>
            <div className={styles.wordCheckHeader}>
                <h2>
                    {level} - {levelTitle}
                </h2>
                <button type="button" className={styles.closeButton} onClick={onClose}>
                    Exit
                </button>
            </div>

            {!sessionEnded ? (
                <div className={styles.wordCheckContent}>
                    <div className={styles.wordCard}>
                        <div className={styles.progressMeta}>
                            <span className={styles.progressIndicator}>
                                {answeredCount} / {totalWords} practiced
                            </span>
                            {timeLimitSeconds !== null && (
                                <span className={styles.timerBadge}>Time left: {formatSeconds(timeLeft)}</span>
                            )}
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className={styles.wordDisplay}>{currentWord}</div>
                        <div className={styles.quickHint}>Shortcuts: `K/Right` Know, `D/Left` Don&apos;t know, `U` Undo.</div>
                        <div className={styles.responseButtons}>
                            <button
                                type="button"
                                className={`${styles.responseButton} ${styles.unknownButton}`}
                                onClick={() => handleResponse(false)}
                            >
                                Don&apos;t Know
                            </button>
                            <button
                                type="button"
                                className={`${styles.responseButton} ${styles.knownButton}`}
                                onClick={() => handleResponse(true)}
                            >
                                Know
                            </button>
                        </div>
                        <button
                            type="button"
                            className={styles.undoButton}
                            onClick={handleUndo}
                            disabled={!answerHistory.length}
                        >
                            Undo Last Answer
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.resultsSection}>
                    <h3>{timedOut ? "Time Up" : "Session Complete"}</h3>
                    <div className={styles.resultStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Words Known</span>
                            <span className={styles.statValue}>{knownWords.length}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Words to Learn</span>
                            <span className={styles.statValue}>{uniqueUnknownWords.length}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Accuracy</span>
                            <span className={styles.statValue}>{successRate}%</span>
                        </div>
                        {timedOut && (
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Unattempted</span>
                                <span className={styles.statValue}>{unattemptedWords}</span>
                            </div>
                        )}
                    </div>

                    {uniqueUnknownWords.length > 0 && (
                        <div className={styles.wordsToLearn}>
                            <h4>Focus Words</h4>
                            <div className={styles.wordList}>
                                {uniqueUnknownWords.map((word) => (
                                    <span key={word} className={styles.wordTag}>
                                        {word}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.wordTools}>
                                <button type="button" className={styles.toolButton} onClick={handleCopyUnknown}>
                                    Copy List
                                </button>
                                <button type="button" className={styles.toolButton} onClick={handleDownloadUnknown}>
                                    Export .txt
                                </button>
                            </div>
                            {copyStatus && <div className={styles.copyStatus}>{copyStatus}</div>}
                        </div>
                    )}

                    <div className={styles.resultActions}>
                        {uniqueUnknownWords.length > 0 && (
                            <button type="button" className={styles.resetButton} onClick={retryUnknownWords}>
                                Retry Unknown
                            </button>
                        )}
                        <button type="button" className={styles.resetButton} onClick={restartSession}>
                            Start New Round
                        </button>
                        <button type="button" className={styles.secondaryAction} onClick={onClose}>
                            Choose Another Level
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const WordArch = () => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [pendingLevel, setPendingLevel] = useState(null);
    const [menuConfig, setMenuConfig] = useState(DEFAULT_MENU_CONFIG);
    const [activeConfig, setActiveConfig] = useState(DEFAULT_MENU_CONFIG);
    const [wordBank, setWordBank] = useState(null);
    const [allLevelWords, setAllLevelWords] = useState([]);
    const [sessionWords, setSessionWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState("");

    const loadWordBank = useCallback(async () => {
        if (wordBank) {
            return wordBank;
        }

        const response = await fetch("/cefr_words.json");
        if (!response.ok) {
            throw new Error(`Unable to load word archive (${response.status})`);
        }

        const data = await response.json();
        setWordBank(data);
        return data;
    }, [wordBank]);

    const applySession = useCallback((allWords, config) => {
        const sampledWords = pickSessionWords(allWords, config.wordCount, config.order);
        setSessionWords(sampledWords);
    }, []);

    const openSetupMenu = (level) => {
        const baseConfig = selectedLevel === level ? activeConfig : DEFAULT_MENU_CONFIG;
        setMenuConfig({ ...baseConfig });
        setPendingLevel(level);
    };

    const closeSetupMenu = () => {
        setPendingLevel(null);
    };

    const startLevelSession = async () => {
        if (!pendingLevel) {
            return;
        }

        const selectedConfig = { ...menuConfig };
        setIsLoading(true);
        setLoadError("");

        try {
            const data = await loadWordBank();
            const levelWords = getLevelWords(data, pendingLevel);

            if (!levelWords.length) {
                setLoadError("No words found for this level.");
                return;
            }

            setSelectedLevel(pendingLevel);
            setAllLevelWords(levelWords);
            setActiveConfig(selectedConfig);
            applySession(levelWords, selectedConfig);
            setPendingLevel(null);
        } catch (error) {
            console.error("Error loading words:", error);
            setLoadError("Could not load words right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSession = () => {
        setSelectedLevel(null);
        setAllLevelWords([]);
        setSessionWords([]);
        setLoadError("");
    };

    const regenerateSession = () => {
        if (!allLevelWords.length) {
            return;
        }

        applySession(allLevelWords, activeConfig);
    };

    const levelMeta = getLevelMeta(selectedLevel);
    const timeLimitSeconds =
        activeConfig.timeLimit === "none" ? null : Number(activeConfig.timeLimit);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wordArchContainer}>
                <section className={styles.wordArchSection}>
                    <h1 className={styles.title}>Word Archive</h1>
                    <p className={styles.subtitle}>
                        Click any level block, choose your session options, and start.
                    </p>

                    {!selectedLevel && (
                        <LevelBlocks onSelectLevel={openSetupMenu} selectedLevel={pendingLevel} />
                    )}

                    {isLoading && <div className={styles.loading}>Loading words...</div>}

                    {loadError && !isLoading && <div className={styles.errorMessage}>{loadError}</div>}

                    {selectedLevel && !isLoading && sessionWords.length > 0 && (
                        <>
                            <div className={styles.sessionMeta}>
                                <span>
                                    {selectedLevel}
                                    {levelMeta ? ` (${levelMeta.name})` : ""} | {sessionWords.length} words |{" "}
                                    {formatSeconds(timeLimitSeconds)} | {activeConfig.order}
                                </span>
                                <div className={styles.sessionMetaActions}>
                                    <button type="button" className={styles.secondaryAction} onClick={regenerateSession}>
                                        New Session
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.secondaryAction}
                                        onClick={() => openSetupMenu(selectedLevel)}
                                    >
                                        Change Setup
                                    </button>
                                </div>
                            </div>
                            <WordCheck
                                level={selectedLevel}
                                levelTitle={levelMeta ? levelMeta.name : "Practice"}
                                words={sessionWords}
                                timeLimitSeconds={timeLimitSeconds}
                                onClose={handleCloseSession}
                            />
                        </>
                    )}

                    {pendingLevel && (
                        <SessionSetupMenu
                            level={pendingLevel}
                            config={menuConfig}
                            onChange={(key, value) => setMenuConfig((prev) => ({ ...prev, [key]: value }))}
                            onCancel={closeSetupMenu}
                            onStart={startLevelSession}
                        />
                    )}
                </section>
            </div>
        </div>
    );
};

export default WordArch;
