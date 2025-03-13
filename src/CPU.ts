import { Registers, CombinedRegister, u16 } from './types';

export class CPU {
  registers: Registers;
  pc: number;

  constructor() {
    this.pc = 0b00000000;
    this.registers = {
      a: 0b00000000,
      b: 0b00000000,
      c: 0b00000000,
      d: 0b00000000,
      e: 0b00000000,
      f: 0b00000000,
      h: 0b00000000,
      l: 0b00000000,
    };
  }

  getCombinedRegister(register: CombinedRegister): u16 {
    switch (register) {
      case 'af':
        return (this.registers.a << 8) | this.registers.f;
      case 'bc':
        return (this.registers.b << 8) | this.registers.c;
      case 'de':
        return (this.registers.d << 8) | this.registers.e;
      case 'hl':
        return (this.registers.h << 8) | this.registers.l;
    }
  }

  setCombined(register: CombinedRegister, value: u16): void {
    switch (register) {
      case 'af':
        this.registers.a = (value & 0xff00) >> 8;
        this.registers.f = value & 0xff;
        break;
      case 'bc':
        this.registers.b = (value & 0xff00) >> 8;
        this.registers.c = value & 0xff;
        break;
      case 'de':
        this.registers.d = (value & 0xff00) >> 8;
        this.registers.e = value & 0xff;
        break;
      case 'hl':
        this.registers.h = (value & 0xff00) >> 8;
        this.registers.l = value & 0xff;
        break;
    }
  }
}
