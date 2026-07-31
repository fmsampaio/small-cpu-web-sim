import { useEffect } from "react";
import styles from "./Alert.module.css";

export type AlertType = "success" | "error";

interface AlertProps {
    visible: boolean;
    message: string;
    type: AlertType;

    duration?: number;

    onClose: () => void;
}

export default function Alert({
    visible,
    message,
    type,
    duration = 2000,
    onClose
}: AlertProps) {

    useEffect(() => {

        if (!visible) return;

        const timer = setTimeout(onClose, duration);

        return () => clearTimeout(timer);

    }, [visible, duration, onClose]);

    if (!visible) {
        return null;
    }

    return (
        <div
            className={`${styles.alert} ${
                type === "success"
                    ? styles.success
                    : styles.error
            }`}
        >
            <span>{message}</span>

            <button
                className={styles.close}
                onClick={onClose}
            >
                ✕
            </button>
        </div>
    );
}