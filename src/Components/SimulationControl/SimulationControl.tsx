import { memo } from "react";

import styles from "./SimulationControl.module.css"

interface SimulationControlProps {
    handleStepBtn : () => void,
    handleResetBtn : () => void,
    handleRunBtn : () => void,
    handleClearMemoriesBtn : () => void,
}

export const SimulationControl = memo (
    function SimulationPanel( {
        handleStepBtn,
        handleResetBtn,
        handleRunBtn,
        handleClearMemoriesBtn
    } : SimulationControlProps) {
        return (
            <div className={styles.container}>
                <div className={styles.sim_container}>
                    <h2>Simulation</h2>
                    <div className={styles.btns_container}>
                        <button
                            className={styles.button_4}
                            onClick={handleStepBtn}
                        >
                            Step
                        </button>
                        <button
                            className={styles.button_4}
                            onClick={handleClearMemoriesBtn}
                        >
                            Clear Memories
                        </button>
                        <button
                            className={styles.button_4}
                            onClick={handleRunBtn}
                        >
                            Run
                        </button>
                        <button
                            className={styles.button_4}
                        >
                            Save Memories
                        </button>
                        <button
                            className={styles.button_4}
                            onClick={handleResetBtn}
                        >
                            Reset
                        </button>
                        <button
                            className={styles.button_4}
                        >
                            Select File
                        </button>
                    </div>
                </div>
            </div>
        )

    }
)