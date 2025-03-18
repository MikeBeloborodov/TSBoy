import { CPU } from './CPU';
import { CombinedRegister, InstructionsMap } from './types';

function SET(value: number, bit: number): number {
  return value | (1 << bit);
}

export const PrefixInstructions: InstructionsMap = {
  0xc0: {
    asm: 'SET 0, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 0);
    },
  },
  0xd0: {
    asm: 'SET 2, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 2);
    },
  },
  0xe0: {
    asm: 'SET 4, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 4);
    },
  },
  0xf0: {
    asm: 'SET 6, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 6);
    },
  },
  0xc1: {
    asm: 'SET 0, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 0);
    },
  },
  0xd1: {
    asm: 'SET 2, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 2);
    },
  },
  0xe1: {
    asm: 'SET 4, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 4);
    },
  },
  0xf1: {
    asm: 'SET 6, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 6);
    },
  },
  0xc2: {
    asm: 'SET 0, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 0);
    },
  },
  0xd2: {
    asm: 'SET 2, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 2);
    },
  },
  0xe2: {
    asm: 'SET 4, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 4);
    },
  },
  0xf2: {
    asm: 'SET 6, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 6);
    },
  },
  0xc3: {
    asm: 'SET 0, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 0);
    },
  },
  0xd3: {
    asm: 'SET 2, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 2);
    },
  },
  0xe3: {
    asm: 'SET 4, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 4);
    },
  },
  0xf3: {
    asm: 'SET 6, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 6);
    },
  },
  0xc4: {
    asm: 'SET 0, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 0);
    },
  },
  0xd4: {
    asm: 'SET 2, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 2);
    },
  },
  0xe4: {
    asm: 'SET 4, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 4);
    },
  },
  0xf4: {
    asm: 'SET 6, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 6);
    },
  },
  0xc5: {
    asm: 'SET 0, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 0);
    },
  },
  0xd5: {
    asm: 'SET 2, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 2);
    },
  },
  0xe5: {
    asm: 'SET 4, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 4);
    },
  },
  0xf5: {
    asm: 'SET 6, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 6);
    },
  },
  0xc6: {
    asm: 'SET 0, [HL]',
    size: 1,
    cycles: 8,
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
    cycles: 8,
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
    cycles: 8,
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
    cycles: 8,
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
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 0);
    },
  },
  0xd7: {
    asm: 'SET 2, A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 2);
    },
  },
  0xe7: {
    asm: 'SET 4, A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 4);
    },
  },
  0xf7: {
    asm: 'SET 6, A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 6);
    },
  },
  0xc8: {
    asm: 'SET 1, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 1);
    },
  },
  0xd8: {
    asm: 'SET 3, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 3);
    },
  },
  0xe8: {
    asm: 'SET 5, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 5);
    },
  },
  0xf8: {
    asm: 'SET 7, B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.b = SET(cpu.registers.b, 7);
    },
  },
  0xc9: {
    asm: 'SET 1, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 1);
    },
  },
  0xd9: {
    asm: 'SET 3, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 3);
    },
  },
  0xe9: {
    asm: 'SET 5, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 5);
    },
  },
  0xf9: {
    asm: 'SET 7, C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.c = SET(cpu.registers.c, 7);
    },
  },
  0xca: {
    asm: 'SET 1, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 1);
    },
  },
  0xda: {
    asm: 'SET 3, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 3);
    },
  },
  0xea: {
    asm: 'SET 5, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 5);
    },
  },
  0xfa: {
    asm: 'SET 7, D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.d = SET(cpu.registers.d, 7);
    },
  },
  0xcb: {
    asm: 'SET 1, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 1);
    },
  },
  0xdb: {
    asm: 'SET 3, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 3);
    },
  },
  0xeb: {
    asm: 'SET 5, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 5);
    },
  },
  0xfb: {
    asm: 'SET 7, E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.e = SET(cpu.registers.e, 7);
    },
  },
  0xcc: {
    asm: 'SET 1, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 1);
    },
  },
  0xdc: {
    asm: 'SET 3, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 3);
    },
  },
  0xec: {
    asm: 'SET 5, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 5);
    },
  },
  0xfc: {
    asm: 'SET 7, H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.h = SET(cpu.registers.h, 7);
    },
  },
  0xcd: {
    asm: 'SET 1, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 1);
    },
  },
  0xdd: {
    asm: 'SET 3, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 3);
    },
  },
  0xed: {
    asm: 'SET 5, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 5);
    },
  },
  0xfd: {
    asm: 'SET 7, L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.l = SET(cpu.registers.l, 7);
    },
  },
  0xce: {
    asm: 'SET 1, [HL]',
    size: 1,
    cycles: 16,
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
    cycles: 16,
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
    cycles: 16,
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
    cycles: 16,
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
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 1);
    },
  },
  0xdf: {
    asm: 'SET 3, A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 3);
    },
  },
  0xef: {
    asm: 'SET 5, A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 5);
    },
  },
  0xff: {
    asm: 'SET 7, A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.registers.a = SET(cpu.registers.a, 7);
    },
  },
};
