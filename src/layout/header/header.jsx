import { useState } from "react";
import styles from "./header.module.css";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

const LoggedIn = () => {
    const token = localStorage.getItem("token");
    const [dropdown, setDropdown] = useState(false);
    let userName = "User";

    try {
        const decoded = jwtDecode(token);
        userName = decoded?.userName || "User";
    } catch {
        userName = "User";
    }
    return (
        <div className={styles.isLoggedIn} onClick={() => { setDropdown((prev) => !prev); }}>
            <div className={styles.userIcon} />
            <div className={styles.userName}>{userName}</div>
            {dropdown && (
                <div className={styles.dropdown} onClick={() => { setDropdown(false); }}>
                    <motion.div
                        className={styles.dropdownItem}
                        initial={{ x: -40, opacity: 1 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0, duration: 0.3 }}
                    >
                        <Link to="/Profile">Profile</Link>
                    </motion.div>

                    <motion.div
                        className={styles.dropdownItem}
                        initial={{ x: 40, opacity: 1 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                    >
                        <Link to="/Settings">Settings</Link>
                    </motion.div>

                    <div
                        className={styles.dropdownItem}
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.reload();
                        }}
                    >
                        Logout
                    </div>

                    <button
                        type="button"
                        className={styles.dropdownClose}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdown((prev) => !prev);
                        }}
                        aria-label="Close dropdown"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7 14L12 9L17 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

const Header = () => {
    const token = localStorage.getItem("token");
    const isLoggedIn = Boolean(token);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.container}>
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                <div className={styles.logo}>Voc&M</div>
            </motion.div>

            <button
                type="button"
                className={styles.menuToggle}
                aria-label="Toggle navigation"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                <span className={styles.menuIconLine} />
                <span className={styles.menuIconLine} />
                <span className={styles.menuIconLine} />
            </button>

            <nav className={`${styles.navigator} ${isMenuOpen ? styles.navigatorOpen : ""}`} onClick={() => setIsMenuOpen(false)}>
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0, duration: 0.4 }}
                >
                    <Link className={styles.Link} to="/">Home</Link>
                </motion.div>
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1.2 }}
                >
                    <Link className={styles.Link} to="/WordArch">Word Archive</Link>
                </motion.div>
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                >
                    <Link className={styles.Link} to="/collocations">Collocations</Link>
                </motion.div>
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <Link className={styles.Link} to="/About">About</Link>
                </motion.div>
            </nav>

            <motion.div
                className={styles.authSlot}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                {!isLoggedIn ? (
                    <Link to="/Login"><div className={styles.loginButton}>LOGIN</div></Link>
                ) : (
                    <LoggedIn />
                )}
            </motion.div>
        </header>
    );
};

export default Header;
