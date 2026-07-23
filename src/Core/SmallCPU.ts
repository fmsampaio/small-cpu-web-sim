
export type Mnemonic = "LDR" | "STR" | "ADD" | "SUB" | "JMP" | "JC" | "HLT" | "NULL";
export type RegisterName = "RA" | "RB" | "RC" | "RX";
export type ConditionCodeName = "Z" | "N";
export type AddressMode = "DIR" | "IMM" | "IDX";

export abstract class BaseData {
  content: number;
  bitWidth: number;
  minValue: number;
  maxValue: number;

  constructor(content: number, bitWidth: number) {
    this.bitWidth = bitWidth;

    // subclasses definem os limites
    this.minValue = this.computeMinValue();
    this.maxValue = this.computeMaxValue();

    if(content < this.minValue) {
      this.content = this.minValue;
    }
    else if(content > this.maxValue) {
      this.content = this.maxValue;
    }
    else {
      this.content = content;
    }
  }

  // métodos que cada classe filha deve implementar
  protected abstract computeMinValue(): number;
  protected abstract computeMaxValue(): number;

  // assign(value: number) {
  //   if(value > this.maxValue) {
  //     const diff = value - this.maxValue;
  //     this.content = this.minValue + diff;
  //   }
  //   else if(value < this.minValue) {
  //     const diff = this.maxValue - value;
  //     this.content = this.maxValue - diff;
  //   }
  //   else {
  //     this.content = value;
  //   }
  // }


  add(value: number) {
    const partialSum = this.content + value;

    if (partialSum > this.maxValue) {
      const diff = partialSum - this.maxValue;
      this.content = this.minValue + diff;
    } else {
      this.content = partialSum;
    }
  }

  sub(value: number) {
    const partialSub = this.content - value;

    if (partialSub < this.minValue) {
      const diff = this.maxValue - partialSub;
      this.content = this.maxValue - diff;
    } else {
      this.content = partialSub;
    }
  }

  getContentHex() {
    return this.content.toString(16);
  }
}

export class UnsignedData extends BaseData {
  protected computeMinValue(): number {
    return 0;
  }

  protected computeMaxValue(): number {
    return Math.pow(2, this.bitWidth) - 1;
  }

  withValue(value: number): UnsignedData {
    return new UnsignedData(value, this.bitWidth);
  }
}

export class SignedData extends BaseData {
  protected computeMinValue(): number {
    return -Math.pow(2, this.bitWidth - 1);
  }

  protected computeMaxValue(): number {
    return Math.pow(2, this.bitWidth - 1) - 1;
  }


  withValue(value: number): SignedData {
    return new SignedData(value, this.bitWidth);
  }
}

export interface InstructionFields {
  inst: Mnemonic;
  reg?: RegisterName;
  cc?: ConditionCodeName;
  mem?: number;
  mode?: AddressMode;
}

export interface Instruction {
  pcIsHere?: boolean;
  address: number;
  assembly: string;
  bin: string;
  dec: number;
  hex: string;
  fields: InstructionFields;
}

export interface Data {
  address: number;
  data: SignedData;
}

export type InstructionMemory = Instruction[];
export type DataMemory = Data[];

const TIMEOUT_EXPIRATION = 1000;

const INSTRUCTION_VALIDATION: Record<string, RegExp> = {
  ALL_MODES_REG_PATTERN : /^(LDR|ADD|SUB)\s+(RA|RB|RC|RX)\s+(#?-?\d+)(?:,(RX))?$/i,
  STR_PATTERN : /^(STR)\s+(RA|RB|RC|RX)\s+(\d+)(?:,(RX))?$/i,
  JMP_PATTERN : /^(JMP)\s+(\d+)$/i,
  JC_PATTERN : /^(JC)\s+(Z|N)\s+(\d+)$/i,
  HLT_PATTERN : /^HLT$/i
}

const INST_TO_OPCODE: Record<Mnemonic, string> = {
  LDR : "001",
  STR : "010",
  ADD : "011",
  SUB : "100",
  JMP : "101",
  JC  : "110",
  HLT : "111",
  NULL : "XXX"
}

const REG_TO_BIN: Record<RegisterName, string> = {
  RA : "00",
  RB : "01",
  RC : "10",
  RX : "11"
}

const CC_TO_BIN: Record<ConditionCodeName, string> = {
  Z : "0",
  N : "1"
}

const MODE_TO_BIN: Record<AddressMode, string> = {
  DIR : "00",
  IMM : "01",
  IDX : "10"
}

interface InstructionValidation {
  pattern: string,
  match?: RegExpMatchArray
}

const isValidAssembly = function(assembly: string): string {
  let returnable : InstructionValidation;
  returnable = {
    pattern: "INVALID_PATTERN"
  }
  for (const [key, regex] of Object.entries(INSTRUCTION_VALIDATION)) {
    const match = assembly.match(regex);
    if (match) {
      returnable = {
        pattern: key,
        match: match,
      };
    }
  }
  if(returnable.pattern != "INVALID_PATTERN" &&  returnable.pattern != "HLT_PATTERN") {
     if(! isValidMemValue(returnable)) {
        returnable = {
          pattern: "INVALID_PATTERN"
        }
     }
  }
  return returnable.pattern;
}


const isValidMemValue = function(validation: InstructionValidation): boolean {
  let memValue : number;
  if(validation.pattern === "ALL_MODES_REG_PATTERN" || validation.pattern === "STR_PATTERN" || validation.pattern === "JC_PATTERN") {
    let memStr = validation.match![3];
    if(memStr.includes("#")) {
      memStr = memStr.slice(1);
      memValue = Number(memStr);
      return (memValue >= -128 && memValue < 128);
    }
    memValue = Number(memStr);
  }
  else { // if(validation.pattern === "JMP_PATTERN")
    memValue = Number(validation.match![2]);
  }
  return (memValue >= 0 && memValue < 256);
}

const parseAssembly = function(address: number, assembly: string): Instruction {
  assembly = assembly.toUpperCase()

  let pattern = isValidAssembly(assembly);
  if(pattern === "INVALID_PATTERN") 
    throw new Error("Invalid instruction!");
  
  const match = assembly.match(INSTRUCTION_VALIDATION[pattern]);

  const inst = match![(pattern === "HLT_PATTERN") ? 0 : 1] as Mnemonic;
  const opcode = INST_TO_OPCODE[inst];

  if(pattern === "ALL_MODES_REG_PATTERN" || pattern === "STR_PATTERN") {
    const reg = match![2] as RegisterName;
    let memStr = match![3];
    let modeStr = "DIR" as AddressMode;

    if(memStr.includes("#")) {
      memStr = memStr.slice(1);
      modeStr = "IMM";
    }
    const memValue = Number(memStr);
    const hasIndexRX = !!match?.[4];
    if(hasIndexRX)
      modeStr = "IDX";

    const modeBin = MODE_TO_BIN[modeStr];
    const regBin = REG_TO_BIN[reg];
    const memBin = memValue.toString(2).padStart(8, "0");

    const bin = `${opcode}${regBin}0${modeBin}${memBin}`;
    const dec = parseInt(bin, 2);
    const hex = dec.toString(16).toUpperCase();

    return {
      pcIsHere: false,
      address: address,
      assembly: assembly,
      bin: bin,
      dec: dec,
      hex: hex,
      fields: {
        inst:   inst,
        reg:    reg,
        mem:    memValue,
        mode:   modeStr
      }
    }    
  }
  else if(pattern === "JC_PATTERN") {
    const ccStr = match![2];
    const memValue = Number(match![3]);

    const ccBin = CC_TO_BIN[ccStr];    
    const memBin = memValue.toString(2).padStart(8, "0");

    const bin = `${opcode}00${ccBin}00${memBin}`;
    const dec = parseInt(bin, 2);
    const hex = dec.toString(16).toUpperCase();

    return {
      pcIsHere: false,
      address: address,
      assembly: assembly,
      bin: bin,
      dec: dec,
      hex: hex,
      fields: {
        inst: inst,
        cc:   ccStr,
        mem:  memValue,
      }
    }    
  }
  else if(pattern === "JMP_PATTERN") {
    const memValue = Number(match![2]);
    const memBin = memValue.toString(2).padStart(8, "0");
    
    const bin = `${opcode}00000${memBin}`;
    const dec = parseInt(bin, 2);
    const hex = dec.toString(16).toUpperCase();
    return {
      pcIsHere: false,
      address: address,
      assembly: assembly,
      bin: bin,
      dec: dec,
      hex: hex,
      fields: {
        inst: inst,
        mem:  memValue,
      }
    }
  }
  else { // pattern === "HLT_PATTERN"
    const bin = `${opcode}0000000000000`;
    const dec = parseInt(bin, 2);
    const hex = dec.toString(16).toUpperCase();
    return {
      pcIsHere: false,
      address: address,
      assembly: assembly,
      bin: bin,
      dec: dec,
      hex: hex,
      fields: {
        inst: inst
      }
    }
  }
  
}

export interface StateSmallCPU {
  registerFile : {
    RA : number,
    RB : number,
    RC : number,
    RX : number
  },
  ccFile : {
    Z : boolean,
    N : boolean
  },
  dataMemory : Data[],
  instructionMemory : Instruction[],
  pc : number,
  ri : Instruction,
  isHltReached : boolean,
  isTimeoutReached : boolean 
}

export {isValidAssembly, parseAssembly};

export class SmallCPU {
  registerFile!: Record<RegisterName, SignedData>;
  ccFile!: Record<ConditionCodeName, boolean>;
  dataMemory!: DataMemory;
  instructionMemory!: InstructionMemory;
  pc!: UnsignedData;
  ri!: Instruction;
  isHltReached: boolean;
  isTimeoutReached: boolean;
  
  constructor() {
    this.isHltReached = false;
    this.isTimeoutReached = false;
    this.resetMemories();
    this.resetRegisters();
  }

  resetMemories() {
    this.instructionMemory = Array.from({ length: 256 }, (_, address) => ({
      pcIsHere: false,
      address,
      assembly: "",
      bin: "0000000000000000",
      dec: 0,
      hex: "0",
      fields: {
        inst: "NULL"
      }
    }));

    this.dataMemory = Array.from({ length: 256 }, (_, address) => ({
      address,
      data: new SignedData(0, 8)
    }));
  }

  resetRegisters() {
    this.registerFile = {
      RA: new SignedData(0, 8),
      RB: new SignedData(0, 8),
      RC: new SignedData(0, 8),
      RX: new SignedData(0, 8),
    };

    this.ccFile = {
      Z : false,
      N : false
    }

    this.pc = new UnsignedData(0, 8);
    this.ri = {
      pcIsHere: false,
      address: -1,
      assembly: "",
      bin: "",
      dec: 0,
      hex: "",
      fields: {
        inst: ""
      }
    }

    this.updatePcIsHere();
    this.isHltReached = false;
  }

  storeDataInMemory(address : number, content : number) {
    this.dataMemory = this.dataMemory.map(item => {
      if (item.address !== address) {
        return item;
      }
      return {
        ...item,
        data: new SignedData(content, item.data.bitWidth),
      };
    })
  }

  updatePcIsHere() {
    for (let i = 0; i < this.instructionMemory.length; i++) {
      this.instructionMemory[i].pcIsHere = (i === this.pc.content);
    }
  }

  updateInvalidInstruction(address : number): void {
    const invalidInstruction = {
      pcIsHere: this.pc.content === address,
      address : address,
      assembly: "",
      bin: "0000000000000000",
      dec: 0,
      hex: "0",
      fields: {
        inst: "NULL"
      } 
    } as Instruction;
    this.updateInstruction(invalidInstruction);
  }

  updateInstruction(instruction: Instruction): void {
    instruction.pcIsHere = this.pc.content === instruction.address;
    if(instruction.address >= 0 && instruction.address < 256) {
      this.instructionMemory[instruction.address] = instruction;
    }
    else {
      throw new Error(`Endereço inválido: ${instruction.address}`);
    }
  }

  updateAssembly(address: number, assembly: string): void {
    if(isValidAssembly(assembly) === "INVALID_PATTERN")
      throw new Error("Invalid instruction!");

    const instruction = parseAssembly(address, assembly);

    if(address >= 0 && address < 256) {
      this.instructionMemory[address] = instruction;
    }
    else {
      throw new Error(`Endereço inválido: ${address}`);
    }
  }

  updateDataNumber(address: number, data: number): void {
    const newData =  {
      address : address,
      data : new SignedData(data, 8)
    };
    this.updateData(newData);
  }

  updateData(data : Data): void {
    if(data.address >= 0 && data.address < 256) {
      this.dataMemory[data.address] = data;
    }
    else {
      throw new Error(`Endereço inválido: ${data.address}`);
    }
  }

  updateConditionCodes(value: number) {
    this.ccFile.Z = (value == 0);
    this.ccFile.N = (value < 0);
  }

  exportState() : StateSmallCPU {
    return {
      registerFile : {
        RA : this.registerFile.RA.content,
        RB : this.registerFile.RB.content,
        RC : this.registerFile.RC.content,
        RX : this.registerFile.RX.content
      },
      ccFile : {
        Z : this.ccFile.Z,
        N : this.ccFile.N
      },
      dataMemory : this.dataMemory,
      instructionMemory : this.instructionMemory,
      pc : this.pc.content,
      ri : this.ri,
      isHltReached : this.isHltReached,
      isTimeoutReached : this.isTimeoutReached 
    }
  }

  step() {
    if(this.isHltReached)
      return;

    this.ri = this.instructionMemory[this.pc.content];
    console.log(`[DBG] Executing instruction:`);
    console.log(this.ri);
    this.pc.add(1);

    if(this.ri.fields.inst === "LDR") {
      const targetReg = this.ri.fields.reg!;
      const addressMode = this.ri.fields.mode;
      const memField = this.ri.fields.mem!;

      const dataToBeLoaded =  (addressMode === "DIR") ? this.dataMemory[memField].data.content :
                              (addressMode === "IMM") ? memField :
                            /*(addressMode === "IDX")*/ this.dataMemory[memField + this.registerFile.RX.content].data.content;

      // this.registerFile[targetReg].assign(dataToBeLoaded);
      this.registerFile[targetReg] = this.registerFile[targetReg].withValue(dataToBeLoaded);

      this.updateConditionCodes(this.registerFile[targetReg].content);
    }
    else if(this.ri.fields.inst === "STR") {
      const targetReg = this.ri.fields.reg!;
      const addressMode = this.ri.fields.mode;
      const memField = this.ri.fields.mem!;

      const dataToBeStored = this.registerFile[targetReg].content;
      const addressToBeStored = (addressMode === "DIR") ? memField :
                              /*(addressMode === "IDX")*/ memField + this.registerFile.RX.content;
      
      // this.dataMemory[addressToBeStored].data.assign(dataToBeStored);
      // this.dataMemory[addressToBeStored].data = this.dataMemory[addressToBeStored].data.withValue(dataToBeStored);
      this.storeDataInMemory(addressToBeStored, dataToBeStored)
    }
    else if(this.ri.fields.inst === "ADD" || this.ri.fields.inst === "SUB") {
      const targetReg = this.ri.fields.reg!;
      const addressMode = this.ri.fields.mode;
      const memField = this.ri.fields.mem!;

      const operand =  (addressMode === "DIR") ? this.dataMemory[memField].data.content :
                              (addressMode === "IMM") ? memField :
                            /*(addressMode === "IDX")*/ this.dataMemory[memField + this.registerFile.RX.content].data.content;

      if(this.ri.fields.inst === "ADD") {
        this.registerFile[targetReg].add(operand);
      }
      else { //this.ri.fields.inst === "ADD"
        this.registerFile[targetReg].sub(operand);
      }

      this.updateConditionCodes(this.registerFile[targetReg].content)

    }
    else if(this.ri.fields.inst === "JMP") {
      const memField = this.ri.fields.mem!;
      // this.pc.assign(memField);
      this.pc = this.pc.withValue(memField);
    }
    else if(this.ri.fields.inst === "JC") {
      const ccField = this.ri.fields.cc!;
      const memField = this.ri.fields.mem!;

      if(this.ccFile[ccField]) {
        this.pc = this.pc.withValue(memField);
      }      
    }
    else if(this.ri.fields.inst === "HLT") {
      this.isHltReached = true;
    }
  }

  logSummary(numOfMemPositions: number) {
    console.log("Instruction Memory:")
    for (let address = 0; address < numOfMemPositions; address++) {
        console.log(`${address}: ${this.instructionMemory[address].assembly}`)
    }
    console.log("Data Memory:")
    for (let address = 0; address < numOfMemPositions; address++) {
        console.log(`${address}: ${this.dataMemory[address].data.content}`)
    }
    console.log("Registers:")
    console.log(`RA: ${this.registerFile.RA.content}`)
    console.log(`RB: ${this.registerFile.RB.content}`)
    console.log(`RC: ${this.registerFile.RC.content}`)
    console.log(`RX: ${this.registerFile.RX.content}`)
    console.log(`RZ: ${this.ccFile.Z}`)
    console.log(`RN: ${this.ccFile.N}`)
  }

  run() {
    let executedInstructions = 0;
    while(! this.isHltReached && ! this.isTimeoutReached) {
      
      this.step();

      executedInstructions += 1;
      if(executedInstructions >= TIMEOUT_EXPIRATION) {
        this.isTimeoutReached = true;
      }
    }
  }


}
