import { memo, useState } from "react"
import { isValidAssembly, parseAssembly, type Instruction } from "../../Core/SmallCPU"
import styles from "./InstructionLine.module.css"

interface InstructionLineProps {
    instruction: Instruction,
    handleInstructionUpdate: (validation: string, address : number, updatedInstruction?: Instruction) => void
}

export const InstructionLine = memo (
    function InstructionLine( {
        instruction,
        handleInstructionUpdate
    } : InstructionLineProps) {

        const [invalid, setInvalid] = useState(false);
        const [assemblyData, setAssemblyData] = useState("");

        function handleOnChange(event: React.FocusEvent<HTMLInputElement>): void {
            setAssemblyData(event.target.value);
        }

        function handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
            var assemblyInput = event.target.value;
            var validation = "";

            try {
                validation = isValidAssembly(assemblyInput);
                var newInst = parseAssembly(instruction.address, assemblyInput) as Instruction;
                console.log(newInst);
                handleInstructionUpdate(validation, instruction.address, newInst);
                setInvalid(false);
                setAssemblyData(newInst.assembly);
            }
            catch(error) {
                setInvalid(assemblyInput != "");
                handleInstructionUpdate(validation, instruction.address);
            }
        }

        return ( 
            <div className={styles.row}>
                { instruction.pcIsHere ?
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
                    className={`${styles.assemblyInput} ${invalid ? styles.invalidInput : styles.validInput}`}
                    type="text"
                    value={assemblyData}
                    onBlur={handleOnBlur}
                    onChange={handleOnChange}
                />

                <output className={styles.machineCode}>
                    {instruction.hex}
                </output>

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