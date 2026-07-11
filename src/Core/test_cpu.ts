import {UnsignedData, SignedData, SmallCPU, isValidAssembly} from "./SmallCPU.ts"

function mainTest() {
    // testAssemblyParsing();
    // testDataFormats();
    program1();
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

function program1() {
    const cpu = new SmallCPU();

    cpu.updateAssembly(0, "LDR RA 0");
    cpu.updateAssembly(1, "ADD RA 1");
    cpu.updateAssembly(2, "STR RA 2");
    cpu.updateAssembly(3, "HLT");

    cpu.updateData(0, 10);
    cpu.updateData(1, 20);

    cpu.step();
    cpu.step();
    cpu.step();
    cpu.step();

    // console.log(cpu.instructionMemory);
    // console.log(cpu.dataMemory);    
}

mainTest()