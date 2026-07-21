import { memo } from "react";
import type { StateSmallCPU } from "../../Core/SmallCPU";

import styles from "./RegisterPanel.module.css"
import { RegisterView } from "../RegisterView/RegisterView";

interface RegisterPanelProps {
    cpuState : StateSmallCPU
}

export const RegisterPanel = memo (
    function RegisterPanel({
        cpuState
    } : RegisterPanelProps) {
        return (
            <div className = {styles.container}>
                <div className = {styles.regs_container}>
                    <h2>Registers</h2>
                    <div className = {styles.internal_regs_container}>
                        <div className = {styles.internal_regs_line}>
                            <RegisterView name="RA" data={cpuState.registerFile.RA} highlight={false}/>
                            <RegisterView name="RB" data={cpuState.registerFile.RB} highlight={false}/>
                            <RegisterView name="RC" data={cpuState.registerFile.RC} highlight={false}/>
                            <RegisterView name="RX" data={cpuState.registerFile.RX} highlight={false}/>
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