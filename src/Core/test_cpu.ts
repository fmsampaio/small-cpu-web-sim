import {UnsignedData, SignedData, SmallCPU, isValidAssembly, parseAssembly} from "./SmallCPU.ts"

function mainTest() {
    // testAssemblyParsing();
    // testDataFormats();
    testSmallCpuExecution();
}

function testDataFormats() {
    let s0 = new SignedData(100, 8);
    s0.add(150);
    console.log(s0);

    let u0 = new UnsignedData(100, 8);
    u0.add(200);
    console.log(u0);
}

function testAssemblyParsing() {
    console.log(isValidAssembly("LDR RA 256"));
    console.log(isValidAssembly("LDR RA #-25"));
    console.log(isValidAssembly("LDR RA -1,RX"));
    console.log(isValidAssembly("ADD RA 0"));
    console.log(isValidAssembly("ADD RA #0"));
    console.log(isValidAssembly("ADD RA 1,RX"));
    console.log(isValidAssembly("SUB RA 0"));
    console.log(isValidAssembly("SUB RA #0"));
    console.log(isValidAssembly("SUB RA 1,RX"));
    console.log(isValidAssembly("STR RA 0"));
    console.log(isValidAssembly("STR RA 1,RX"));
    console.log(isValidAssembly("JC N 0"));
    console.log(isValidAssembly("JC Z 10"));
    console.log(isValidAssembly("JMP 10"));
    console.log(isValidAssembly("HLT"));

    console.log(isValidAssembly("LDR RT 0"));
}

function testSmallCpuExecution() {
    const cpu = new SmallCPU();

    cpu.updateInstruction(0, parseAssembly(0, "LDR RA 0"));
    cpu.updateInstruction(1, parseAssembly(1, "STR RA 15"));
    cpu.updateInstruction(2, parseAssembly(2, "ADD RX #1"));
    cpu.updateInstruction(3, parseAssembly(3, "ADD RB 10,RX"));
    cpu.updateInstruction(4, parseAssembly(4, "JC N 15"));
    cpu.updateInstruction(5, parseAssembly(5, "JMP 100"));
    cpu.updateInstruction(6, parseAssembly(6, "HLT"));

    console.log(cpu.instructionMemory)
}

mainTest()