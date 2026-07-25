import { memo, useEffect, useState } from "react";
import { SignedData, type Data } from "../../Core/SmallCPU";
import styles from "./DataLine.module.css"

interface DataLineProps {
    data: Data,
    handleDataUpdate: (updatedData : Data) => void,
    isHighlighted: boolean
}

export const DataLine = memo (
    function DataLine( {
        data, 
        handleDataUpdate,
        isHighlighted
    } : DataLineProps) {

        const [dataInput, setDataInput] = useState(data.data.content.toString());

        useEffect( () => {
            setDataInput(data.data.content.toString())
        }, [data])

        function handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
            var newDataNumber = Number(event.target.value);
            var newData = {
                address : data.address,
                data : new SignedData(newDataNumber, 8)
            } as Data;
            console.log(newData);
            handleDataUpdate(newData);
            setDataInput(newData.data.content.toString());
        }

        function handleOnChange(event: React.FocusEvent<HTMLInputElement>): void {
            setDataInput(event.target.value);
        }

        function handleOnFocus(event: React.FocusEvent<HTMLInputElement>): void {
            event.target.select();
        }

        return (
            <div className={`${isHighlighted ? styles.row_highlighted : styles.row}`}>
                <span>{data.address}</span>
                <input className={styles.dataInput}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    value={dataInput}

                />
            </div>
        )
    }
);