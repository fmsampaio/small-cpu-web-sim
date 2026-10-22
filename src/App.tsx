import { useMemo, useState } from 'react'
import { InstructionMemoryView } from './Components/InstructionMemory/InstructionMemoryView'
import { type Data, type Instruction, type StateSmallCPU, SmallCPU } from './Core/SmallCPU'
import { DataMemoryView } from './Components/DataMemory/DataMemoryView';

import styles from "./App.module.css"
import { RegisterPanel } from './Components/RegisterPanel/RegisterPanel';
import { SimulationControl } from './Components/SimulationControl/SimulationControl';
import Alert from './Components/Alert/Alert';

function App() {
  const cpu = useMemo(
    () => new SmallCPU(),
    []
  );
  
  const [cpuState, setCpuState] = useState<StateSmallCPU>(cpu.exportState());
  const [regToHighlight, setRegToHighlight] = useState("None");
  const [dataToHighlight, setDataToHighlight] = useState(-1);
  const [instToHighlight, setInstToHighlight] = useState(-1);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");


  
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
    updateAlert();
  }

  function handleRunBtn() {
    cpu.run();
    setCpuState(cpu.exportState());
    updateHighlights();
    updateAlert();
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
    setInstToHighlight(cpu.getInstToHighlight());
  }

  function updateAlert() {
    if(cpu.isHltReached) {
      setAlertMessage("HLT is reached!");
      setAlertType("success");
      setAlertVisible(true);
    }
    if(cpu.isTimeoutReached) {
      setAlertMessage("Timeout!");
      setAlertType("error");
      setAlertVisible(true);
    }
    if(cpu.isInvalidInstruction) {
      setAlertMessage("Invalid instruction to be executed!");
      setAlertType("error");
      setAlertVisible(true);
    }
  }

  function handleSaveMemoriesBtn() {
      const lines: string[] = [];

      // Memória de instruções
      cpuState.instructionMemory.forEach(instruction => {
          lines.push(
              `${instruction.address}:${instruction.assembly}`
          );
      });

      // Memória de dados
      cpuState.dataMemory.forEach(data => {
          lines.push(
              `${data.address}:${data.data.content}`
          );
      });

      const fileContent = lines.join("\n") + "\n";

      const blob = new Blob(
          [fileContent],
          { type: "text/plain;charset=utf-8" }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "mem_content.mem";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.main_container}>
      <InstructionMemoryView 
        cpuState={cpuState}
        handleInstructionMemoryUpdate={handleInstructionMemoryUpdate}
        highlight={instToHighlight}
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
          handleSaveMemoriesBtn={handleSaveMemoriesBtn}
        />
        <Alert
          visible={alertVisible}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertVisible(false)}
        />
      </div>

    </main>
  )
}

export default App
