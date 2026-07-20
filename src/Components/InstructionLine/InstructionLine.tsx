import { memo, useState } from "react"
import { isValidAssembly, parseAssembly, type Instruction } from "../../Core/SmallCPU"
import styles from "./InstructionLine.module.css"

interface InstructionLineProps {
    instruction: Instruction,
    handleInstructionUpdate: (updatedInstruction : Instruction) => void
}

export const InstructionLine = memo (
    function InstructionLine( {
        instruction,
        handleInstructionUpdate
    } : InstructionLineProps) {

        const [invalid, setInvalid] = useState(false);

        function handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
            var assemblyInput = event.target.value;

            try {
                isValidAssembly(assemblyInput);
                var newInst = parseAssembly(instruction.address, assemblyInput) as Instruction;
                console.log(newInst);
                handleInstructionUpdate(newInst);
                setInvalid(false);
                event.target.value = newInst.assembly;
            }
            catch(error) {
                if(assemblyInput != "") {
                    console.log("Instrução inválida!");
                    setInvalid(true);
                }
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
                    className={`${invalid ? styles.invalidAssemblyInput : styles.assemblyInput}`}
                    type="text"
                    onBlur={handleOnBlur}
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