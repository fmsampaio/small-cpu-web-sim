import { memo } from "react";

import styles from "./SimulationControl.module.css"

interface SimulationControlProps {
    handleStepBtn : () => void
}

export const SimulationControl = memo (
    function SimulationPanel( {
        handleStepBtn      
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
                        >
                            Clear Memories
                        </button>
                        <button
                            className={styles.button_4}
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