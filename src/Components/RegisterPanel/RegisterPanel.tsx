import { memo } from "react";
import type { StateSmallCPU } from "../../Core/SmallCPU";

import styles from "./RegisterPanel.module.css"
import { RegisterView } from "../RegisterView/RegisterView";

interface RegisterPanelProps {
    cpuState : StateSmallCPU,
    regToBeHighlighted : string
}

export const RegisterPanel = memo (
    function RegisterPanel({
        cpuState,
        regToBeHighlighted
    } : RegisterPanelProps) {
        return (
            <div className = {styles.container}>
                <div className = {styles.regs_container}>
                    <h2>Registers</h2>
                    <div className = {styles.internal_regs_container}>
                        <div className = {styles.internal_regs_line}>
                            <RegisterView name="RA" data={cpuState.registerFile.RA} highlight={regToBeHighlighted == "RA"}/>
                            <RegisterView name="RB" data={cpuState.registerFile.RB} highlight={regToBeHighlighted == "RB"}/>
                            <RegisterView name="RC" data={cpuState.registerFile.RC} highlight={regToBeHighlighted == "RC"}/>
                            <RegisterView name="RX" data={cpuState.registerFile.RX} highlight={regToBeHighlighted == "RX"}/>
                        </div>
                        <div className = {styles.internal_regs_line}>
                            <RegisterView name="PC" data={cpuState.pc} highlight={false}/>
                            <RegisterView name="RI" data={cpuState.ri.hex} highlight={false}/>
                            <RegisterView name="RZ" data={cpuState.ccFile.Z} highlight={false}/>
                            <RegisterView name="RN" data={cpuState.ccFile.N} highlight={false}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
)