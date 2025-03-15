import { Instructions } from './instructions';
import {
  Registers,
  CombinedRegister,
  u16,
  u8,
  InstructionInfo,
  FlagSetInstructions,
  Flags,
} from './types';
import { numTo8bitString, sleep } from './utils';

export class CPU {
  registers: Registers;
  pc: number;
  sp: number;
  memRead: (address: u16) => u8;
  memWrite: (address: u16) => void;

  constructor(
    memReadFn: (address: u16) => u8,
    memWriteFn: (address: u16) => void
  ) {
    this.pc = 0x0100;
    this.sp = 0xfffe;
    this.registers = {
      a: 0x00,
      b: 0x00,
      c: 0x00,
      d: 0x00,
      e: 0x00,
      f: 0x00,
      h: 0x00,
      l: 0x00,
    };
    this.memWrite = memWriteFn;
    this.memRead = memReadFn;
  }

  getCombinedRegister(register: CombinedRegister): u16 {
    switch (register) {
      case CombinedRegister.AF:
        return (this.registers.a << 8) | this.registers.f;
      case CombinedRegister.BC:
        return (this.registers.b << 8) | this.registers.c;
      case CombinedRegister.DE:
        return (this.registers.d << 8) | this.registers.e;
      case CombinedRegister.HL:
        return (this.registers.h << 8) | this.registers.l;
    }
  }

  setCombinedRegister(register: CombinedRegister, value: u16): void {
    switch (register) {
      case CombinedRegister.AF:
        this.registers.a = (value & 0xff00) >> 8;
        this.registers.f = value & 0xff;
        break;
      case CombinedRegister.BC:
        this.registers.b = (value & 0xff00) >> 8;
        this.registers.c = value & 0xff;
        break;
      case CombinedRegister.DE:
        this.registers.d = (value & 0xff00) >> 8;
        this.registers.e = value & 0xff;
        break;
      case CombinedRegister.HL:
        this.registers.h = (value & 0xff00) >> 8;
        this.registers.l = value & 0xff;
        break;
    }
  }

  async execute(): Promise<void> {
    while (true) {
      const nextInstruction = this.getInstruction();
      const instructionInfo = this.translateInstruction(nextInstruction);
      if (!instructionInfo) {
        throw new Error(
          `Instruction ${nextInstruction.toString(16)} is not implemented yet`
        );
      }

      console.log(
        `PC: ${this.pc.toString(16)}\n`,
        `Executing ${nextInstruction.toString(16)}: ${instructionInfo.asm}`
      );
      console.log('---------------------------------');

      this.executeInstruction(instructionInfo);
      await sleep(1000);
    }
  }

  getInstruction(): u8 {
    return this.memRead(this.pc);
  }

  translateInstruction(instruction: number): InstructionInfo | undefined {
    return Instructions[instruction];
  }

  executeInstruction(instructionInfo: InstructionInfo): void {
    instructionInfo.fn(this);
  }

  incrementProgramCounter(times: number) {
    this.pc += times;
  }

  setFlags(flags: FlagSetInstructions): void {
    for (const flag in flags) {
      switch (flag) {
        case 'Z': {
          const newValue = flags[flag];
          if (newValue === undefined) break;
          let curFlags = numTo8bitString(this.registers.f);
          curFlags = newValue.toString().concat(curFlags.slice(1));
          this.registers.f = parseInt(curFlags, 2);
          break;
        }
        case 'N': {
          const newValue = flags[flag];
          if (newValue === undefined) break;
          let curFlags = numTo8bitString(this.registers.f);
          curFlags = curFlags
            .slice(0, 1)
            .concat(newValue.toString(), curFlags.slice(2));
          this.registers.f = parseInt(curFlags, 2);
          break;
        }
        case 'H': {
          const newValue = flags[flag];
          if (newValue === undefined) break;
          let curFlags = numTo8bitString(this.registers.f);
          curFlags = curFlags
            .slice(0, 2)
            .concat(newValue.toString(), curFlags.slice(3));
          this.registers.f = parseInt(curFlags, 2);
          break;
        }
        case 'C': {
          const newValue = flags[flag];
          if (newValue === undefined) break;
          let curFlags = numTo8bitString(this.registers.f);
          curFlags = curFlags
            .slice(0, 3)
            .concat(newValue.toString(), curFlags.slice(4));
          this.registers.f = parseInt(curFlags, 2);
          break;
        }
      }
    }
  }

  getFlags(): Flags {
    const flagString = numTo8bitString(this.registers.f);
    return {
      Z: parseInt(flagString[0]),
      N: parseInt(flagString[1]),
      H: parseInt(flagString[2]),
      C: parseInt(flagString[3]),
    };
  }
}
