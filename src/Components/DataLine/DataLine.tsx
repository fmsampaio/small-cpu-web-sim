import { memo, useState } from "react";
import { SignedData, type Data } from "../../Core/SmallCPU";
import styles from "./DataLine.module.css"

interface DataLineProps {
    data: Data,
    handleDataUpdate: (updatedData : Data) => void
}

export const DataLine = memo (
    function DataLine( {
        data, 
        handleDataUpdate
    } : DataLineProps) {

        const [invalid, setInvalid] = useState(false);
        const [dataInput, setDataInput] = useState("");

        function handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
            var newDataNumber = Number(event.target.value);
            var newData = {
                address : data.address,
                data : new SignedData(newDataNumber, 8)
            } as Data;
            
            handleDataUpdate(newData);
        }

        function handleOnChange(event: React.FocusEvent<HTMLInputElement>): void {
            setDataInput(event.target.value);
        }

        return (
            <div className={styles.row}>
                <span>{data.address}</span>
                <input className={styles.dataInput}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    value={dataInput}

                />
            </div>
        )
    }
);