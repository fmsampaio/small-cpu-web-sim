import styles from "./Led.module.css"

interface LedProps {
  on: boolean;
}

export function Led({ on }: LedProps) {
  return (
    <span
      className={`${styles.led} ${
        on ? styles.ledTrue : styles.ledFalse
      }`}
    />
  );
}