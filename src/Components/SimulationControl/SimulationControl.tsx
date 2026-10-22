import { memo } from "react";

import styles from "./SimulationControl.module.css"
import MemFilePicker from "../MemFilePicker/MemFilePicker";

interface SimulationControlProps {
    handleStepBtn : () => void,
    handleResetBtn : () => void,
    handleRunBtn : () => void,
    handleClearMemoriesBtn : () => void,
    handleSaveMemoriesBtn: () => void,
    handleLoadMemoriesBtn: (content: string) => void | Promise<void>,
    handleOnErrorFilePicker: (message: string) => void
}

export const SimulationControl = memo (
    function SimulationPanel( {
        handleStepBtn,
        handleResetBtn,
        handleRunBtn,
        handleClearMemoriesBtn,
        handleSaveMemoriesBtn,
        handleLoadMemoriesBtn,
        handleOnErrorFilePicker
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
                            onClick={handleSaveMemoriesBtn}
                        >
                            Save Memories
                        </button>
                        <button
                            className={styles.button_4}
                            onClick={handleResetBtn}
                        >
                            Reset
                        </button>
                        <MemFilePicker
                            onLoad={handleLoadMemoriesBtn}
                            onError={message => {
                                handleOnErrorFilePicker(message);
                            }}
                        />
                    </div>
                </div>
            </div>
        )

    }
)