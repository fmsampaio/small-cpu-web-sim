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

    const asmCode = [
        "LDR RA 0",
        "SUB RA 1",
        "STR RA 2",
        "HLT"
    ]

    for (let address = 0; address < asmCode.length; address++) {
        cpu.updateAssembly(address, asmCode[address]);        
    }

    cpu.updateData(0, 10);
    cpu.updateData(1, 20);

    for (let address = 0; address < asmCode.length; address++) {
        cpu.step();
        cpu.logSummary(6);
    }

}

mainTest()