import { memo, useEffect, useState } from "react"
import { parseAssembly, type Instruction } from "../../Core/SmallCPU"
import styles from "./InstructionLine.module.css"

interface InstructionLineProps {
    pcIsHere: boolean,
    instruction: Instruction,
    handleInstructionUpdate: (updatedInstruction: Instruction) => void
}

export const InstructionLine = memo (
    function InstructionLine( {
        pcIsHere,
        instruction,
        handleInstructionUpdate
    } : InstructionLineProps) {

        const [assemblyDataInput, setAssemblyDataInput] = useState(instruction.assembly);

        useEffect( () => {
            setAssemblyDataInput(instruction.assembly);
        }, [instruction]);

        function handleOnChange(event: React.FocusEvent<HTMLInputElement>): void {
            setAssemblyDataInput(event.target.value);
        }

        function handleOnFocus(event: React.FocusEvent<HTMLInputElement>): void {
            event.target.select();
        }

        function handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
            var assemblyInput = event.target.value;
            var newInst = parseAssembly(instruction.address, assemblyInput) as Instruction;
            console.log(newInst);
            setAssemblyDataInput(newInst.assembly);
            handleInstructionUpdate(newInst);           
        }

        return ( 
            <div className={styles.row}>
                { pcIsHere ?
                    <span className={`${styles.tag} ${styles.pcIsHere}`}>
                        PC
                    </span> 
                    :
                    <span></span>
                }

                <span className={styles.address}>
                    {instruction.address}
                </span>

                <input
                    data-memory-address={instruction.address}
                    className={`${styles.assemblyInput} ${(instruction.isValid || instruction.assembly === "") ? styles.validInput : styles.invalidInput}`}
                    type="text"
                    value={assemblyDataInput}
                    onBlur={handleOnBlur}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                />

                <span className={`${styles.machineCode} ${(instruction.isValid || instruction.assembly !== "") ? styles.visible : ""}`}>
                    {(instruction.isValid || instruction.assembly !== "") && instruction.hex}
                </span>

                { instruction.fields.mode === "DIR" ?
                    <span className={`${styles.tag} ${styles.dirMode}`}>
                        DIR
                    </span> 
                    :
                  instruction.fields.mode === "IMM" ?
                    <span className={`${styles.tag} ${styles.immMode}`}>
                        IMM
                    </span> 
                    :
                  instruction.fields.mode === "IDX" ?
                    <span className={`${styles.tag} ${styles.idxMode}`}>
                        IDX
                    </span> 
                    :
                    <span></span>
                }

                
            </div>
        )
    }
);