import { useEffect, useMemo, useState } from 'react'
import { InstructionMemoryView } from './Components/InstructionMemory/InstructionMemoryView'
import { type Data, type Instruction, type StateSmallCPU, SmallCPU } from './Core/SmallCPU'
import { DataMemoryView } from './Components/DataMemory/DataMemoryView';

import styles from "./App.module.css"
import { RegisterPanel } from './Components/RegisterPanel/RegisterPanel';
import { SimulationControl } from './Components/SimulationControl/SimulationControl';

function App() {
  const cpu = useMemo(
    () => new SmallCPU(),
    []
  );
  
  const [cpuState, setCpuState] = useState<StateSmallCPU>(cpu.exportState())
  
  // useEffect( () => {
  //   console.log(cpuState.dataMemory);
  // }, [cpuState])

  function handleInstructionMemoryUpdate(instruction : Instruction) {
    cpu.updateInstruction(instruction);
    setCpuState(cpu.exportState());
  }

  function handleInvalidInstructionMemoryUpdate(address : number) {
    cpu.updateInvalidInstruction(address);
    setCpuState(cpu.exportState());
  }

  function handleMemoryUpdate(data : Data) {
    // cpu.updateData(data);
    cpu.storeDataInMemory(data.address, data.data.content)
    setCpuState(cpu.exportState());
  }

  function handleStepBtn() {
    cpu.step();
    setCpuState(cpu.exportState());
  }

  function handleRunBtn() {
    cpu.run();
    setCpuState(cpu.exportState());
  }

  function handleResetBtn() {
    cpu.resetRegisters();
    setCpuState(cpu.exportState());
  }

  function handleClearMemoriesBtn() {
    cpu.resetRegisters();
    cpu.resetMemories();
    setCpuState(cpu.exportState());
  }


  return (
    <main className={styles.main_container}>
      <InstructionMemoryView 
        pc={cpuState.pc}
        cpuState={cpuState}
        handleInstructionMemoryUpdate={handleInstructionMemoryUpdate}
        handleInvalidInstructionMemoryUpdate={handleInvalidInstructionMemoryUpdate}
      />
      <DataMemoryView
        cpuState={cpuState}
        handleDataMemoryUpdate={handleMemoryUpdate}
      />
      <div className={styles.side_container}>
        <RegisterPanel
          cpuState={cpuState} 
        />
        <SimulationControl
          handleStepBtn={handleStepBtn}
          handleResetBtn={handleResetBtn}
          handleRunBtn={handleRunBtn}
          handleClearMemoriesBtn={handleClearMemoriesBtn}
        />
      </div>
    </main>
  )
}

export default App
