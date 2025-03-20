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
import { numTo8bitString, sleep } from './utils';

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

  async execute(): Promise<void> {
    while (true) {
      const nextInstruction = this.getInstruction();
      const instructionInfo = this.translateInstruction(nextInstruction);
      if (!instructionInfo) {
        throw new Error(
          `PC: ${this.pc.toString(16)}\n, Instruction ${nextInstruction.toString(16)} is not implemented yet`
        );
      }

      if (this.debug) {
        console.log(
          `PC: ${this.pc.toString(16)}\n`,
          `Executing ${nextInstruction.toString(16)}: ${instructionInfo.asm}`
        );
        console.log('---------------------------------');
      }

      this.executeInstruction(instructionInfo);
      this.doInterrupts();
      this.delay && (await sleep(this.delay));
    }
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

  handleInterrupt(interruptVector: number): void {
    this.pushStack(this.pc);
    this.pc = interruptVector;
  }

  getInstruction(): u8 {
    return this.memRead(this.pc);
  }

  translateInstruction(instruction: number): InstructionInfo | undefined {
    return Instructions[instruction];
  }

  executeInstruction(instructionInfo: InstructionInfo): void {
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
