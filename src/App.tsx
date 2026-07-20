import { useEffect, useMemo, useState } from 'react'
import { InstructionMemoryView } from './Components/InstructionMemory/InstructionMemoryView'
import { type Data, type Instruction, type StateSmallCPU, SmallCPU } from './Core/SmallCPU'
import { DataMemoryView } from './Components/DataMemory/DataMemoryView';

import styles from "./App.module.css"

function App() {
  const cpu = useMemo(
    () => new SmallCPU(),
    []
  );
  
  const [cpuState, setCpuState] = useState<StateSmallCPU>(cpu.exportState())
  
  useEffect( () => {
    console.log(cpuState.dataMemory);
  }, [cpuState])

  function handleInstructionMemoryUpdate(instruction : Instruction) {
    cpu.updateInstruction(instruction);
    setCpuState(cpu.exportState());
  }

  function handleInvalidInstructionMemoryUpdate(address : number) {
    cpu.updateInvalidInstruction(address);
    setCpuState(cpu.exportState());
  }

  function handleMemoryUpdate(data : Data) {
    cpu.updateData(data);
    setCpuState(cpu.exportState());
  }

  return (
    <main className={styles.main_container}>
      <InstructionMemoryView 
        instructionMemory={cpuState.instructionMemory}
        handleInstructionMemoryUpdate={handleInstructionMemoryUpdate}
        handleInvalidInstructionMemoryUpdate={handleInvalidInstructionMemoryUpdate}
      />
      <DataMemoryView
        dataMemory={cpuState.dataMemory}
        handleDataMemoryUpdate={handleMemoryUpdate}
      />
    </main>
  )
}

export default App
