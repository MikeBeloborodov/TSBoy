import { CPU } from './CPU';
import { CombinedRegister, FlagState, InstructionsMap } from './types';

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
    asm: 'SET 0, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 0);
    },
  },
  0xd0: {
    asm: 'SET 2, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 2);
    },
  },
  0xe0: {
    asm: 'SET 4, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 4);
    },
  },
  0xf0: {
    asm: 'SET 6, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 6);
    },
  },
  0xc1: {
    asm: 'SET 0, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 0);
    },
  },
  0xd1: {
    asm: 'SET 2, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 2);
    },
  },
  0xe1: {
    asm: 'SET 4, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 4);
    },
  },
  0xf1: {
    asm: 'SET 6, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 6);
    },
  },
  0xc2: {
    asm: 'SET 0, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 0);
    },
  },
  0xd2: {
    asm: 'SET 2, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 2);
    },
  },
  0xe2: {
    asm: 'SET 4, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 4);
    },
  },
  0xf2: {
    asm: 'SET 6, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 6);
    },
  },
  0xc3: {
    asm: 'SET 0, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 0);
    },
  },
  0xd3: {
    asm: 'SET 2, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 2);
    },
  },
  0xe3: {
    asm: 'SET 4, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 4);
    },
  },
  0xf3: {
    asm: 'SET 6, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 6);
    },
  },
  0xc4: {
    asm: 'SET 0, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 0);
    },
  },
  0xd4: {
    asm: 'SET 2, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 2);
    },
  },
  0xe4: {
    asm: 'SET 4, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 4);
    },
  },
  0xf4: {
    asm: 'SET 6, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 6);
    },
  },
  0xc5: {
    asm: 'SET 0, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 0);
    },
  },
  0xd5: {
    asm: 'SET 2, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 2);
    },
  },
  0xe5: {
    asm: 'SET 4, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 4);
    },
  },
  0xf5: {
    asm: 'SET 6, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 6);
    },
  },
  0xc6: {
    asm: 'SET 0, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 0));
      cpu.registers.a = SET(cpu.registers.a, 0);
    },
  },
  0xd6: {
    asm: 'SET 2, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 2));
      cpu.registers.a = SET(cpu.registers.a, 2);
    },
  },
  0xe6: {
    asm: 'SET 4, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 4));
      cpu.registers.a = SET(cpu.registers.a, 4);
    },
  },
  0xf6: {
    asm: 'SET 6, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 6));
      cpu.registers.a = SET(cpu.registers.a, 6);
    },
  },
  0xc7: {
    asm: 'SET 0, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 0);
    },
  },
  0xd7: {
    asm: 'SET 2, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 2);
    },
  },
  0xe7: {
    asm: 'SET 4, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 4);
    },
  },
  0xf7: {
    asm: 'SET 6, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 6);
    },
  },
  0xc8: {
    asm: 'SET 1, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 1);
    },
  },
  0xd8: {
    asm: 'SET 3, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 3);
    },
  },
  0xe8: {
    asm: 'SET 5, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 5);
    },
  },
  0xf8: {
    asm: 'SET 7, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 7);
    },
  },
  0xc9: {
    asm: 'SET 1, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 1);
    },
  },
  0xd9: {
    asm: 'SET 3, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 3);
    },
  },
  0xe9: {
    asm: 'SET 5, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 5);
    },
  },
  0xf9: {
    asm: 'SET 7, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 7);
    },
  },
  0xca: {
    asm: 'SET 1, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 1);
    },
  },
  0xda: {
    asm: 'SET 3, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 3);
    },
  },
  0xea: {
    asm: 'SET 5, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 5);
    },
  },
  0xfa: {
    asm: 'SET 7, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 7);
    },
  },
  0xcb: {
    asm: 'SET 1, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 1);
    },
  },
  0xdb: {
    asm: 'SET 3, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 3);
    },
  },
  0xeb: {
    asm: 'SET 5, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 5);
    },
  },
  0xfb: {
    asm: 'SET 7, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 7);
    },
  },
  0xcc: {
    asm: 'SET 1, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 1);
    },
  },
  0xdc: {
    asm: 'SET 3, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 3);
    },
  },
  0xec: {
    asm: 'SET 5, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 5);
    },
  },
  0xfc: {
    asm: 'SET 7, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 7);
    },
  },
  0xcd: {
    asm: 'SET 1, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 1);
    },
  },
  0xdd: {
    asm: 'SET 3, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 3);
    },
  },
  0xed: {
    asm: 'SET 5, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 5);
    },
  },
  0xfd: {
    asm: 'SET 7, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 7);
    },
  },
  0xce: {
    asm: 'SET 1, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 1));
      cpu.registers.a = SET(cpu.registers.a, 1);
    },
  },
  0xde: {
    asm: 'SET 3, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 3));
      cpu.registers.a = SET(cpu.registers.a, 3);
    },
  },
  0xee: {
    asm: 'SET 5, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 5));
      cpu.registers.a = SET(cpu.registers.a, 5);
    },
  },
  0xfe: {
    asm: 'SET 7, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, SET(value, 7));
      cpu.registers.a = SET(cpu.registers.a, 7);
    },
  },
  0xcf: {
    asm: 'SET 1, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 1);
    },
  },
  0xdf: {
    asm: 'SET 3, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 3);
    },
  },
  0xef: {
    asm: 'SET 5, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 5);
    },
  },
  0xff: {
    asm: 'SET 7, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 7);
    },
  },
  0x80: {
    asm: 'RES 0, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 0);
    },
  },
  0x90: {
    asm: 'RES 2, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 2);
    },
  },
  0xa0: {
    asm: 'RES 4, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 4);
    },
  },
  0xb0: {
    asm: 'RES 6, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 6);
    },
  },
  0x81: {
    asm: 'RES 0, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 0);
    },
  },
  0x91: {
    asm: 'RES 2, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 2);
    },
  },
  0xa1: {
    asm: 'RES 4, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 4);
    },
  },
  0xb1: {
    asm: 'RES 6, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 6);
    },
  },
  0x82: {
    asm: 'RES 0, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 0);
    },
  },
  0x92: {
    asm: 'RES 2, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 2);
    },
  },
  0xa2: {
    asm: 'RES 4, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 4);
    },
  },
  0xb2: {
    asm: 'RES 6, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 6);
    },
  },
  0x83: {
    asm: 'RES 0, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 0);
    },
  },
  0x93: {
    asm: 'RES 2, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 2);
    },
  },
  0xa3: {
    asm: 'RES 4, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 4);
    },
  },
  0xb3: {
    asm: 'RES 6, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 6);
    },
  },
  0x84: {
    asm: 'RES 0, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 0);
    },
  },
  0x94: {
    asm: 'RES 2, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 2);
    },
  },
  0xa4: {
    asm: 'RES 4, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 4);
    },
  },
  0xb4: {
    asm: 'RES 6, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 6);
    },
  },
  0x85: {
    asm: 'RES 0, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 0);
    },
  },
  0x95: {
    asm: 'RES 2, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 2);
    },
  },
  0xa5: {
    asm: 'RES 4, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 4);
    },
  },
  0xb5: {
    asm: 'RES 6, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 6);
    },
  },
  0x86: {
    asm: 'RES 0, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 0));
      cpu.registers.a = RES(cpu.registers.a, 0);
    },
  },
  0x96: {
    asm: 'RES 2, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 2));
      cpu.registers.a = RES(cpu.registers.a, 2);
    },
  },
  0xa6: {
    asm: 'RES 4, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 4));
      cpu.registers.a = RES(cpu.registers.a, 4);
    },
  },
  0xb6: {
    asm: 'RES 6, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 6));
      cpu.registers.a = RES(cpu.registers.a, 6);
    },
  },
  0x87: {
    asm: 'RES 0, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 0);
    },
  },
  0x97: {
    asm: 'RES 2, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 2);
    },
  },
  0xa7: {
    asm: 'RES 4, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 4);
    },
  },
  0xb7: {
    asm: 'RES 6, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 6);
    },
  },
  0x88: {
    asm: 'RES 1, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 1);
    },
  },
  0x98: {
    asm: 'RES 3, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 3);
    },
  },
  0xa8: {
    asm: 'RES 5, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 5);
    },
  },
  0xb8: {
    asm: 'RES 7, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.b = RES(cpu.registers.b, 7);
    },
  },
  0x89: {
    asm: 'RES 1, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 1);
    },
  },
  0x99: {
    asm: 'RES 3, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 3);
    },
  },
  0xa9: {
    asm: 'RES 5, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 5);
    },
  },
  0xb9: {
    asm: 'RES 7, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.c = RES(cpu.registers.c, 7);
    },
  },
  0x8a: {
    asm: 'RES 1, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 1);
    },
  },
  0x9a: {
    asm: 'RES 3, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 3);
    },
  },
  0xaa: {
    asm: 'RES 5, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 5);
    },
  },
  0xba: {
    asm: 'RES 7, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.d = RES(cpu.registers.d, 7);
    },
  },
  0x8b: {
    asm: 'RES 1, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 1);
    },
  },
  0x9b: {
    asm: 'RES 3, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 3);
    },
  },
  0xab: {
    asm: 'RES 5, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 5);
    },
  },
  0xbb: {
    asm: 'RES 7, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.e = RES(cpu.registers.e, 7);
    },
  },
  0x8c: {
    asm: 'RES 1, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 1);
    },
  },
  0x9c: {
    asm: 'RES 3, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 3);
    },
  },
  0xac: {
    asm: 'RES 5, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 5);
    },
  },
  0xbc: {
    asm: 'RES 7, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.h = RES(cpu.registers.h, 7);
    },
  },
  0x8d: {
    asm: 'RES 1, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 1);
    },
  },
  0x9d: {
    asm: 'RES 3, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 3);
    },
  },
  0xad: {
    asm: 'RES 5, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 5);
    },
  },
  0xbd: {
    asm: 'RES 7, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.l = RES(cpu.registers.l, 7);
    },
  },
  0x8e: {
    asm: 'RES 1, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 1));
      cpu.registers.a = RES(cpu.registers.a, 1);
    },
  },
  0x9e: {
    asm: 'RES 3, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 3));
      cpu.registers.a = RES(cpu.registers.a, 3);
    },
  },
  0xae: {
    asm: 'RES 5, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 5));
      cpu.registers.a = RES(cpu.registers.a, 5);
    },
  },
  0xbe: {
    asm: 'RES 7, [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.memWrite(address, RES(value, 7));
      cpu.registers.a = RES(cpu.registers.a, 7);
    },
  },
  0x8f: {
    asm: 'RES 1, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 1);
    },
  },
  0x9f: {
    asm: 'RES 3, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 3);
    },
  },
  0xaf: {
    asm: 'RES 5, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 5);
    },
  },
  0xbf: {
    asm: 'RES 7, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.registers.a = RES(cpu.registers.a, 7);
    },
  },
  0x40: {
    asm: 'BIT 0, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x41: {
    asm: 'BIT 0, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x42: {
    asm: 'BIT 0, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x43: {
    asm: 'BIT 0, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x44: {
    asm: 'BIT 0, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x45: {
    asm: 'BIT 0, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x46: {
    asm: 'BIT 0, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x47: {
    asm: 'BIT 0, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 0) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x48: {
    asm: 'BIT 1, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x49: {
    asm: 'BIT 1, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x4a: {
    asm: 'BIT 1, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x4b: {
    asm: 'BIT 1, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x4c: {
    asm: 'BIT 1, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x4d: {
    asm: 'BIT 1, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x4e: {
    asm: 'BIT 1, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x4f: {
    asm: 'BIT 1, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 1) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x50: {
    asm: 'BIT 2, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x51: {
    asm: 'BIT 2, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x52: {
    asm: 'BIT 2, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x53: {
    asm: 'BIT 2, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x54: {
    asm: 'BIT 2, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x55: {
    asm: 'BIT 2, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x56: {
    asm: 'BIT 2, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x57: {
    asm: 'BIT 2, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 2) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x58: {
    asm: 'BIT 3, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x59: {
    asm: 'BIT 3, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x5a: {
    asm: 'BIT 3, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x5b: {
    asm: 'BIT 3, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x5c: {
    asm: 'BIT 3, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x5d: {
    asm: 'BIT 3, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x5e: {
    asm: 'BIT 3, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x5f: {
    asm: 'BIT 3, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 3) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x60: {
    asm: 'BIT 4, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x61: {
    asm: 'BIT 4, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x62: {
    asm: 'BIT 4, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x63: {
    asm: 'BIT 4, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x64: {
    asm: 'BIT 4, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x65: {
    asm: 'BIT 4, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x66: {
    asm: 'BIT 4, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x67: {
    asm: 'BIT 4, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 4) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x68: {
    asm: 'BIT 5, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  // nice
  0x69: {
    asm: 'BIT 5, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x6a: {
    asm: 'BIT 5, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x6b: {
    asm: 'BIT 5, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x6c: {
    asm: 'BIT 5, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x6d: {
    asm: 'BIT 5, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x6e: {
    asm: 'BIT 5, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x6f: {
    asm: 'BIT 5, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 5) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x70: {
    asm: 'BIT 6, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x71: {
    asm: 'BIT 6, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x72: {
    asm: 'BIT 6, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x73: {
    asm: 'BIT 6, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x74: {
    asm: 'BIT 6, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x75: {
    asm: 'BIT 6, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x76: {
    asm: 'BIT 6, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x77: {
    asm: 'BIT 6, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 6) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x78: {
    asm: 'BIT 7, B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.b, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x79: {
    asm: 'BIT 7, C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.c, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x7a: {
    asm: 'BIT 7, D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.d, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x7b: {
    asm: 'BIT 7, E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.e, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x7c: {
    asm: 'BIT 7, H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.h, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x7d: {
    asm: 'BIT 7, L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.l, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x7e: {
    asm: 'BIT 7, [HL]',
    size: 1,
    cycles: 3,
    fn: (cpu: CPU): void => {
      const address = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(address);
      cpu.setFlags({
        Z: BIT(value, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x7f: {
    asm: 'BIT 7, A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: BIT(cpu.registers.a, 7) ? FlagState.FALSE : FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
      });
    },
  },
  0x38: {
    asm: 'SRL B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x39: {
    asm: 'SRL C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x3a: {
    asm: 'SRL D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x3b: {
    asm: 'SRL E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x3c: {
    asm: 'SRL H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x3d: {
    asm: 'SRL L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x3e: {
    asm: 'SRL [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x3f: {
    asm: 'SRL A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x18: {
    asm: 'RR B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.b, cpu.getFlags().C);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x19: {
    asm: 'RR C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.c, cpu.getFlags().C);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x1a: {
    asm: 'RR D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.d, cpu.getFlags().C);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x1b: {
    asm: 'RR E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.e, cpu.getFlags().C);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x1c: {
    asm: 'RR H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.h, cpu.getFlags().C);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x1d: {
    asm: 'RR L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.l, cpu.getFlags().C);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x1e: {
    asm: 'RR [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x1f: {
    asm: 'RR A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x00: {
    asm: 'RLC B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x01: {
    asm: 'RLC C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x02: {
    asm: 'RLC D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x03: {
    asm: 'RLC E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x04: {
    asm: 'RLC H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x05: {
    asm: 'RLC L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x06: {
    asm: 'RLC [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x07: {
    asm: 'RLC A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RLC(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x08: {
    asm: 'RRC B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x09: {
    asm: 'RRC C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x0a: {
    asm: 'RRC D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x0b: {
    asm: 'RRC E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x0c: {
    asm: 'RRC H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x0d: {
    asm: 'RRC L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x0e: {
    asm: 'RRC [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x0f: {
    asm: 'RRC A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RRC(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x10: {
    asm: 'RL B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.b, cpu.getFlags().C);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x11: {
    asm: 'RL C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.c, cpu.getFlags().C);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x12: {
    asm: 'RL D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.d, cpu.getFlags().C);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x13: {
    asm: 'RL E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.e, cpu.getFlags().C);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x14: {
    asm: 'RL H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.h, cpu.getFlags().C);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x15: {
    asm: 'RL L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.l, cpu.getFlags().C);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x16: {
    asm: 'RL [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x17: {
    asm: 'RL A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = RL(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x20: {
    asm: 'SLA B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x21: {
    asm: 'SLA C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x22: {
    asm: 'SLA D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x23: {
    asm: 'SLA E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x24: {
    asm: 'SLA H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x25: {
    asm: 'SLA L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x26: {
    asm: 'SLA [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x27: {
    asm: 'SLA A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SLA(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x28: {
    asm: 'SRA B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x29: {
    asm: 'SRA C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x2a: {
    asm: 'SRA D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x2b: {
    asm: 'SRA E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x2c: {
    asm: 'SRA H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x2d: {
    asm: 'SRA L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x2e: {
    asm: 'SRA [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x2f: {
    asm: 'SRA A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRA(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
    },
  },
  0x30: {
    asm: 'SWAP B',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.b);
      cpu.registers.b = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x31: {
    asm: 'SWAP C',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.c);
      cpu.registers.c = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x32: {
    asm: 'SWAP D',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.d);
      cpu.registers.d = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x33: {
    asm: 'SWAP E',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.e);
      cpu.registers.e = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x34: {
    asm: 'SWAP H',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.h);
      cpu.registers.h = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x35: {
    asm: 'SWAP L',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.l);
      cpu.registers.l = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x36: {
    asm: 'SWAP [HL]',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
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
    },
  },
  0x37: {
    asm: 'SWAP A',
    size: 1,
    cycles: 2,
    fn: (cpu: CPU): void => {
      const value = SWAP(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: value === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
};
