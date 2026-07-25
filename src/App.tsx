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
  
  const [cpuState, setCpuState] = useState<StateSmallCPU>(cpu.exportState());
  const [regToHighlight, setRegToHighlight] = useState("None");
  const [dataToHighlight, setDataToHighlight] = useState(-1);
  
  // useEffect( () => {
  //   console.log(cpuState.dataMemory);
  // }, [cpuState])

  function handleInstructionMemoryUpdate(instruction : Instruction) {
    cpu.updateInstruction(instruction);
    setCpuState(cpu.exportState());
    updateHighlights();
  }

  function handleMemoryUpdate(data : Data) {
    // cpu.updateData(data);
    cpu.storeDataInMemory(data.address, data.data.content)
    setCpuState(cpu.exportState());
    updateHighlights();
  }

  function handleStepBtn() {
    cpu.step();
    setCpuState(cpu.exportState());
    updateHighlights();
  }

  function handleRunBtn() {
    cpu.run();
    setCpuState(cpu.exportState());
    updateHighlights();
  }

  function handleResetBtn() {
    cpu.resetRegisters();
    setCpuState(cpu.exportState());
    updateHighlights();
  }

  function handleClearMemoriesBtn() {
    cpu.resetRegisters();
    cpu.resetMemories();
    setCpuState(cpu.exportState());
  }

  function updateHighlights() {
    setRegToHighlight(cpu.getRegToBeHighlighted());
    setDataToHighlight(cpu.getDataToHighlight());
  }


  return (
    <main className={styles.main_container}>
      <InstructionMemoryView 
        cpuState={cpuState}
        handleInstructionMemoryUpdate={handleInstructionMemoryUpdate}
      />
      <DataMemoryView
        cpuState={cpuState}
        handleDataMemoryUpdate={handleMemoryUpdate}
        highlight={dataToHighlight}
      />
      <div className={styles.side_container}>
        <RegisterPanel
          cpuState={cpuState} 
          regToBeHighlighted={regToHighlight}
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
