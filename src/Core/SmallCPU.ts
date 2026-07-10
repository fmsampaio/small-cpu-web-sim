export type RegisterName = "RA" | "RB" | "RC" | "RX";

export abstract class BaseData {
  content: number;
  bitWidth: number;
  minValue: number;
  maxValue: number;

  constructor(content: number, bitWidth: number) {
    this.content = content;
    this.bitWidth = bitWidth;

    // subclasses definem os limites
    this.minValue = this.computeMinValue();
    this.maxValue = this.computeMaxValue();
  }

  // métodos que cada classe filha deve implementar
  protected abstract computeMinValue(): number;
  protected abstract computeMaxValue(): number;

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

  getContentDec() {
    return this.content;
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
}

export class SignedData extends BaseData {
  protected computeMinValue(): number {
    return -Math.pow(2, this.bitWidth - 1);
  }

  protected computeMaxValue(): number {
    return Math.pow(2, this.bitWidth - 1) - 1;
  }
}

export interface InstructionFields {
  inst: string;
  reg?: string;
  cc?: string;
  mem?: number;
  mode?: string;
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

export class SmallCPU {
  registerFile: Record<RegisterName, BaseData>;
  dataMemory: DataMemory;
  instructionMemory: InstructionMemory;
  pc: UnsignedData;
  ri: Instruction;
  
  constructor() {
    this.registerFile = {
      RA: new SignedData(0, 8),
      RB: new SignedData(0, 8),
      RC: new SignedData(0, 8),
      RX: new SignedData(0, 8),
    };

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

    this.instructionMemory = Array.from({ length: 256 }, (_, address) => ({
      pcIsHere: false,
      address,
      assembly: "",
      bin: "",
      dec: 0,
      hex: "",
      fields: {
        inst: ""
      }
    }));

    this.dataMemory = Array.from({ length: 256 }, (_, address) => ({
      address,
      data: new SignedData(0, 8)
    }));
  }

  updateInstruction(address: number, instruction: Instruction): void {
    if(address >= 0 && address < 256) {
      this.instructionMemory[address] = instruction;
    }
    else {
      throw new Error(`Endereço inválido: ${address}`);
    }
  }

}

const INSTRUCTION_VALIDATION: Record<string, RegExp> = {
  ALL_MODES_REG_PATTERN : /^(LDR|ADD|SUB)\s+(RA|RB|RC|RX)\s+(#?-?\d+)(?:,(RX))?$/i,
  STR_PATTERN : /^(STR)\s+(RA|RB|RC|RX)\s+(\d+)(?:,(RX))?$/i,
  JMP_PATTERN : /^(JMP)\s+(\d+)$/i,
  JC_PATTERN : /^(JC)\s+(Z|N)\s+(\d+)$/i,
  HLT_PATTERN : /^HLT$/i
}

const INST_TO_OPCODE: Record<string, string> = {
  LDR : "001",
  STR : "010",
  ADD : "011",
  SUB : "100",
  JMP : "101",
  JC  : "110",
  HLT : "111"
}

const REG_TO_BIN: Record<string, string> = {
  RA : "00",
  RB : "01",
  RC : "10",
  RX : "11"
}

const CC_TO_BIN: Record<string, string> = {
  Z : "0",
  N : "1"
}

const MODE_TO_BIN: Record<string, string> = {
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
    throw new Error("Instrução não é válida!");
  
  const match = assembly.match(INSTRUCTION_VALIDATION[pattern]);

  const inst = match![(pattern === "HLT_PATTERN") ? 0 : 1];
  const opcode = INST_TO_OPCODE[inst];

  if(pattern === "ALL_MODES_REG_PATTERN" || pattern === "STR_PATTERN") {
    const regStr = match![2];
    let memStr = match![3];
    let modeStr = "DIR";

    if(memStr.includes("#")) {
      memStr = memStr.slice(1);
      modeStr = "IMM";
    }
    const memValue = Number(memStr);
    const hasIndexRX = !!match?.[4];
    if(hasIndexRX)
      modeStr = "IDX";

    const modeBin = MODE_TO_BIN[modeStr];
    const regBin = REG_TO_BIN[regStr];
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
        inst: inst,
        reg:    regStr,
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


export {isValidAssembly, parseAssembly};