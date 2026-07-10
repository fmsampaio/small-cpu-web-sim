export type RegisterName = "RA" | "RB" | "RC" | "RX" | "PC" | "RI";

export class DataFormat {
  content: number;
  bitWidth: number;
  minValue: number;
  maxValue: number;

  constructor(content: number, bitWidth: number) {
    this.content = content;
    this.bitWidth = bitWidth;

    this.minValue = -Math.pow(2, this.bitWidth-1);
    this.maxValue = Math.pow(2, this.bitWidth-1) - 1;
  }

  add(value: number) {
    const partialSum = this.content + value;
    if(partialSum > this.maxValue) {
      const diff = partialSum - this.maxValue;
      this.content = this.minValue + diff;
    }
    else {
      this.content = partialSum;
    }
  }

  sub(value: number) {
    const partialSub = this.content - value;
    if(partialSub < this.minValue) {
      const diff = this.maxValue - partialSub;
      this.content = this.maxValue - diff;
    }
    else {
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

export interface InstructionFields {
  opcode: string;
  reg?: string;
  cc?: string;
  mem?: number;
  mode?: string;
}

export interface Instruction {
  pcIsHere: boolean;
  address: number;
  assembly: string;
  bin: string;
  dec: number;
  hex: string;
  fields: InstructionFields;
}

export interface Data {
  address: number;
  data: DataFormat;
}

export type InstructionMemory = Instruction[];
export type DataMemory = Data[];

export class SmallCPU {
  registerFile: Record<RegisterName, DataFormat>;
  dataMemory: DataMemory;
  instructionMemory: InstructionMemory;
  
  constructor() {
    this.registerFile = {
      RA: new DataFormat(0, 16),
      RB: new DataFormat(0, 16),
      RC: new DataFormat(0, 16),
      RX: new DataFormat(0, 16),
      PC: new DataFormat(0, 8),
      RI: new DataFormat(0, 8),
    };

    this.instructionMemory = Array.from({ length: 256 }, (_, address) => ({
      pcIsHere: false,
      address,
      assembly: "",
      bin: "",
      dec: 0,
      hex: "",
      fields: {
        opcode: ""
      }
    }));

    this.dataMemory = Array.from({ length: 256 }, (_, address) => ({
      address,
      data: new DataFormat(0, 8)
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
  ALL_MODES_REG_PATTERN : /^(LDR|ADD|SUB)\s+(RA|RB|RC|RX)\s+(#?\d+)(?:,RX)?$/i,
  STR_PATTERN : /^STR\s+(RA|RB|RC|RX)\s+(\d+)(?:,RX)?$/i,
  JMP_PATTERN : /^JMP\s+(\d+)$/i,
  JC_PATTERN : /^JC\s+(Z|N)\s+(\d+)$/i,
  HLT_PATTERN : /^HLT$/i
}

const parseAssembly = function(assembly: string) {
  for (const [key, regex] of Object.entries(INSTRUCTION_VALIDATION)) {
    const match = assembly.match(regex);
    if (match) {
      console.log(key, match);
      return;
    }
  }

  console.log("Instrução não válida!"); // nenhum padrão casou
}

export {parseAssembly};

