import { memo, useState } from "react";
import type { Instruction, InstructionMemory } from "../../Core/SmallCPU";
import { InstructionLine } from "../InstructionLine/InstructionLine";

import styles from "./InstructionMemoryView.module.css"


interface InstructionMemoryViewProps {
    instructionMemory: InstructionMemory,
    handleInstructionMemoryUpdate : (updatedInstruction : Instruction) => void,
    handleInvalidInstructionMemoryUpdate : (address : number) => void,
}

export const InstructionMemoryView = memo( 
  function InstructionMemoryView( {
      instructionMemory, 
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
            <span>ADD.</span>
            <span>ASSEMBLY</span>
            <span>HEX</span>
            <span>MODE</span>
        </div>
        <div className={styles.body}>
          {instructionMemory.map((instruction) => (
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