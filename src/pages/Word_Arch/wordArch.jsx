import { useState, useEffect } from "react"; 
import styles from "./wordArch.module.css"



const getLevelName = (level) => {
    const names = {
        'A1': 'Beginner',
        'A2': 'Elementary',
        'B1': 'Intermediate',
        'B2': 'Upper Intermediate',
        'C1': 'Advanced',
        'C2': 'Mastery'
    };
    return names[level] || level;
};

const getLevelDescription = (level) => {
    const descriptions = {
        'A1': 'Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others, ask and answer questions about personal details.',
        'A2': 'Can understand sentences and frequently used expressions related to most relevant areas. Can communicate in simple and routine tasks requiring a simple and direct exchange of information.',
        'B1': 'Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise while travelling.',
        'B2': 'Can understand the main ideas of complex text on both concrete and abstract topics. Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.',
        'C1': 'Can understand a wide range of demanding, longer texts, and recognize implicit meaning. Can express ideas fluently and spontaneously without much obvious searching for expressions.',
        'C2': 'Can understand with ease virtually everything heard or read. Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations.'
    };
    return descriptions[level] || '';
};


const getExampleWords = (level) => {
    const examples = {
        'A1': ["Hello", "Thank you", "Yes", "No", "Please", "Water", "Food"],
        'A2': ["Yesterday", "Tomorrow", "Because", "Different", "Shopping", "Weather", "Travel"],
        'B1': ["Nevertheless", "Moreover", "Participate", "Achievement", "Experience", "Solution", "Consider"],
        'B2': ["Consequently", "Furthermore", "Negotiate", "Implement", "Significant", "Interpret", "Analysis"],
        'C1': ["Subsequent", "Hypothetical", "Paradigm", "Empirical", "Ubiquitous", "Derivative", "Scrutinize"],
        'C2': ["Esoteric", "Proliferation", "Idiosyncratic", "Ephemeral", "Quintessential", "Paradoxical", "Ameliorate"],
        'Mixed': ["Hello", "Achievement", "Nevertheless", "Consequently", "Implement", "Hypothetical"]
    };
    return examples[level] || [];
};

const cerfLevelData = [
    { level: "A1", name: "Beginner", description: "Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others, ask and answer questions about personal details." },
    { level: "A2", name: "Elementary", description: "Can understand sentences and frequently used expressions related to most relevant areas. Can communicate in simple and routine tasks requiring a simple and direct exchange of information." },
    { level: "B1", name: "Intermediate", description: "Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise while travelling." },
    { level: "B2", name: "Upper Intermediate", description: "Can understand the main ideas of complex text on both concrete and abstract topics. Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible." },
    { level: "C1", name: "Advanced", description: "Can understand a wide range of demanding, longer texts, and recognize implicit meaning. Can express ideas fluently and spontaneously without much obvious searching for expressions." },
    { level: "C2", name: "Mastery", description: "Can understand with ease virtually everything heard or read. Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations." },
    { level: "Mixed", name: "All Levels", description: "A diverse selection of words from all CEFR levels. Perfect for mixed practice and general vocabulary enhancement." }
];

const CEFRTable = ({ onSelectLevel, cerfLevelData, selectedLevel: currentLevel }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.cefrTable}>
                <thead>
                    <tr>
                        <th className={styles.levelHeader}>CEFR Level</th>
                        <th className={styles.descriptionHeader}>Level Description</th>
                    </tr>
                </thead>
                <tbody>
                    {cerfLevelData.map((level) => (
                        <tr 
                            key={level.level}
                            className={`${styles.tableRow} ${currentLevel === level.level ? styles.selectedRow : ''}`}
                            onClick={() => onSelectLevel(level.level)}
                        >
                            <td className={styles.levelCell}>
                                <div className={styles.levelBadge}>
                                    <span className={styles.levelName}>{level.level}</span>
                                    <span className={styles.levelTitle}>{level.name}</span>
                                </div>
                            </td>
                            <td className={styles.descriptionCell}>
                                <div className={styles.descriptionContent}>
                                    {level.description}
                                </div>
                                <div className={styles.examplesContainer}>
                                    <span className={styles.examplesLabel}>Example Words:</span>
                                    <div className={styles.exampleTags}>
                                        {getExampleWords(level.level).map((word, idx) => (
                                            <span key={idx} className={styles.exampleTag}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


const WordCheck = ({ level, words, onClose }) => {
    const [currentWord, setCurrentWord] = useState('');
    const [remainingWords, setRemainingWords] = useState([]);
    const [knownWords, setKnownWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState([]);
    const [showResult, setShowResult] = useState(false);
    
    // Initialize remaining words and first word
    useEffect(() => {
        setRemainingWords(words);
        if (words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            setCurrentWord(words[randomIndex]);
            setRemainingWords(words.filter((_, i) => i !== randomIndex));
        }
    }, [words]);
    
    const pickRandomWord = () => {
        if (remainingWords.length === 0) {
            setShowResult(true);
            return;
        }
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        const word = remainingWords[randomIndex];
        const newRemainingWords = [
            ...remainingWords.slice(0, randomIndex),
            ...remainingWords.slice(randomIndex + 1)
        ];
        setRemainingWords(newRemainingWords);
        setCurrentWord(word);
    };
    
    const handleResponse = (knows) => {
        if (knows) {
            setKnownWords([...knownWords, currentWord]);
        } else {
            setUnknownWords([...unknownWords, currentWord]);
        }
        pickRandomWord();
    };

    const resetCheck = () => {
        setRemainingWords(words);
        setKnownWords([]);
        setUnknownWords([]);
        setShowResult(false);
        pickRandomWord();
    };

    return (
        <div className={styles.wordCheckSection}>
            <div className={styles.wordCheckHeader}>
                <h2>Learn {level} Level Words</h2>
                <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
            <div className={styles.wordCheckContent}>
                {!showResult ? (
                    <div className={styles.wordCard}>
                        <div className={styles.wordDisplay}>
                            {currentWord}
                        </div>
                        <div className={styles.progressIndicator}>
                            {words.length - remainingWords.length} words practiced
                        </div>
                        <div className={styles.responseButtons}>
                            <button 
                                className={`${styles.responseButton} ${styles.unknownButton}`}
                                onClick={() => handleResponse(false)}
                            >
                                Don't Know
                            </button>
                            <button 
                                className={`${styles.responseButton} ${styles.knownButton}`}
                                onClick={() => handleResponse(true)}
                            >
                                Know
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.resultsSection}>
                        <h3>Your Results</h3>
                        <div className={styles.resultStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Words Known:</span>
                                <span className={styles.statValue}>{knownWords.length}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Words to Learn:</span>
                                <span className={styles.statValue}>{unknownWords.length}</span>
                            </div>
                        </div>
                        {unknownWords.length > 0 && (
                            <div className={styles.wordsToLearn}>
                                <h4>Words to Focus On:</h4>
                                <div className={styles.wordList}>
                                    {unknownWords.map((word, idx) => (
                                        <span key={idx} className={styles.wordTag}>
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button 
                            className={styles.resetButton}
                            onClick={resetCheck}
                        >
                            Start Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const WordArch = () => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [levelWords, setLevelWords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadWordsForLevel = async (level) => {
        setIsLoading(true);
        try {
            const response = await fetch('/cefr_words.json');
            const data = await response.json();
            
            if (level === 'Mixed') {
                // For mixed level, get a random selection from all levels
                const allWords = Object.values(data).flat();
                const uniqueWords = [...new Set(allWords)];
                // Shuffle array
                for (let i = uniqueWords.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [uniqueWords[i], uniqueWords[j]] = [uniqueWords[j], uniqueWords[i]];
                }
                setLevelWords(uniqueWords);
            } else {
                // For specific levels, get all words for that level
                const words = data[level] || [];
                const uniqueWords = [...new Set(words)];
                // Shuffle array
                for (let i = uniqueWords.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [uniqueWords[i], uniqueWords[j]] = [uniqueWords[j], uniqueWords[i]];
                }
                setLevelWords(uniqueWords);
            }
        } catch (error) {
            console.error('Error loading words:', error);
            setLevelWords([]);
        }
        setIsLoading(false);
    };

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
        loadWordsForLevel(level);
    };

    const handleClose = () => {
        setSelectedLevel(null);
        setLevelWords(null);
    };

    return (
    <div className={styles.pageWrapper}>  
        <div className={styles.wordArchContainer}>  
            <section className={styles.wordArchSection}> 
                <h1 className={styles.title}>Choose Your CEFR Level</h1>
                <CEFRTable 
                    onSelectLevel={handleLevelSelect}
                    cerfLevelData={cerfLevelData}
                    selectedLevel={selectedLevel}
                />
                {selectedLevel && isLoading && (
                    <div className={styles.loading}>Loading words...</div>
                )}
                {selectedLevel && !isLoading && levelWords && (
                    <WordCheck 
                        level={selectedLevel}
                        words={levelWords}
                        onClose={handleClose}
                    />
                )}
            </section>
        </div>
    </div>
    )
}

export default WordArch  ;
     