import { memo, useEffect } from "react";
import type { Data, StateSmallCPU } from "../../Core/SmallCPU";
import styles from "./DataMemoryView.module.css"
import { DataLine } from "../DataLine/DataLine";

interface DataMemoryViewProps {
    cpuState: StateSmallCPU,
    handleDataMemoryUpdate : (updatedData : Data) => void,
};

export const DataMemoryView = memo (
    function DataMemoryView( {
        cpuState,
        handleDataMemoryUpdate
    } : DataMemoryViewProps ) {

        function handleDataUpdate(updatedData : Data) : void {
            handleDataMemoryUpdate(updatedData);
        }

        return (
            <div className = {styles.panel}>
                <h2>Data Memory</h2>
                <div className={styles.header}>
                    <span>Add.</span>
                    <span>Data</span>
                </div>
                <div className={styles.body}>
                {cpuState.dataMemory.map((data) => (
                    <DataLine
                        key={data.address}
                        data={data}
                        handleDataUpdate={handleDataUpdate}
                    />
                ))}
                </div>
            </div>
        );
    }
)