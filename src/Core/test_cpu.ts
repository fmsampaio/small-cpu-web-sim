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
        "LDR RA #0",
        "LDR RX #0",
        "LDR RB #5",

        "JC Z 8",
        "ADD RA 2,RX",
        "ADD RX #1",
        // "SUB RB #1",
        "JMP 3",
        "STR RA 0",
        "HLT"
    ]

    for (let address = 0; address < asmCode.length; address++) {
        cpu.updateAssembly(address, asmCode[address]);        
    }

    cpu.updateDataNumber(2, 1);
    cpu.updateDataNumber(3, 2);
    cpu.updateDataNumber(4, 3);
    cpu.updateDataNumber(5, 4);
    cpu.updateDataNumber(6, 5);

    cpu.run();

    cpu.logSummary(8);
    console.log(cpu.isTimeoutReached);

}

mainTest()