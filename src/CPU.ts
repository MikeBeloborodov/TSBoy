import { Instructions } from './instructions';
import { Logger } from './logger';
import {
  Registers,
  CombinedRegister,
  u16,
  u8,
  InstructionInfo,
  FlagSetInstructions,
  Flags,
} from './types';
import { hexToString, numTo8bitString, sleep } from './utils';
import fs from 'fs';

export class CPU {
  registers: Registers;
  pc: number;
  sp: number;
  IME: boolean;
  memRead: (address: u16) => u8;
  memWrite: (address: u16, value: u8) => void;
  logger: Logger;
  delay?: number;
  debug?: boolean;
  instsJson: any;

  constructor(
    memReadFn: (address: u16) => u8,
    memWriteFn: (address: u16, value: u8) => void,
    delay?: number,
    debug?: boolean
  ) {
    this.pc = 0x0100;
    this.sp = 0xfffe;
    this.IME = false;
    this.registers = {
      a: 0x01,
      b: 0x00,
      c: 0x13,
      d: 0x00,
      e: 0xd8,
      f: 0xb0,
      h: 0x01,
      l: 0x4d,
    };
    this.memWrite = memWriteFn;
    this.memRead = memReadFn;
    this.logger = new Logger();
    this.delay = delay;
    this.debug = debug;
    const file = fs.readFileSync('./src/instructions.json', 'utf-8');
    this.instsJson = JSON.parse(file);
  }

  getCombinedRegister(register: CombinedRegister): u16 {
    switch (register) {
      case CombinedRegister.AF:
        return (this.registers.a << 8) | (this.registers.f & 0xf0);
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
        this.registers.f = value & 0xf0;
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

  async execute(): Promise<number> {
    const instruction = this.getInstruction();
    const opcode = this.memRead(this.pc);
    if (!instruction) {
      throw new Error(
        `PC: ${this.pc.toString(16)}\n, Instruction ${this.memRead(this.pc).toString(16)} is not implemented yet`
      );
    }

    if (this.debug) {
      console.log(
        `PC: ${this.pc.toString(16)}\n`,
        `Executing ${this.memRead(this.pc).toString(16)}: ${instruction.asm}`
      );
      console.log('---------------------------------');
    }

    const cycles = this.executeInstruction(instruction) * 4;

    if (opcode !== 0xcb) {
      const trueTable = this.instsJson['unprefixed'];
      if (!trueTable) {
        throw new Error(
          `No true table found at opcode  ${opcode.toString(16)}`
        );
      }
      const opcodeString = hexToString(opcode);
      const trueOpcode = trueTable[opcodeString];
      if (!trueOpcode) {
        throw new Error(`No true opcode found at opcode  ${opcodeString}`);
      }
      const trueCycles = this.instsJson['unprefixed'][opcodeString].cycles;
      if (!trueCycles) {
        throw new Error(`No cycles found at opcode  ${opcodeString}`);
      }
      // const isCycles = trueCycles[0] == cycles;
      // if (!isCycles) {
      //   throw new Error(
      //     `opcode ${opcode.toString(16)} has cycles ${this.instsJson['unprefixed'][hexToString(opcode)].cycles} but got ${cycles}`
      //   );
      // }
    }

    if (this.delay) {
      await sleep(this.delay);
    }

    return cycles;
  }

  doInterrupts(): void {
    if (!this.IME) return;

    this.IME = false;

    const IE = this.memRead(0xffff);
    const IF = this.memRead(0xff0f);
    const pendingInterrupts = IE & IF;

    if (pendingInterrupts) {
      if (pendingInterrupts & 0x01) {
        // V-Blank
        this.handleInterrupt(0x40);
        this.memWrite(0xff0f, IF & ~0x01);
        return;
      } else if (pendingInterrupts & 0x02) {
        // LCD STAT
        this.handleInterrupt(0x48);
        this.memWrite(0xff0f, IF & ~0x02);
        return;
      } else if (pendingInterrupts & 0x04) {
        // Timer
        this.handleInterrupt(0x50);
        this.memWrite(0xff0f, IF & ~0x04);
        return;
      } else if (pendingInterrupts & 0x08) {
        // Serial
        this.handleInterrupt(0x58);
        this.memWrite(0xff0f, IF & ~0x08);
        return;
      } else if (pendingInterrupts & 0x10) {
        // Joypad
        this.handleInterrupt(0x60);
        this.memWrite(0xff0f, IF & ~0x10);
        return;
      }
    }

    this.IME = true;
  }

  requestInterrupt(interrupt: number): void {
    const IF = this.memRead(0xff0f);
    switch (interrupt) {
      // V-Blank
      case 0:
        this.memWrite(0xff0f, IF | 0x01);
        break;
      // LCD STAT
      case 1:
        this.memWrite(0xff0f, IF | 0x02);
        break;
      // Timer
      case 2:
        this.memWrite(0xff0f, IF | 0x04);
        break;
      // Serial
      case 3:
        this.memWrite(0xff0f, IF | 0x08);
        break;
      // Joypad
      case 4:
        this.memWrite(0xff0f, IF | 0x10);
        break;
    }
  }

  handleInterrupt(interruptVector: number): void {
    this.pushStack(this.pc);
    this.pc = interruptVector;
  }

  getInstruction(): InstructionInfo | undefined {
    return Instructions[this.memRead(this.pc)];
  }

  executeInstruction(instruction: InstructionInfo): number {
    const logInfo = (value: number): string =>
      value.toString(16).length === 1
        ? `0${value.toString(16)}`
        : value.toString(16);
    const logInfo16 = (value: number): string => {
      if (value.toString(16).length === 1) {
        return `000${value.toString(16)}`;
      } else if (value.toString(16).length == 2) {
        return `00${value.toString(16)}`;
      } else if (value.toString(16).length == 3) {
        return `0${value.toString(16)}`;
      } else {
        return value.toString(16);
      }
    };
    this.logger.log(
      `A:${logInfo(this.registers.a)} F:${logInfo(this.registers.f)} B:${logInfo(this.registers.b)} C:${logInfo(this.registers.c)} D:${logInfo(this.registers.d)} E:${logInfo(this.registers.e)} H:${logInfo(this.registers.h)} L:${logInfo(this.registers.l)} SP:${logInfo16(this.sp)} PC:${logInfo16(this.pc)} PCMEM:${logInfo(this.memRead(this.pc))},${logInfo(this.memRead(this.pc + 1))},${logInfo(this.memRead(this.pc + 2))},${logInfo(this.memRead(this.pc + 3))}`
    );
    let cycles = instruction.fn(this);
    if (!cycles) {
      cycles = instruction.cycles;
    }
    return cycles;
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

  pushStack(value: u16): void {
    this.sp -= 2;
    this.memWrite(this.sp, value & 0xff);
    this.memWrite(this.sp + 1, (value & 0xff00) >> 8);
  }

  popStack(): u16 {
    const value = (this.memRead(this.sp + 1) << 8) | this.memRead(this.sp);
    this.sp += 2;
    return value;
  }
}
