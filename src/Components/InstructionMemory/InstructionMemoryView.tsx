import { memo } from "react";
import type { Instruction, InstructionMemory, StateSmallCPU } from "../../Core/SmallCPU";
import { InstructionLine } from "../InstructionLine/InstructionLine";

import styles from "./InstructionMemoryView.module.css"


interface InstructionMemoryViewProps {
    cpuState : StateSmallCPU,
    handleInstructionMemoryUpdate : (updatedInstruction : Instruction) => void,
    handleInvalidInstructionMemoryUpdate : (address : number) => void,
}

export const InstructionMemoryView = memo( 
  function InstructionMemoryView( {
      cpuState,
      handleInstructionMemoryUpdate,
      handleInvalidInstructionMemoryUpdate
    } : InstructionMemoryViewProps ) {

    function handleInstructionUpdate(validation : string, address : number, updatedInstruction? : Instruction) : void {
      if(validation === "INVALID_PATTERN") {
        console.log("Instrução inválida!")
        handleInvalidInstructionMemoryUpdate(address);
      }
      if(updatedInstruction !== undefined) {
        handleInstructionMemoryUpdate(updatedInstruction);
      }
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