import { memo } from "react";
import type { Instruction, StateSmallCPU } from "../../Core/SmallCPU";
import { InstructionLine } from "../InstructionLine/InstructionLine";

import styles from "./InstructionMemoryView.module.css"


interface InstructionMemoryViewProps {
    cpuState : StateSmallCPU,
    handleInstructionMemoryUpdate : (updatedInstruction : Instruction) => void,
}

export const InstructionMemoryView = memo( 
  function InstructionMemoryView( {
      cpuState,
      handleInstructionMemoryUpdate,
    } : InstructionMemoryViewProps ) {

    function handleInstructionUpdate( updatedInstruction : Instruction) : void {
      handleInstructionMemoryUpdate(updatedInstruction);
    }

    return (
      <div className = {styles.panel}>
        <h2>Instructions Memory</h2>
        <div className={styles.header}>
            <span>PC</span>
            <span>Add.</span>
            <span>Assembly</span>
            <span>HEX</span>
            <span>Mode</span>
        </div>
        <div className={styles.body}>
          {cpuState.instructionMemory.map((instruction) => (
            <InstructionLine
              pcIsHere={(cpuState.pc === instruction.address)}
              key={instruction.address}
              instruction={instruction}
              handleInstructionUpdate={handleInstructionUpdate}
            />
          ))}
        </div>
      </div>
    );
});