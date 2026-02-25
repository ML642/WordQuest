import { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import GoogleOauth from "./Oauth";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import {
  EMPTY_POPUP,
  createPopup,
  getLoginPopupFromError
} from "../../utils/authPopup";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const AUTH_EVENT = "auth-state-changed";

const readStoredSession = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");

  let user = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }

  return { token: token || "", user };
};

const storeAuthSession = (payload, rememberMe) => {
  const preferredStore = rememberMe ? localStorage : sessionStorage;
  const secondaryStore = rememberMe ? sessionStorage : localStorage;

  secondaryStore.removeItem("token");
  secondaryStore.removeItem("user");

  preferredStore.setItem("token", payload.token);
  preferredStore.setItem("user", JSON.stringify(payload.user || {}));

  window.dispatchEvent(new Event(AUTH_EVENT));
};

const clearStoredSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const Login = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState(() => readStoredSession());
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(EMPTY_POPUP);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(EMPTY_POPUP);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 201 && response.data?.token) {
        storeAuthSession(response.data, rememberMe);
        setSession(readStoredSession());
        setPopup(createPopup("success", "Signed in", "Signed in successfully. Redirecting..."));
        setTimeout(() => navigate("/"), 450);
        return;
      }

      setPopup(createPopup("error", "Sign-in issue", "Unexpected login response. Please try again."));
    } catch (error) {
      setPopup(getLoginPopupFromError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    if (!data?.token) {
      setPopup(createPopup("error", "Google sign-in", "Google login failed: missing token."));
      return;
    }

    storeAuthSession(data, rememberMe);
    setSession(readStoredSession());
    setPopup(createPopup("success", "Signed in", "Signed in with Google. Redirecting..."));
    setTimeout(() => navigate("/"), 450);
  };

  const handleGoogleError = (message) => {
    setPopup(createPopup("error", "Google sign-in", message || "Google sign-in failed."));
  };

  if (session.token) {
    const activeName = session.user?.username || session.user?.name || session.user?.email || "User";

    return (
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.shape}></div>
          <div className={styles.shape}></div>
        </div>
        <PopupMessage popup={popup} onClose={() => setPopup(EMPTY_POPUP)} />

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>You are signed in</h1>
            <p className={styles.subtitle}>Logged in as {activeName}</p>
          </div>

          <div className={styles.sessionPanel}>
            <p className={styles.signedInHint}>Continue learning or sign out from this account.</p>
            <div className={styles.sessionActions}>
              <button type="button" className={styles.button} onClick={() => navigate("/")}>
                Go to Home
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  clearStoredSession();
                  setSession(readStoredSession());
                  setPopup(EMPTY_POPUP);
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>
      <PopupMessage popup={popup} onClose={() => setPopup(EMPTY_POPUP)} />

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue your learning streak.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                autoComplete="email"
                required
              />
              <div className={styles.inputHighlight}></div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                autoComplete="current-password"
                required
              />
              <div className={styles.inputHighlight}></div>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className={styles.forgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className={`${styles.button} ${isLoading ? styles.loading : ""}`}
            disabled={isLoading}
          >
            <span className={styles.buttonText}>
              {isLoading ? "Signing in..." : "Sign in"}
            </span>
            <div className={styles.buttonHighlight}></div>
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don&apos;t have an account?
            <Link to="/Registration" className={styles.link}> Create one now</Link>
          </p>
        </div>

        <div className={styles.socialLogin}>
          <p className={styles.socialText}>Or continue with</p>
          <div className={styles.socialButtons}>
            <GoogleOauth
              onAuthSuccess={handleGoogleSuccess}
              onAuthError={handleGoogleError}
            />

            <button
              type="button"
              className={`${styles.socialButton} ${styles.github} ${styles.socialDisabled}`}
              disabled
              title="GitHub sign-in is coming soon"
            >
              <svg viewBox="0 0 25 24">
                <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.26-1.21-1.6-1.21-1.6-.98-.67.08-.66.08-.66 1.09.08 1.67 1.12 1.67 1.12.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.69-1.45-2.42-.27-4.96-1.21-4.96-5.4 0-1.19.42-2.17 1.12-2.93-.11-.28-.49-1.38.11-2.87 0 0 .92-.29 3 1.12.87-.24 1.8-.36 2.73-.37.93 0 1.86.13 2.73.37 2.08-1.41 3-.12 3-.12.6 1.49.22 2.59.11 2.87.7.76 1.12 1.74 1.12 2.93 0 4.2-2.55 5.13-4.98 5.4.39.34.74 1.01.74 2.03v3.01c0 .29.19.63.74.53A11 11 0 0012 1.27" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
