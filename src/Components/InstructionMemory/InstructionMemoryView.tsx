import { memo, useState } from "react";
import type { Instruction, InstructionMemory } from "../../Core/SmallCPU";
import { InstructionLine } from "../InstructionLine/InstructionLine";

import styles from "./InstructionMemoryView.module.css"


interface InstructionMemoryProps {
    instructionMemory: InstructionMemory,
    handleInstructionMemoryUpdate : (updatedInstruction : Instruction) => void,
}

export const InstructionMemoryView = memo( 
  function InstructionMemory( {
      instructionMemory, 
      handleInstructionMemoryUpdate
    } : InstructionMemoryProps ) {

    const [instructions, setInstructions] = useState<InstructionMemory>(instructionMemory);

    function handleInstructionUpdate(updatedInstruction : Instruction) {
      handleInstructionMemoryUpdate(updatedInstruction)
    }

    return (
      <div className = {styles.panel}>
        <div className={styles.header}>
            ...
        </div>
        <div className={styles.body}>
          {instructions.map((instruction) => (
            <InstructionLine
              key={instruction.address}
              instruction={instruction}
              handleInstructionUpdate={handleInstructionUpdate}
            />
          ))}
        </div>
      </div>
    );
});