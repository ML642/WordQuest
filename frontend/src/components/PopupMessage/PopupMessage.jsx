import { useEffect } from "react";
import styles from "./PopupMessage.module.css";

const PopupMessage = ({ popup, onClose, autoHideMs = 5000 }) => {
  useEffect(() => {
    if (!popup?.open || !autoHideMs) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose?.();
    }, autoHideMs);

    return () => clearTimeout(timer);
  }, [popup?.open, autoHideMs, onClose]);

  if (!popup?.open) {
    return null;
  }

  const typeClass = popup.type === "success" ? styles.success : styles.error;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={`${styles.popup} ${typeClass}`}
        role="alertdialog"
        aria-live="assertive"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{popup.title || "Notice"}</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close popup"
          >
            x
          </button>
        </div>
        <p className={styles.message}>{popup.message}</p>
      </div>
    </div>
  );
};

export default PopupMessage;
