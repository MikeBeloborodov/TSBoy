export type HexTable = { [key: number]: string };
export type CodeTable = { [key: string]: string };

export type HeaderInfo = {
  isNintendoLogo: boolean;
  title: string;
  licensee: string;
  isSGB: boolean;
  cartridgeType: string;
  romSize: string;
  ramSize: string;
  destination: string;
  maskRom: number;
  isChecksumValid: boolean;
};

export type MockRom = {
  path: string;
  description: string;
  headerContents: HeaderInfo;
};

export type u8 = number;
export type u16 = number;

export enum CombinedRegister {
  AF,
  BC,
  DE,
  HL,
}

export type Registers = {
  a: u8;
  b: u8;
  c: u8;
  d: u8;
  e: u8;
  f: u8;
  h: u8;
  l: u8;
};

export type Context = {
  currInstruction: number;
  currInstructionAsm: string;
};

export type Memory = Uint8Array;

export interface IMemoryWritable {
  memWrite: () => void;
}

export interface IMemoryReadable {
  memRead: () => void;
}

export enum FlagState {
  CALCULATE,
  RESET,
  SET,
  UNTOUCHED,
}

export type InstructionInfo = {
  asm: string;
  flags: {
    Z: FlagState;
    N: FlagState;
    H: FlagState;
    C: FlagState;
  };
  size: number;
  cycles: number;
  fn: (pc: number, memRead: Function, memWrite: Function) => u16 | void;
};

export type InstructionsMap = { [key: u8]: InstructionInfo };
