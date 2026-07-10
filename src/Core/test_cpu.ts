import {SmallCPU, parseAssembly} from "./SmallCPU.ts"

const cpu = new SmallCPU();

cpu.updateInstruction(
    0,
    {
        pcIsHere: true,
        address: 0,
        assembly: "LD RA 0",
        bin: "",
        dec: 0,
        hex: "",
        fields: { 
            opcode: "001", 
            reg: "RA", 
            mem: 10,
            mode: "DIR" 
        }
    }
)

cpu.updateInstruction(
    1,
    {
        pcIsHere: false,
        address: 1,
        assembly: "STR RA 1",
        bin: "",
        dec: 0,
        hex: "",
        fields: { 
            opcode: "010", 
            reg: "RA", 
            mem: 0,
            mode: "DIR" 
        }
    }
)

cpu.updateInstruction(
    2,
    {
        pcIsHere: false,
        address: 2,
        assembly: "HLT",
        bin: "",
        dec: 0,
        hex: "",
        fields: { 
            opcode: "111"
        }
    }
)

// console.log(cpu.instructionMemory)
parseAssembly("STR RA 0")
parseAssembly("STR RA #0")
parseAssembly("STR RA 1,RX")
parseAssembly("STR RR 1,RX")
parseAssembly("STR RA 1,RA")

