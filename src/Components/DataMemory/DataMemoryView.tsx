import { memo, useState } from "react";
import type { Data, DataMemory } from "../../Core/SmallCPU";
import styles from "./DataMemoryView.module.css"
import { DataLine } from "../DataLine/DataLine";

interface DataMemoryViewProps {
    dataMemory : DataMemory,
    handleDataMemoryUpdate : (updatedData : Data) => void,
};

export const DataMemoryView = memo (
    function DataMemoryView( {
        dataMemory,
        handleDataMemoryUpdate
    } : DataMemoryViewProps ) {

        const [dataMemState, setDataMemState] = useState<DataMemory>(dataMemory);

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
                {dataMemory.map((data) => (
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