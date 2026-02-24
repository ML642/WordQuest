import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import styles from "./Login.module.css";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function CustomGoogleButton({ onAuthSuccess, onAuthError }) {
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code })
        });

        const data = await response.json();
        if (!response.ok || !data?.token) {
          throw new Error(data?.error || "Google sign-in failed");
        }

        onAuthSuccess?.(data);
      } catch (error) {
        onAuthError?.(error.message || "Google sign-in failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      onAuthError?.("Google sign-in was cancelled or failed.");
    }
  });

  return (
    <button
      type="button"
      className={`${styles.socialButton} ${styles.google}`}
      onClick={() => login()}
      disabled={isLoading}
      aria-busy={isLoading}
      title={isLoading ? "Signing in with Google..." : "Sign in with Google"}
    >
      <svg viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    </button>
  );
}

export default function GoogleOauth({ onAuthSuccess, onAuthError }) {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        className={`${styles.socialButton} ${styles.google} ${styles.socialDisabled}`}
        disabled
        title="Google sign-in is not configured"
      >
        <svg viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CustomGoogleButton onAuthSuccess={onAuthSuccess} onAuthError={onAuthError} />
    </GoogleOAuthProvider>
  );
}
