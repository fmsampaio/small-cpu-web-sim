import { memo } from "react"
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

        function handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
            var assemblyInput = event.target.value;

            if(isValidAssembly(assemblyInput)) {
                var newInst = parseAssembly(instruction.address, assemblyInput) as Instruction;
                console.log(newInst);
                handleInstructionUpdate(newInst);
            }
            else {
                console.log("Invalid instruction!");
            }
        }

        return ( 
            <div className={styles.row}>
                <span className={styles.address}>
                    {instruction.address}
                </span>

                <input
                    data-memory-address={instruction.address}
                    className={styles.assemblyInput}
                    type="text"
                    onBlur={handleOnBlur}
                />

                <output className={styles.machineCode}>
                    {instruction.hex}
                </output>
            </div>
        )
    }
);