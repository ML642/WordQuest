import { useMemo, useState } from "react";
import styles from "./collocations.module.css";

const COLL_DATA = [
    {
        phrase: "make progress",
        level: "B1",
        type: "Verb + Noun",
        meaning: "to improve over time",
        example: "She made progress after one month of daily reading."
    },
    {
        phrase: "take responsibility",
        level: "B2",
        type: "Verb + Noun",
        meaning: "to accept duty for something",
        example: "Managers should take responsibility for team outcomes."
    },
    {
        phrase: "heavy rain",
        level: "A2",
        type: "Adjective + Noun",
        meaning: "a lot of rain",
        example: "Heavy rain delayed the game."
    },
    {
        phrase: "strong coffee",
        level: "A2",
        type: "Adjective + Noun",
        meaning: "coffee with intense flavor",
        example: "I prefer strong coffee in the morning."
    },
    {
        phrase: "highly recommend",
        level: "B2",
        type: "Adverb + Verb",
        meaning: "to strongly suggest",
        example: "I highly recommend learning collocations early."
    },
    {
        phrase: "pose a challenge",
        level: "C1",
        type: "Verb + Noun",
        meaning: "to create a difficulty",
        example: "Pronunciation can pose a challenge for beginners."
    },
    {
        phrase: "fully aware",
        level: "B2",
        type: "Adverb + Adjective",
        meaning: "completely informed",
        example: "He was fully aware of the deadline."
    },
    {
        phrase: "bitterly disappointed",
        level: "C1",
        type: "Adverb + Adjective",
        meaning: "very disappointed",
        example: "They were bitterly disappointed by the final result."
    },
    {
        phrase: "catch a cold",
        level: "A2",
        type: "Verb + Noun",
        meaning: "to become sick with a cold",
        example: "Wear a jacket or you might catch a cold."
    }
];

const typeOptions = ["All", ...new Set(COLL_DATA.map((item) => item.type))];
const levelOptions = ["All", ...new Set(COLL_DATA.map((item) => item.level))];

const Collocations = () => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("All");
    const [level, setLevel] = useState("All");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return COLL_DATA.filter((item) => {
            const matchQuery =
                !q ||
                item.phrase.toLowerCase().includes(q) ||
                item.meaning.toLowerCase().includes(q) ||
                item.example.toLowerCase().includes(q);
            const matchType = type === "All" || item.type === type;
            const matchLevel = level === "All" || item.level === level;
            return matchQuery && matchType && matchLevel;
        });
    }, [query, type, level]);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Collocations</h1>
                <p className={styles.subtitle}>
                    Practice natural word combinations used in real English.
                </p>
            </section>

            <section className={styles.controls}>
                <input
                    className={styles.input}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search phrase, meaning, or example..."
                />
                <select className={styles.select} value={type} onChange={(event) => setType(event.target.value)}>
                    {typeOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <select className={styles.select} value={level} onChange={(event) => setLevel(event.target.value)}>
                    {levelOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </section>

            <section className={styles.countBar}>{filtered.length} results</section>

            <section className={styles.grid}>
                {filtered.length === 0 && <div className={styles.empty}>No results. Try another filter.</div>}
                {filtered.map((item) => (
                    <article key={`${item.phrase}-${item.level}`} className={styles.card}>
                        <div className={styles.cardTop}>
                            <h3 className={styles.phrase}>{item.phrase}</h3>
                            <span className={styles.level}>{item.level}</span>
                        </div>
                        <span className={styles.type}>{item.type}</span>
                        <p className={styles.meaning}>{item.meaning}</p>
                        <p className={styles.example}>
                            <strong>Example:</strong> {item.example}
                        </p>
                    </article>
                ))}
            </section>
        </main>
    );
};

export default Collocations;
