import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./header.module.css";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

const AUTH_EVENT = "auth-state-changed";

const readStoredAuth = () => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const token = localToken || sessionToken || "";

  const localUser = localStorage.getItem("user");
  const sessionUser = sessionStorage.getItem("user");
  const userRaw = localUser || sessionUser;

  let user = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  let decoded = null;
  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch {
      decoded = null;
    }
  }

  return {
    token,
    user,
    decoded
  };
};

const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const buildDisplayName = (authState) => {
  const options = [
    authState.user?.username,
    authState.user?.name,
    authState.decoded?.username,
    authState.decoded?.userName,
    authState.user?.email,
    authState.decoded?.userEmail
  ];

  const firstValid = options.find((value) => String(value || "").trim());
  return firstValid ? String(firstValid).trim() : "User";
};

const LoggedIn = ({ authState, onSignOut }) => {
  const [dropdown, setDropdown] = useState(false);
  const rootRef = useRef(null);

  const displayName = useMemo(() => buildDisplayName(authState), [authState]);
  const email = authState.user?.email || authState.decoded?.userEmail || "";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

  useEffect(() => {
    if (!dropdown) {
      return;
    }

    const handleOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdown]);

  return (
    <div className={styles.userMenu} ref={rootRef}>
      <button
        type="button"
        className={styles.isLoggedIn}
        onClick={() => setDropdown((prev) => !prev)}
        aria-expanded={dropdown}
        aria-haspopup="menu"
      >
        <span className={styles.userIcon}>{initials}</span>
        <span className={styles.userName}>{displayName}</span>
      </button>

      {dropdown && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <p className={styles.dropdownName}>{displayName}</p>
            {email ? <p className={styles.dropdownEmail}>{email}</p> : null}
          </div>

          <div className={styles.dropdownActions}>
            <Link className={styles.dropdownButton} to="/WordArch" onClick={() => setDropdown(false)}>
              Continue Learning
            </Link>
            <Link className={styles.dropdownButton} to="/MyStats" onClick={() => setDropdown(false)}>
              My Stats
            </Link>
            <button
              type="button"
              className={`${styles.dropdownButton} ${styles.logoutButton}`}
              onClick={() => {
                setDropdown(false);
                onSignOut();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [authState, setAuthState] = useState(() => readStoredAuth());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      setAuthState(readStoredAuth());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_EVENT, syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isLoggedIn = Boolean(authState.token);

  const handleSignOut = () => {
    clearStoredAuth();
    navigate("/Login");
  };

  return (
    <header className={styles.container}>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Link to="/" className={styles.logoLink}>
          <div className={styles.logo}>Voc&M</div>
        </Link>
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

      <nav
        className={`${styles.navigator} ${isMenuOpen ? styles.navigatorOpen : ""}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.4 }}>
          <Link className={styles.Link} to="/">
            Home
          </Link>
        </motion.div>
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }}>
          <Link className={styles.Link} to="/WordArch">
            Word Archive
          </Link>
        </motion.div>
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>
          <Link className={styles.Link} to="/collocations">
            Collocations
          </Link>
        </motion.div>
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
          <Link className={styles.Link} to="/Testing">
            Testing
          </Link>
        </motion.div>
      </nav>

      <motion.div
        className={styles.authSlot}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {!isLoggedIn ? (
          <div className={styles.authButtons}>
            <Link to="/Login" className={styles.loginButton}>
              Sign In
            </Link>
            <Link to="/Registration" className={styles.registerButton}>
              Sign Up
            </Link>
          </div>
        ) : (
          <LoggedIn authState={authState} onSignOut={handleSignOut} />
        )}
      </motion.div>
    </header>
  );
};

export default Header;
