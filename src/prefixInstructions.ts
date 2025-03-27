import { CPU } from './CPU';
import { CombinedRegister, FlagState, InstructionsMap, TCycles } from './types';

export function SET(value: number, bit: number): number {
  return value | (1 << bit);
}

export function RES(value: number, bit: number): number {
  return value & ~(1 << bit);
}

export function BIT(value: number, bit: number): boolean {
  return (value & (1 << bit)) !== 0;
}

export function SRL(value: number): { value: number; carry: boolean } {
  const result = value >> 1;
  const carry = (value & 1) !== 0;
  return { value: result, carry };
}

export function RLC(value: number): { value: number; carry: boolean } {
  const carry = !!(value & 0x80);
  let result = (value << 1) & 0xff;
  if (carry) result += 1;
  return { value: result, carry };
}

export function RRC(value: number): { value: number; carry: boolean } {
  const carry = !!(value & 1);
  let result = (value >> 1) & 0xff;
  if (carry) result |= 0x80;
  return { value: result, carry };
}

export function RR(
  value: number,
  carry: FlagState
): { value: number; carry: boolean } {
  const result = (value >> 1) | (carry ? 0x80 : 0);
  const newCarry = (value & 1) !== 0;
  return { value: result, carry: newCarry };
}

export function RL(value: number, carry: FlagState) {
  const result = (value << 1) | (carry ? 1 : 0);
  const newCarry = !!(value & 0x80);
  return { value: result & 0xff, carry: newCarry };
}

export function SLA(value: number): { value: number; carry: boolean } {
  const result = (value << 1) & 0xff;
  const carry = !!(value & 0x80);
  return { value: result, carry };
}

export function SRA(value: number): { value: number; carry: boolean } {
  const MSB = value & 0x80;
  const result = (value >> 1) | (MSB ? 0x80 : 0);
  const carry = !!(value & 1);
  return { value: result, carry };
}

export function SWAP(value: number): number {
  const lowerNibble = value & 0xf;
  const upperNibble = (value >> 4) & 0xf;
  return (lowerNibble << 4) | upperNibble;
}

export const PrefixInstructions: InstructionsMap = {
  0xc0: {
    meta: {
      asm: 'SET 0, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 0);
      return 8;
    },
  },
  0xd0: {
    meta: {
      asm: 'SET 2, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 2);
      return 8;
    },
  },
  0xe0: {
    meta: {
      asm: 'SET 4, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 4);
      return 8;
    },
  },
  0xf0: {
    meta: {
      asm: 'SET 6, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 6);
      return 8;
    },
  },
  0xc1: {
    meta: {
      asm: 'SET 0, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 0);
      return 8;
    },
  },
  0xd1: {
    meta: {
      asm: 'SET 2, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 2);
      return 8;
    },
  },
  0xe1: {
    meta: {
      asm: 'SET 4, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 4);
      return 8;
    },
  },
  0xf1: {
    meta: {
      asm: 'SET 6, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 6);
      return 8;
    },
  },
  0xc2: {
    meta: {
      asm: 'SET 0, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 0);
      return 8;
    },
  },
  0xd2: {
    meta: {
      asm: 'SET 2, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 2);
      return 8;
    },
  },
  0xe2: {
    meta: {
      asm: 'SET 4, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 4);
      return 8;
    },
  },
  0xf2: {
    meta: {
      asm: 'SET 6, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 6);
      return 8;
    },
  },
  0xc3: {
    meta: {
      asm: 'SET 0, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 0);
      return 8;
    },
  },
  0xd3: {
    meta: {
      asm: 'SET 2, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 2);
      return 8;
    },
  },
  0xe3: {
    meta: {
      asm: 'SET 4, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 4);
      return 8;
    },
  },
  0xf3: {
    meta: {
      asm: 'SET 6, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 6);
      return 8;
    },
  },
  0xc4: {
    meta: {
      asm: 'SET 0, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 0);
      return 8;
    },
  },
  0xd4: {
    meta: {
      asm: 'SET 2, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 2);
      return 8;
    },
  },
  0xe4: {
    meta: {
      asm: 'SET 4, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 4);
      return 8;
    },
  },
  0xf4: {
    meta: {
      asm: 'SET 6, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 6);
      return 8;
    },
  },
  0xc5: {
    meta: {
      asm: 'SET 0, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 0);
      return 8;
    },
  },
  0xd5: {
    meta: {
      asm: 'SET 2, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 2);
      return 8;
    },
  },
  0xe5: {
    meta: {
      asm: 'SET 4, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 4);
      return 8;
    },
  },
  0xf5: {
    meta: {
      asm: 'SET 6, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 6);
      return 8;
    },
  },
  0xc6: {
    meta: {
      asm: 'SET 0, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 0));
      return 16;
    },
  },
  0xd6: {
    meta: {
      asm: 'SET 2, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 2));
      return 16;
    },
  },
  0xe6: {
    meta: {
      asm: 'SET 4, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 4));
      return 16;
    },
  },
  0xf6: {
    meta: {
      asm: 'SET 6, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 6));
      return 16;
    },
  },
  0xc7: {
    meta: {
      asm: 'SET 0, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 0);
      return 8;
    },
  },
  0xd7: {
    meta: {
      asm: 'SET 2, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 2);
      return 8;
    },
  },
  0xe7: {
    meta: {
      asm: 'SET 4, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 4);
      return 8;
    },
  },
  0xf7: {
    meta: {
      asm: 'SET 6, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 6);
      return 8;
    },
  },
  0xc8: {
    meta: {
      asm: 'SET 1, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 1);
      return 8;
    },
  },
  0xd8: {
    meta: {
      asm: 'SET 3, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 3);
      return 8;
    },
  },
  0xe8: {
    meta: {
      asm: 'SET 5, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 5);
      return 8;
    },
  },
  0xf8: {
    meta: {
      asm: 'SET 7, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = SET(cpu.registers.b, 7);
      return 8;
    },
  },
  0xc9: {
    meta: {
      asm: 'SET 1, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 1);
      return 8;
    },
  },
  0xd9: {
    meta: {
      asm: 'SET 3, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 3);
      return 8;
    },
  },
  0xe9: {
    meta: {
      asm: 'SET 5, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 5);
      return 8;
    },
  },
  0xf9: {
    meta: {
      asm: 'SET 7, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = SET(cpu.registers.c, 7);
      return 8;
    },
  },
  0xca: {
    meta: {
      asm: 'SET 1, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 1);
      return 8;
    },
  },
  0xda: {
    meta: {
      asm: 'SET 3, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 3);
      return 8;
    },
  },
  0xea: {
    meta: {
      asm: 'SET 5, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 5);
      return 8;
    },
  },
  0xfa: {
    meta: {
      asm: 'SET 7, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = SET(cpu.registers.d, 7);
      return 8;
    },
  },
  0xcb: {
    meta: {
      asm: 'SET 1, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 1);
      return 8;
    },
  },
  0xdb: {
    meta: {
      asm: 'SET 3, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 3);
      return 8;
    },
  },
  0xeb: {
    meta: {
      asm: 'SET 5, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 5);
      return 8;
    },
  },
  0xfb: {
    meta: {
      asm: 'SET 7, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = SET(cpu.registers.e, 7);
      return 8;
    },
  },
  0xcc: {
    meta: {
      asm: 'SET 1, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 1);
      return 8;
    },
  },
  0xdc: {
    meta: {
      asm: 'SET 3, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 3);
      return 8;
    },
  },
  0xec: {
    meta: {
      asm: 'SET 5, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 5);
      return 8;
    },
  },
  0xfc: {
    meta: {
      asm: 'SET 7, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = SET(cpu.registers.h, 7);
      return 8;
    },
  },
  0xcd: {
    meta: {
      asm: 'SET 1, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 1);
      return 8;
    },
  },
  0xdd: {
    meta: {
      asm: 'SET 3, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 3);
      return 8;
    },
  },
  0xed: {
    meta: {
      asm: 'SET 5, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 5);
      return 8;
    },
  },
  0xfd: {
    meta: {
      asm: 'SET 7, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = SET(cpu.registers.l, 7);
      return 8;
    },
  },
  0xce: {
    meta: {
      asm: 'SET 1, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 1));
      return 16;
    },
  },
  0xde: {
    meta: {
      asm: 'SET 3, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 3));
      return 16;
    },
  },
  0xee: {
    meta: {
      asm: 'SET 5, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 5));
      return 16;
    },
  },
  0xfe: {
    meta: {
      asm: 'SET 7, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 7));
      return 16;
    },
  },
  0xcf: {
    meta: {
      asm: 'SET 1, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 1);
      return 8;
    },
  },
  0xdf: {
    meta: {
      asm: 'SET 3, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 3);
      return 8;
    },
  },
  0xef: {
    meta: {
      asm: 'SET 5, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 5);
      return 8;
    },
  },
  0xff: {
    meta: {
      asm: 'SET 7, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = SET(cpu.registers.a, 7);
      return 8;
    },
  },
  0x80: {
    meta: {
      asm: 'RES 0, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 0);
      return 8;
    },
  },
  0x90: {
    meta: {
      asm: 'RES 2, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 2);
      return 8;
    },
  },
  0xa0: {
    meta: {
      asm: 'RES 4, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 4);
      return 8;
    },
  },
  0xb0: {
    meta: {
      asm: 'RES 6, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 6);
      return 8;
    },
  },
  0x81: {
    meta: {
      asm: 'RES 0, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 0);
      return 8;
    },
  },
  0x91: {
    meta: {
      asm: 'RES 2, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 2);
      return 8;
    },
  },
  0xa1: {
    meta: {
      asm: 'RES 4, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 4);
      return 8;
    },
  },
  0xb1: {
    meta: {
      asm: 'RES 6, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 6);
      return 8;
    },
  },
  0x82: {
    meta: {
      asm: 'RES 0, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 0);
      return 8;
    },
  },
  0x92: {
    meta: {
      asm: 'RES 2, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 2);
      return 8;
    },
  },
  0xa2: {
    meta: {
      asm: 'RES 4, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 4);
      return 8;
    },
  },
  0xb2: {
    meta: {
      asm: 'RES 6, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 6);
      return 8;
    },
  },
  0x83: {
    meta: {
      asm: 'RES 0, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 0);
      return 8;
    },
  },
  0x93: {
    meta: {
      asm: 'RES 2, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 2);
      return 8;
    },
  },
  0xa3: {
    meta: {
      asm: 'RES 4, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 4);
      return 8;
    },
  },
  0xb3: {
    meta: {
      asm: 'RES 6, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 6);
      return 8;
    },
  },
  0x84: {
    meta: {
      asm: 'RES 0, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 0);
      return 8;
    },
  },
  0x94: {
    meta: {
      asm: 'RES 2, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 2);
      return 8;
    },
  },
  0xa4: {
    meta: {
      asm: 'RES 4, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 4);
      return 8;
    },
  },
  0xb4: {
    meta: {
      asm: 'RES 6, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 6);
      return 8;
    },
  },
  0x85: {
    meta: {
      asm: 'RES 0, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 0);
      return 8;
    },
  },
  0x95: {
    meta: {
      asm: 'RES 2, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 2);
      return 8;
    },
  },
  0xa5: {
    meta: {
      asm: 'RES 4, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 4);
      return 8;
    },
  },
  0xb5: {
    meta: {
      asm: 'RES 6, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 6);
      return 8;
    },
  },
  0x86: {
    meta: {
      asm: 'RES 0, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 0));
      return 16;
    },
  },
  0x96: {
    meta: {
      asm: 'RES 2, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 2));
      return 16;
    },
  },
  0xa6: {
    meta: {
      asm: 'RES 4, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 4));
      return 16;
    },
  },
  0xb6: {
    meta: {
      asm: 'RES 6, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 6));
      return 16;
    },
  },
  0x87: {
    meta: {
      asm: 'RES 0, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 0);
      return 8;
    },
  },
  0x97: {
    meta: {
      asm: 'RES 2, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 2);
      return 8;
    },
  },
  0xa7: {
    meta: {
      asm: 'RES 4, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 4);
      return 8;
    },
  },
  0xb7: {
    meta: {
      asm: 'RES 6, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 6);
      return 8;
    },
  },
  0x88: {
    meta: {
      asm: 'RES 1, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 1);
      return 8;
    },
  },
  0x98: {
    meta: {
      asm: 'RES 3, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 3);
      return 8;
    },
  },
  0xa8: {
    meta: {
      asm: 'RES 5, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 5);
      return 8;
    },
  },
  0xb8: {
    meta: {
      asm: 'RES 7, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = RES(cpu.registers.b, 7);
      return 8;
    },
  },
  0x89: {
    meta: {
      asm: 'RES 1, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 1);
      return 8;
    },
  },
  0x99: {
    meta: {
      asm: 'RES 3, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 3);
      return 8;
    },
  },
  0xa9: {
    meta: {
      asm: 'RES 5, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 5);
      return 8;
    },
  },
  0xb9: {
    meta: {
      asm: 'RES 7, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = RES(cpu.registers.c, 7);
      return 8;
    },
  },
  0x8a: {
    meta: {
      asm: 'RES 1, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 1);
      return 8;
    },
  },
  0x9a: {
    meta: {
      asm: 'RES 3, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 3);
      return 8;
    },
  },
  0xaa: {
    meta: {
      asm: 'RES 5, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 5);
      return 8;
    },
  },
  0xba: {
    meta: {
      asm: 'RES 7, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = RES(cpu.registers.d, 7);
      return 8;
    },
  },
  0x8b: {
    meta: {
      asm: 'RES 1, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 1);
      return 8;
    },
  },
  0x9b: {
    meta: {
      asm: 'RES 3, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 3);
      return 8;
    },
  },
  0xab: {
    meta: {
      asm: 'RES 5, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 5);
      return 8;
    },
  },
  0xbb: {
    meta: {
      asm: 'RES 7, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = RES(cpu.registers.e, 7);
      return 8;
    },
  },
  0x8c: {
    meta: {
      asm: 'RES 1, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 1);
      return 8;
    },
  },
  0x9c: {
    meta: {
      asm: 'RES 3, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 3);
      return 8;
    },
  },
  0xac: {
    meta: {
      asm: 'RES 5, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 5);
      return 8;
    },
  },
  0xbc: {
    meta: {
      asm: 'RES 7, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = RES(cpu.registers.h, 7);
      return 8;
    },
  },
  0x8d: {
    meta: {
      asm: 'RES 1, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 1);
      return 8;
    },
  },
  0x9d: {
    meta: {
      asm: 'RES 3, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 3);
      return 8;
    },
  },
  0xad: {
    meta: {
      asm: 'RES 5, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 5);
      return 8;
    },
  },
  0xbd: {
    meta: {
      asm: 'RES 7, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = RES(cpu.registers.l, 7);
      return 8;
    },
  },
  0x8e: {
    meta: {
      asm: 'RES 1, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 1));
      return 16;
    },
  },
  0x9e: {
    meta: {
      asm: 'RES 3, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 3));
      return 16;
    },
  },
  0xae: {
    meta: {
      asm: 'RES 5, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 5));
      return 16;
    },
  },
  0xbe: {
    meta: {
      asm: 'RES 7, [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 7));
      return 16;
    },
  },
  0x8f: {
    meta: {
      asm: 'RES 1, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 1);
      return 8;
    },
  },
  0x9f: {
    meta: {
      asm: 'RES 3, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 3);
      return 8;
    },
  },
  0xaf: {
    meta: {
      asm: 'RES 5, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 5);
      return 8;
    },
  },
  0xbf: {
    meta: {
      asm: 'RES 7, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = RES(cpu.registers.a, 7);
      return 8;
    },
  },
  0x40: {
    meta: {
      asm: 'BIT 0, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x41: {
    meta: {
      asm: 'BIT 0, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x42: {
    meta: {
      asm: 'BIT 0, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x43: {
    meta: {
      asm: 'BIT 0, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x44: {
    meta: {
      asm: 'BIT 0, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x45: {
    meta: {
      asm: 'BIT 0, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x46: {
    meta: {
      asm: 'BIT 0, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x47: {
    meta: {
      asm: 'BIT 0, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x48: {
    meta: {
      asm: 'BIT 1, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x49: {
    meta: {
      asm: 'BIT 1, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x4a: {
    meta: {
      asm: 'BIT 1, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x4b: {
    meta: {
      asm: 'BIT 1, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x4c: {
    meta: {
      asm: 'BIT 1, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x4d: {
    meta: {
      asm: 'BIT 1, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x4e: {
    meta: {
      asm: 'BIT 1, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x4f: {
    meta: {
      asm: 'BIT 1, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x50: {
    meta: {
      asm: 'BIT 2, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x51: {
    meta: {
      asm: 'BIT 2, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x52: {
    meta: {
      asm: 'BIT 2, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x53: {
    meta: {
      asm: 'BIT 2, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x54: {
    meta: {
      asm: 'BIT 2, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x55: {
    meta: {
      asm: 'BIT 2, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x56: {
    meta: {
      asm: 'BIT 2, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x57: {
    meta: {
      asm: 'BIT 2, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x58: {
    meta: {
      asm: 'BIT 3, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x59: {
    meta: {
      asm: 'BIT 3, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x5a: {
    meta: {
      asm: 'BIT 3, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x5b: {
    meta: {
      asm: 'BIT 3, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x5c: {
    meta: {
      asm: 'BIT 3, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x5d: {
    meta: {
      asm: 'BIT 3, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x5e: {
    meta: {
      asm: 'BIT 3, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x5f: {
    meta: {
      asm: 'BIT 3, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x60: {
    meta: {
      asm: 'BIT 4, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x61: {
    meta: {
      asm: 'BIT 4, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x62: {
    meta: {
      asm: 'BIT 4, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x63: {
    meta: {
      asm: 'BIT 4, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x64: {
    meta: {
      asm: 'BIT 4, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x65: {
    meta: {
      asm: 'BIT 4, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x66: {
    meta: {
      asm: 'BIT 4, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x67: {
    meta: {
      asm: 'BIT 4, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x68: {
    meta: {
      asm: 'BIT 5, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  // nice
  0x69: {
    meta: {
      asm: 'BIT 5, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x6a: {
    meta: {
      asm: 'BIT 5, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x6b: {
    meta: {
      asm: 'BIT 5, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x6c: {
    meta: {
      asm: 'BIT 5, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x6d: {
    meta: {
      asm: 'BIT 5, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x6e: {
    meta: {
      asm: 'BIT 5, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x6f: {
    meta: {
      asm: 'BIT 5, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x70: {
    meta: {
      asm: 'BIT 6, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x71: {
    meta: {
      asm: 'BIT 6, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x72: {
    meta: {
      asm: 'BIT 6, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x73: {
    meta: {
      asm: 'BIT 6, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x74: {
    meta: {
      asm: 'BIT 6, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x75: {
    meta: {
      asm: 'BIT 6, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x76: {
    meta: {
      asm: 'BIT 6, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x77: {
    meta: {
      asm: 'BIT 6, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x78: {
    meta: {
      asm: 'BIT 7, B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x79: {
    meta: {
      asm: 'BIT 7, C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x7a: {
    meta: {
      asm: 'BIT 7, D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x7b: {
    meta: {
      asm: 'BIT 7, E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x7c: {
    meta: {
      asm: 'BIT 7, H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x7d: {
    meta: {
      asm: 'BIT 7, L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x7e: {
    meta: {
      asm: 'BIT 7, [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 12;
    },
  },
  0x7f: {
    meta: {
      asm: 'BIT 7, A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
      return 8;
    },
  },
  0x38: {
    meta: {
      asm: 'SRL B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x39: {
    meta: {
      asm: 'SRL C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x3a: {
    meta: {
      asm: 'SRL D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x3b: {
    meta: {
      asm: 'SRL E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x3c: {
    meta: {
      asm: 'SRL H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x3d: {
    meta: {
      asm: 'SRL L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x3e: {
    meta: {
      asm: 'SRL [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = SRL(value);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x3f: {
    meta: {
      asm: 'SRL A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x18: {
    meta: {
      asm: 'RR B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.b, cpu.getFlags().C);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x19: {
    meta: {
      asm: 'RR C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.c, cpu.getFlags().C);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x1a: {
    meta: {
      asm: 'RR D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.d, cpu.getFlags().C);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x1b: {
    meta: {
      asm: 'RR E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.e, cpu.getFlags().C);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x1c: {
    meta: {
      asm: 'RR H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.h, cpu.getFlags().C);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x1d: {
    meta: {
      asm: 'RR L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.l, cpu.getFlags().C);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x1e: {
    meta: {
      asm: 'RR [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = RR(value, cpu.getFlags().C);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x1f: {
    meta: {
      asm: 'RR A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x00: {
    meta: {
      asm: 'RLC B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x01: {
    meta: {
      asm: 'RLC C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x02: {
    meta: {
      asm: 'RLC D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x03: {
    meta: {
      asm: 'RLC E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x04: {
    meta: {
      asm: 'RLC H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x05: {
    meta: {
      asm: 'RLC L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x06: {
    meta: {
      asm: 'RLC [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = RLC(value);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x07: {
    meta: {
      asm: 'RLC A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x08: {
    meta: {
      asm: 'RRC B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x09: {
    meta: {
      asm: 'RRC C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x0a: {
    meta: {
      asm: 'RRC D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x0b: {
    meta: {
      asm: 'RRC E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x0c: {
    meta: {
      asm: 'RRC H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x0d: {
    meta: {
      asm: 'RRC L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x0e: {
    meta: {
      asm: 'RRC [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = RRC(value);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x0f: {
    meta: {
      asm: 'RRC A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RRC(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x10: {
    meta: {
      asm: 'RL B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.b, cpu.getFlags().C);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x11: {
    meta: {
      asm: 'RL C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.c, cpu.getFlags().C);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x12: {
    meta: {
      asm: 'RL D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.d, cpu.getFlags().C);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x13: {
    meta: {
      asm: 'RL E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.e, cpu.getFlags().C);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x14: {
    meta: {
      asm: 'RL H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.h, cpu.getFlags().C);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x15: {
    meta: {
      asm: 'RL L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.l, cpu.getFlags().C);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x16: {
    meta: {
      asm: 'RL [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = RL(value, cpu.getFlags().C);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x17: {
    meta: {
      asm: 'RL A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x20: {
    meta: {
      asm: 'SLA B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x21: {
    meta: {
      asm: 'SLA C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x22: {
    meta: {
      asm: 'SLA D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x23: {
    meta: {
      asm: 'SLA E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x24: {
    meta: {
      asm: 'SLA H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x25: {
    meta: {
      asm: 'SLA L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x26: {
    meta: {
      asm: 'SLA [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = SLA(value);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x27: {
    meta: {
      asm: 'SLA A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SLA(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x28: {
    meta: {
      asm: 'SRA B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x29: {
    meta: {
      asm: 'SRA C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x2a: {
    meta: {
      asm: 'SRA D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x2b: {
    meta: {
      asm: 'SRA E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x2c: {
    meta: {
      asm: 'SRA H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x2d: {
    meta: {
      asm: 'SRA L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x2e: {
    meta: {
      asm: 'SRA [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const { value: newValue, carry } = SRA(value);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 16;
    },
  },
  0x2f: {
    meta: {
      asm: 'SRA A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRA(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x30: {
    meta: {
      asm: 'SWAP B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0x31: {
    meta: {
      asm: 'SWAP C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0x32: {
    meta: {
      asm: 'SWAP D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0x33: {
    meta: {
      asm: 'SWAP E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0x34: {
    meta: {
      asm: 'SWAP H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0x35: {
    meta: {
      asm: 'SWAP L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0x36: {
    meta: {
      asm: 'SWAP [HL]',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      const newValue = SWAP(value);
      cpu.memWrite(address, newValue);
      cpu.setFlags({
        Z: newValue === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 16;
    },
  },
  0x37: {
    meta: {
      asm: 'SWAP A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = SWAP(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
};
