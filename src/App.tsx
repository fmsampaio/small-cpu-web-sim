import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { InstructionMemoryView } from './Components/InstructionMemory/InstructionMemoryView'
import { type Instruction, type StateSmallCPU, SmallCPU } from './Core/SmallCPU'

function App() {
  const cpu = useMemo(
    () => new SmallCPU(),
    []
  );
  
  const [cpuState, setCpuState] = useState<StateSmallCPU>(cpu.exportState())
  
  useEffect( () => {
    console.log(cpuState.instructionMemory)
  }, [cpuState])

  function handleInstructionMemoryUpdate(instruction : Instruction) {
    cpu.updateInstruction(instruction);
    setCpuState(cpu.exportState())
  }

  return (
    <>
      <InstructionMemoryView 
        instructionMemory={cpuState.instructionMemory}
        handleInstructionMemoryUpdate={handleInstructionMemoryUpdate}
      />
    </>
  )
}

export default App
