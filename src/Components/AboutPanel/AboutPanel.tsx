import styles from "./AboutPanel.module.css";

export default function AboutPanel() {
    return (
        <footer className={styles.aboutPanel}>
            <div className={styles.title}>
                SmallCPU Simulator
            </div>

            <p className={styles.description}>
                A free web-based simulation environment
                for learning and experimenting with the
                SmallCPU teaching-purpose processor architecture.
            </p>

            <div className={styles.links}>
                <span>Developed by Felipe Sampaio</span>

                <a
                    href="https://github.com/fmsampaio/small-cpu-web-sim"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub ↗
                </a>
            </div>
            
        </footer>
    );
}