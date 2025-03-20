import { CPU } from './CPU';
import { PrefixInstructions, RR, SRL } from './prefixInstructions';
import { CombinedRegister, FlagState, InstructionsMap } from './types';
import {
  isCarrySubstraction,
  isCarrySum,
  isHalfCarrySubstraction,
  isHalfCarrySum,
  signed8bit,
  substractThreeValuesWithCarryInfo,
  sumThreeValuesWithCarryInfo,
  unsignedAddition,
  unsignedSubtract,
} from './utils';

export const Instructions: InstructionsMap = {
  0xcb: {
    asm: 'PREFIX CB',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const instruction = cpu.memRead(cpu.pc);
      const prefixInstruction = PrefixInstructions[instruction];
      if (!prefixInstruction) {
        throw new Error(
          `Unknown prefix instruction ${instruction.toString(16)}`
        );
      }
      prefixInstruction.fn(cpu);
      cpu.incrementProgramCounter(1);
    },
  },
  0x00: {
    asm: `NOP`,
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0xc3: {
    asm: 'JP a16',
    size: 3,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const jumpAddress = (b << 8) | a;
      cpu.pc = jumpAddress;
    },
  },
  0xaf: {
    asm: 'XOR A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      cpu.registers.a = 0;
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
    },
  },
  0x05: {
    asm: 'DEC B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.b, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.b, 1);
      cpu.registers.b = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x15: {
    asm: 'DEC D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.d, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.d, 1);
      cpu.registers.d = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x25: {
    asm: 'DEC H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.h, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.h, 1);
      cpu.registers.h = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x35: {
    asm: 'DEC [HL]',
    size: 1,
    cycles: 12,
    fn: (cpu: CPU): void => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const result = unsignedSubtract(value, 1, 8);
      const HC = isHalfCarrySubstraction(value, 1);
      cpu.memWrite(cpu.getCombinedRegister(CombinedRegister.HL), result);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x0d: {
    asm: 'DEC C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.c, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.c, 1);
      cpu.registers.c = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x1d: {
    asm: 'DEC E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.e, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.e, 1);
      cpu.registers.e = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x2d: {
    asm: 'DEC L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.l, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.l, 1);
      cpu.registers.l = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x3d: {
    asm: 'DEC A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, 1, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.a, 1);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x20: {
    asm: 'JR NZ, e8',
    size: 2,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = signed8bit(cpu.memRead(cpu.pc));
      cpu.incrementProgramCounter(1);
      if (!cpu.getFlags().Z) {
        cpu.pc += value;
      }
    },
  },
  0xf3: {
    asm: `DI`,
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      // TODO: Implement disable interrupt
      cpu.incrementProgramCounter(1);
    },
  },
  0x40: {
    asm: 'LD B, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x41: {
    asm: 'LD B, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.b = cpu.registers.c;
      cpu.incrementProgramCounter(1);
    },
  },
  0x42: {
    asm: 'LD B, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.b = cpu.registers.d;
      cpu.incrementProgramCounter(1);
    },
  },
  0x43: {
    asm: 'LD B, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.b = cpu.registers.e;
      cpu.incrementProgramCounter(1);
    },
  },
  0x44: {
    asm: 'LD B, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.b = cpu.registers.h;
      cpu.incrementProgramCounter(1);
    },
  },
  0x45: {
    asm: 'LD B, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.b = cpu.registers.l;
      cpu.incrementProgramCounter(1);
    },
  },
  0x46: {
    asm: 'LD B, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.b = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x47: {
    asm: 'LD B, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.b = cpu.registers.a;
      cpu.incrementProgramCounter(1);
    },
  },
  0x48: {
    asm: 'LD C, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.c = cpu.registers.b;
      cpu.incrementProgramCounter(1);
    },
  },
  0x49: {
    asm: 'LD C, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x4a: {
    asm: 'LD C, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.c = cpu.registers.d;
      cpu.incrementProgramCounter(1);
    },
  },
  0x4b: {
    asm: 'LD C, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.c = cpu.registers.e;
      cpu.incrementProgramCounter(1);
    },
  },
  0x4c: {
    asm: 'LD C, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.c = cpu.registers.h;
      cpu.incrementProgramCounter(1);
    },
  },
  0x4d: {
    asm: 'LD C, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.c = cpu.registers.l;
      cpu.incrementProgramCounter(1);
    },
  },
  0x4e: {
    asm: 'LD C, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.c = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x4f: {
    asm: 'LD C, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.c = cpu.registers.a;
      cpu.incrementProgramCounter(1);
    },
  },
  0x50: {
    asm: 'LD D, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.d = cpu.registers.b;
      cpu.incrementProgramCounter(1);
    },
  },
  0x51: {
    asm: 'LD D, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.d = cpu.registers.c;
      cpu.incrementProgramCounter(1);
    },
  },
  0x52: {
    asm: 'LD D, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x53: {
    asm: 'LD D, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.d = cpu.registers.e;
      cpu.incrementProgramCounter(1);
    },
  },
  0x54: {
    asm: 'LD D, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.d = cpu.registers.h;
      cpu.incrementProgramCounter(1);
    },
  },
  0x55: {
    asm: 'LD D, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.d = cpu.registers.l;
      cpu.incrementProgramCounter(1);
    },
  },
  0x56: {
    asm: 'LD D, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.d = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x57: {
    asm: 'LD D, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.d = cpu.registers.a;
      cpu.incrementProgramCounter(1);
    },
  },
  0x58: {
    asm: 'LD E, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.e = cpu.registers.b;
      cpu.incrementProgramCounter(1);
    },
  },
  0x59: {
    asm: 'LD E, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.e = cpu.registers.c;
      cpu.incrementProgramCounter(1);
    },
  },
  0x5a: {
    asm: 'LD E, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.e = cpu.registers.d;
      cpu.incrementProgramCounter(1);
    },
  },
  0x5b: {
    asm: 'LD E, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x5c: {
    asm: 'LD E, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.e = cpu.registers.h;
      cpu.incrementProgramCounter(1);
    },
  },
  0x5d: {
    asm: 'LD E, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.e = cpu.registers.l;
      cpu.incrementProgramCounter(1);
    },
  },
  0x5e: {
    asm: 'LD E, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.e = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x5f: {
    asm: 'LD E, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.e = cpu.registers.a;
      cpu.incrementProgramCounter(1);
    },
  },
  0x60: {
    asm: 'LD H, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.h = cpu.registers.b;
      cpu.incrementProgramCounter(1);
    },
  },
  0x61: {
    asm: 'LD H, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.h = cpu.registers.c;
      cpu.incrementProgramCounter(1);
    },
  },
  0x62: {
    asm: 'LD H, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.h = cpu.registers.d;
      cpu.incrementProgramCounter(1);
    },
  },
  0x63: {
    asm: 'LD H, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.h = cpu.registers.e;
      cpu.incrementProgramCounter(1);
    },
  },
  0x64: {
    asm: 'LD H, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x65: {
    asm: 'LD H, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.h = cpu.registers.l;
      cpu.incrementProgramCounter(1);
    },
  },
  0x66: {
    asm: 'LD H, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.h = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x67: {
    asm: 'LD H, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.h = cpu.registers.a;
      cpu.incrementProgramCounter(1);
    },
  },
  0x68: {
    asm: 'LD L, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.l = cpu.registers.b;
      cpu.incrementProgramCounter(1);
    },
  },
  0x69: {
    asm: 'LD L, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.l = cpu.registers.c;
      cpu.incrementProgramCounter(1);
    },
  },
  0x6a: {
    asm: 'LD L, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.l = cpu.registers.d;
      cpu.incrementProgramCounter(1);
    },
  },
  0x6b: {
    asm: 'LD L, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.l = cpu.registers.e;
      cpu.incrementProgramCounter(1);
    },
  },
  0x6c: {
    asm: 'LD L, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.l = cpu.registers.h;
      cpu.incrementProgramCounter(1);
    },
  },
  0x6d: {
    asm: 'LD L, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x6e: {
    asm: 'LD L, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.l = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x6f: {
    asm: 'LD L, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.l = cpu.registers.a;
      cpu.incrementProgramCounter(1);
    },
  },
  0x70: {
    asm: 'LD [HL], B',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.b);
      cpu.incrementProgramCounter(1);
    },
  },
  0x71: {
    asm: 'LD [HL], C',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.c);
      cpu.incrementProgramCounter(1);
    },
  },
  0x72: {
    asm: 'LD [HL], D',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.d);
      cpu.incrementProgramCounter(1);
    },
  },
  0x73: {
    asm: 'LD [HL], E',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.e);
      cpu.incrementProgramCounter(1);
    },
  },
  0x74: {
    asm: 'LD [HL], H',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.h);
      cpu.incrementProgramCounter(1);
    },
  },
  0x75: {
    asm: 'LD [HL], L',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.l);
      cpu.incrementProgramCounter(1);
    },
  },
  // 0x76: {
  //   asm: 'HALT',
  //   size: 1,
  //   cycles: 4,
  //   fn: (cpu: CPU): void => {
  //     // TODO: Implement HALT
  //   }
  // },
  0x77: {
    asm: 'LD [HL], A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.a);
      cpu.incrementProgramCounter(1);
    },
  },
  0x78: {
    asm: 'LD A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.b;
      cpu.incrementProgramCounter(1);
    },
  },
  0x79: {
    asm: 'LD A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.c;
      cpu.incrementProgramCounter(1);
    },
  },
  0x7a: {
    asm: 'LD A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.d;
      cpu.incrementProgramCounter(1);
    },
  },
  0x7b: {
    asm: 'LD A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.e;
      cpu.incrementProgramCounter(1);
    },
  },
  0x7c: {
    asm: 'LD A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.h;
      cpu.incrementProgramCounter(1);
    },
  },
  0x7d: {
    asm: 'LD A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.l;
      cpu.incrementProgramCounter(1);
    },
  },
  0x7e: {
    asm: 'LD A, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.a = cpu.memRead(hl);
      cpu.incrementProgramCounter(1);
    },
  },
  0x7f: {
    asm: 'LD A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
    },
  },
  0x01: {
    asm: 'LD BC, n16',
    size: 3,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const value = (b << 8) | a;
      cpu.setCombinedRegister(CombinedRegister.BC, value);
      cpu.incrementProgramCounter(1);
    },
  },
  0x11: {
    asm: 'LD DE, n16',
    size: 3,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const value = (b << 8) | a;
      cpu.setCombinedRegister(CombinedRegister.DE, value);
      cpu.incrementProgramCounter(1);
    },
  },
  0x21: {
    asm: 'LD HL, n16',
    size: 3,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const value = (b << 8) | a;
      cpu.setCombinedRegister(CombinedRegister.HL, value);
      cpu.incrementProgramCounter(1);
    },
  },
  0x31: {
    asm: 'LD SP, n16',
    size: 3,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const value = (b << 8) | a;
      cpu.sp = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x02: {
    asm: 'LD [BC], A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      cpu.memWrite(bc, cpu.registers.a);
      cpu.incrementProgramCounter(1);
    },
  },
  0x12: {
    asm: 'LD [DE], A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      cpu.memWrite(de, cpu.registers.a);
      cpu.incrementProgramCounter(1);
    },
  },
  0x22: {
    asm: 'LD [HL+], A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.a);
      cpu.setCombinedRegister(CombinedRegister.HL, hl + 1);
      cpu.incrementProgramCounter(1);
    },
  },
  0x32: {
    asm: 'LD [HL-], A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.a);
      cpu.setCombinedRegister(CombinedRegister.HL, hl - 1);
      cpu.incrementProgramCounter(1);
    },
  },
  0x06: {
    asm: 'LD B, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.b = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x16: {
    asm: 'LD D, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.d = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x26: {
    asm: 'LD H, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.h = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x36: {
    asm: 'LD [HL], n8',
    size: 2,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, value);
      cpu.incrementProgramCounter(1);
    },
  },
  0x0a: {
    asm: 'LD A, [BC]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      cpu.registers.a = cpu.memRead(bc);
      cpu.incrementProgramCounter(1);
    },
  },
  0x1a: {
    asm: 'LD A, [DE]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      cpu.registers.a = cpu.memRead(de);
      cpu.incrementProgramCounter(1);
    },
  },
  0x2a: {
    asm: 'LD A, [HL+]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.a = cpu.memRead(hl);
      cpu.setCombinedRegister(CombinedRegister.HL, hl + 1);
      cpu.incrementProgramCounter(1);
    },
  },
  0x3a: {
    asm: 'LD A, [HL-]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.a = cpu.memRead(hl);
      cpu.setCombinedRegister(CombinedRegister.HL, hl - 1);
      cpu.incrementProgramCounter(1);
    },
  },
  0x0e: {
    asm: 'LD C, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.c = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x1e: {
    asm: 'LD E, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.e = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x2e: {
    asm: 'LD L, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.l = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x3e: {
    asm: 'LD A, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.a = value;
      cpu.incrementProgramCounter(1);
    },
  },
  0x08: {
    asm: 'LD [a16], SP',
    size: 3,
    cycles: 20,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const address = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      cpu.memWrite(address, cpu.sp & 0xff);
      cpu.memWrite(address + 1, (cpu.sp & 0xff00) >> 8);
    },
  },
  0xe0: {
    asm: 'LDH [a8], A',
    size: 2,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const address = (0xff << 8) | value;
      cpu.incrementProgramCounter(1);
      cpu.memWrite(address, cpu.registers.a);
    },
  },
  0xf0: {
    asm: 'LDH A, [a8]',
    size: 2,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const address = (0xff << 8) | value;
      cpu.incrementProgramCounter(1);
      cpu.registers.a = cpu.memRead(address);
    },
  },
  0xe2: {
    asm: 'LD [C], A',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const address = (0xff << 8) | cpu.registers.c;
      cpu.memWrite(address, cpu.registers.a);
      cpu.incrementProgramCounter(1);
    },
  },
  0xf2: {
    asm: 'LD A, [C]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const address = (0xff << 8) | cpu.registers.c;
      cpu.registers.a = cpu.memRead(address);
      cpu.incrementProgramCounter(1);
    },
  },
  0xea: {
    asm: 'LD [a16], A',
    size: 3,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const address = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      cpu.memWrite(address, cpu.registers.a);
    },
  },
  0xfa: {
    asm: 'LD A, [a16]',
    size: 3,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const address = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      cpu.registers.a = cpu.memRead(address);
    },
  },
  0xf9: {
    asm: 'LD SP, HL',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.sp = hl;
      cpu.incrementProgramCounter(1);
    },
  },
  // 0xf8: {
  //   asm: 'LD HL, SP+r8',
  //   size: 2,
  //   cycles: 12,
  //   fn: (cpu: CPU): void => {
  //     cpu.incrementProgramCounter(1);
  //     const value = cpu.memRead(cpu.pc);
  //     const result = unsignedAddition(cpu.sp, value, 16);

  //   }
  // },
  0x0c: {
    asm: 'INC C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.c, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.c, 1);
      cpu.registers.c = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x1c: {
    asm: 'INC E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.e, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.e, 1);
      cpu.registers.e = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x2c: {
    asm: 'INC L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.l, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.l, 1);
      cpu.registers.l = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x3c: {
    asm: 'INC A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.a, 1);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x04: {
    asm: 'INC B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.b, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.b, 1);
      cpu.registers.b = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x14: {
    asm: 'INC D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.d, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.d, 1);
      cpu.registers.d = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x24: {
    asm: 'INC H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.h, 1, 8);
      const HC = isHalfCarrySum(cpu.registers.h, 1);
      cpu.registers.h = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x34: {
    asm: 'INC [HL]',
    size: 1,
    cycles: 12,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(hl);
      const result = unsignedAddition(value, 1, 8);
      const HC = isHalfCarrySum(value, 1);
      cpu.memWrite(hl, result);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xcd: {
    asm: 'CALL a16',
    size: 3,
    cycles: 24,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const address = (b << 8) | a;
      cpu.pushStack(cpu.pc);
      cpu.pc = address;
    },
  },
  0x18: {
    asm: 'JR r8',
    size: 2,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = signed8bit(cpu.memRead(cpu.pc));
      cpu.incrementProgramCounter(1);
      cpu.pc += value;
    },
  },
  0x28: {
    asm: 'JR Z, r8',
    size: 2,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = signed8bit(cpu.memRead(cpu.pc));
      cpu.incrementProgramCounter(1);
      if (cpu.getFlags().Z) {
        cpu.pc += value;
      }
    },
  },
  0x38: {
    asm: 'JR C, r8',
    size: 2,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = signed8bit(cpu.memRead(cpu.pc));
      cpu.incrementProgramCounter(1);
      if (cpu.getFlags().C) {
        cpu.pc += value;
      }
    },
  },
  0xc9: {
    asm: 'RET',
    size: 1,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.pc = cpu.popStack();
    },
  },
  0xe9: {
    asm: 'JP (HL)',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.pc = cpu.getCombinedRegister(CombinedRegister.HL);
    },
  },
  0xc6: {
    asm: 'ADD A, n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const result = unsignedAddition(cpu.registers.a, value, 8);
      const H = isHalfCarrySum(cpu.registers.a, value);
      const C = isCarrySum(cpu.registers.a, value);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xd6: {
    asm: 'SUB A n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const result = unsignedSubtract(cpu.registers.a, value, 8);
      const H = isHalfCarrySubstraction(cpu.registers.a, value);
      const C = isCarrySubstraction(cpu.registers.a, value, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x30: {
    asm: 'JR NC, r8',
    size: 2,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = signed8bit(cpu.memRead(cpu.pc));
      cpu.incrementProgramCounter(1);
      if (!cpu.getFlags().C) {
        cpu.pc += value;
      }
    },
  },
  0xc1: {
    asm: 'POP BC',
    size: 1,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.setCombinedRegister(CombinedRegister.BC, cpu.popStack());
      cpu.incrementProgramCounter(1);
    },
  },
  0xd1: {
    asm: 'POP DE',
    size: 1,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.setCombinedRegister(CombinedRegister.DE, cpu.popStack());
      cpu.incrementProgramCounter(1);
    },
  },
  0xe1: {
    asm: 'POP HL',
    size: 1,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.setCombinedRegister(CombinedRegister.HL, cpu.popStack());
      cpu.incrementProgramCounter(1);
    },
  },
  0xf1: {
    asm: 'POP AF',
    size: 1,
    cycles: 12,
    fn: (cpu: CPU): void => {
      cpu.setCombinedRegister(CombinedRegister.AF, cpu.popStack());
      cpu.incrementProgramCounter(1);
    },
  },
  0xc5: {
    asm: 'PUSH BC',
    size: 1,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.BC));
      cpu.incrementProgramCounter(1);
    },
  },
  0xd5: {
    asm: 'PUSH DE',
    size: 1,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.DE));
      cpu.incrementProgramCounter(1);
    },
  },
  0xe5: {
    asm: 'PUSH HL',
    size: 1,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.incrementProgramCounter(1);
    },
  },
  0xf5: {
    asm: 'PUSH AF',
    size: 1,
    cycles: 16,
    fn: (cpu: CPU): void => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.AF));
      cpu.incrementProgramCounter(1);
    },
  },
  0x03: {
    asm: 'INC BC',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(
        cpu.getCombinedRegister(CombinedRegister.BC),
        1,
        16
      );
      cpu.setCombinedRegister(CombinedRegister.BC, result);
      cpu.incrementProgramCounter(1);
    },
  },
  0x13: {
    asm: 'INC DE',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(
        cpu.getCombinedRegister(CombinedRegister.DE),
        1,
        16
      );
      cpu.setCombinedRegister(CombinedRegister.DE, result);
      cpu.incrementProgramCounter(1);
    },
  },
  0x23: {
    asm: 'INC HL',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(
        cpu.getCombinedRegister(CombinedRegister.HL),
        1,
        16
      );
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.incrementProgramCounter(1);
    },
  },
  0x33: {
    asm: 'INC SP',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.sp, 1, 16);
      cpu.sp = result;
      cpu.incrementProgramCounter(1);
    },
  },
  0x80: {
    asm: 'ADD A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.b, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.b);
      const C = isCarrySum(cpu.registers.a, cpu.registers.b);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x81: {
    asm: 'ADD A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.c, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.c);
      const C = isCarrySum(cpu.registers.a, cpu.registers.c);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x82: {
    asm: 'ADD A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.d, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.d);
      const C = isCarrySum(cpu.registers.a, cpu.registers.d);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x83: {
    asm: 'ADD A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.e, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.e);
      const C = isCarrySum(cpu.registers.a, cpu.registers.e);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x84: {
    asm: 'ADD A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.h, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.h);
      const C = isCarrySum(cpu.registers.a, cpu.registers.h);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x85: {
    asm: 'ADD A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.l, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.l);
      const C = isCarrySum(cpu.registers.a, cpu.registers.l);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x86: {
    asm: 'ADD A, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(hl);
      const result = unsignedAddition(cpu.registers.a, value, 8);
      const H = isHalfCarrySum(cpu.registers.a, value);
      const C = isCarrySum(cpu.registers.a, value);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x87: {
    asm: 'ADD A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedAddition(cpu.registers.a, cpu.registers.a, 8);
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.a);
      const C = isCarrySum(cpu.registers.a, cpu.registers.a);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x88: {
    asm: 'ADC A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.b,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x89: {
    asm: 'ADC A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.c,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x8a: {
    asm: 'ADC A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.d,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x8b: {
    asm: 'ADC A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.e,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x8c: {
    asm: 'ADC A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.h,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x8d: {
    asm: 'ADC A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.l,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x8e: {
    asm: 'ADC A, [HL]',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(hl);
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        value,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x8f: {
    asm: 'ADC A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.a,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x90: {
    asm: 'SUB A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.b, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.b
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.b, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x91: {
    asm: 'SUB A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.c, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.c
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.c, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x92: {
    asm: 'SUB A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.d, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.d
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.d, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x93: {
    asm: 'SUB A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.e, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.e
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.e, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x94: {
    asm: 'SUB A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.h, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.h
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.h, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x95: {
    asm: 'SUB A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.l, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.l
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.l, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x96: {
    asm: 'SUB A, (HL)',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const result = unsignedSubtract(cpu.registers.a, value, 8);
      const halfCarry = isHalfCarrySubstraction(cpu.registers.a, value);
      const carry = isCarrySubstraction(cpu.registers.a, value, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x97: {
    asm: 'SUB A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = 0;
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.TRUE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x98: {
    asm: 'SBC A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.b,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x99: {
    asm: 'SBC A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.c,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x9a: {
    asm: 'SBC A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.d,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x9b: {
    asm: 'SBC A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.e,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x9c: {
    asm: 'SBC A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.h,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x9d: {
    asm: 'SBC A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        cpu.registers.l,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x9e: {
    asm: 'SBC A, (HL)',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const C = cpu.getFlags().C;
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        value,
        C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  // TODO CHECK IT COULD BE TROUBLE
  0x9f: {
    asm: 'SBC A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const C = cpu.getFlags().C;
      if (C) {
        cpu.setFlags({
          Z: FlagState.FALSE,
          N: FlagState.TRUE,
          H: FlagState.TRUE,
        });
        cpu.registers.a = 0xff;
        return;
      }
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.TRUE,
        H: FlagState.FALSE,
      });
      cpu.registers.a = 0;
    },
  },
  0xb0: {
    asm: 'OR A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.a | cpu.registers.b;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb1: {
    asm: 'OR A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.a | cpu.registers.c;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb2: {
    asm: 'OR A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.a | cpu.registers.d;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb3: {
    asm: 'OR A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.a | cpu.registers.e;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb4: {
    asm: 'OR A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.a | cpu.registers.h;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb5: {
    asm: 'OR A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a = cpu.registers.a | cpu.registers.l;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb6: {
    asm: 'OR A, (HL)',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.registers.a = cpu.registers.a | value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb7: {
    asm: 'OR A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb8: {
    asm: 'CP A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.b, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.b
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.b, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xb9: {
    asm: 'CP A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.c, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.c
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.c, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xba: {
    asm: 'CP A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.d, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.d
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.d, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xbb: {
    asm: 'CP A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.e, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.e
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.e, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xbc: {
    asm: 'CP A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.h, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.h
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.h, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xbd: {
    asm: 'CP A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.registers.a, cpu.registers.l, 8);
      const halfCarry = isHalfCarrySubstraction(
        cpu.registers.a,
        cpu.registers.l
      );
      const carry = isCarrySubstraction(cpu.registers.a, cpu.registers.l, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xbe: {
    asm: 'CP A, (HL)',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const result = unsignedSubtract(cpu.registers.a, value, 8);
      const halfCarry = isHalfCarrySubstraction(cpu.registers.a, value);
      const carry = isCarrySubstraction(cpu.registers.a, value, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xbf: {
    asm: 'CP A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.TRUE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xe6: {
    asm: 'AND d8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.a &= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xf6: {
    asm: 'OR d8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.a |= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xc4: {
    asm: 'CALL NZ, a16',
    size: 3,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const jumpAddress = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      if (!cpu.getFlags().Z) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
      }
    },
  },
  0xd4: {
    asm: 'CALL NC, a16',
    size: 3,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const jumpAddress = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      if (!cpu.getFlags().C) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
      }
    },
  },
  0xcc: {
    asm: 'CALL Z, a16',
    size: 3,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const jumpAddress = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      if (cpu.getFlags().Z) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
      }
    },
  },
  0xdc: {
    asm: 'CALL C, a16',
    size: 3,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const a = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const b = cpu.memRead(cpu.pc);
      const jumpAddress = (b << 8) | a;
      cpu.incrementProgramCounter(1);
      if (cpu.getFlags().C) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
      }
    },
  },
  0xa0: {
    asm: 'AND A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a &= cpu.registers.b;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa1: {
    asm: 'AND A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a &= cpu.registers.c;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa2: {
    asm: 'AND A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a &= cpu.registers.d;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa3: {
    asm: 'AND A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a &= cpu.registers.e;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa4: {
    asm: 'AND A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a &= cpu.registers.h;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa5: {
    asm: 'AND A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a &= cpu.registers.l;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa6: {
    asm: 'AND A, (HL)',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.registers.a &= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa7: {
    asm: 'AND A, A',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa8: {
    asm: 'XOR A, B',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a ^= cpu.registers.b;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xa9: {
    asm: 'XOR A, C',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a ^= cpu.registers.c;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xaa: {
    asm: 'XOR A, D',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a ^= cpu.registers.d;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xab: {
    asm: 'XOR A, E',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a ^= cpu.registers.e;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xac: {
    asm: 'XOR A, H',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a ^= cpu.registers.h;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xad: {
    asm: 'XOR A, L',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      cpu.registers.a ^= cpu.registers.l;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xae: {
    asm: 'XOR A, (HL)',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.registers.a ^= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x0f: {
    asm: 'RRCA',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { value, carry } = SRL(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x1f: {
    asm: 'RRA',
    size: 1,
    cycles: 4,
    fn: (cpu: CPU): void => {
      const { value, carry } = RR(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xce: {
    asm: 'ADC A, d8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        cpu.registers.a,
        value,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xde: {
    asm: 'SBC A, d8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const { result, halfCarry, carry } = substractThreeValuesWithCarryInfo(
        cpu.registers.a,
        value,
        cpu.getFlags().C
      );
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xee: {
    asm: 'XOR d8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.registers.a ^= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xfe: {
    asm: 'CP n8',
    size: 2,
    cycles: 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      const result = unsignedSubtract(cpu.registers.a, value, 8);
      const HC = isHalfCarrySubstraction(cpu.registers.a, value);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
        C: cpu.registers.a < value ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0xd0: {
    asm: 'RET NC',
    size: 1,
    cycles: 20,
    fn: (cpu: CPU): void => {
      if (!cpu.getFlags().C) {
        cpu.pc = cpu.popStack();
      } else {
        cpu.incrementProgramCounter(1);
      }
    },
  },
  0xc0: {
    asm: 'RET NZ',
    size: 1,
    cycles: 20,
    fn: (cpu: CPU): void => {
      if (!cpu.getFlags().Z) {
        cpu.pc = cpu.popStack();
      } else {
        cpu.incrementProgramCounter(1);
      }
    },
  },
  0xc8: {
    asm: 'RET Z',
    size: 1,
    cycles: 20,
    fn: (cpu: CPU): void => {
      if (cpu.getFlags().Z) {
        cpu.pc = cpu.popStack();
      } else {
        cpu.incrementProgramCounter(1);
      }
    },
  },
  0xd8: {
    asm: 'RET C',
    size: 1,
    cycles: 20,
    fn: (cpu: CPU): void => {
      if (cpu.getFlags().C) {
        cpu.pc = cpu.popStack();
      } else {
        cpu.incrementProgramCounter(1);
      }
    },
  },
  0x09: {
    asm: 'ADD HL, BC',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      const result = unsignedAddition(hl, bc, 16);
      const isHalfCarry = isHalfCarrySum(hl, bc, 16);
      const isCarry = isCarrySum(hl, bc, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x19: {
    asm: 'ADD HL, DE',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      const result = unsignedAddition(hl, de, 16);
      const isHalfCarry = isHalfCarrySum(hl, de, 16);
      const isCarry = isCarrySum(hl, de, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x29: {
    asm: 'ADD HL, HL',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = unsignedAddition(hl, hl, 16);
      let isHalfCarry = isHalfCarrySum(hl, hl, 16);
      const isCarry = isCarrySum(hl, hl, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x39: {
    asm: 'ADD HL, SP',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = unsignedAddition(hl, cpu.sp, 16);
      const isHalfCarry = isHalfCarrySum(hl, cpu.sp, 16);
      const isCarry = isCarrySum(hl, cpu.sp, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      cpu.incrementProgramCounter(1);
    },
  },
  0x0b: {
    asm: 'DEC BC',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      const result = unsignedSubtract(bc, 1, 16);
      cpu.setCombinedRegister(CombinedRegister.BC, result);
      cpu.incrementProgramCounter(1);
    },
  },
  0x1b: {
    asm: 'DEC DE',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      const result = unsignedSubtract(de, 1, 16);
      cpu.setCombinedRegister(CombinedRegister.DE, result);
      cpu.incrementProgramCounter(1);
    },
  },
  0x2b: {
    asm: 'DEC HL',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = unsignedSubtract(hl, 1, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.incrementProgramCounter(1);
    },
  },
  0x3b: {
    asm: 'DEC SP',
    size: 1,
    cycles: 8,
    fn: (cpu: CPU): void => {
      const result = unsignedSubtract(cpu.sp, 1, 16);
      cpu.sp = result;
      cpu.incrementProgramCounter(1);
    },
  },
  0xe8: {
    asm: 'ADD SP, e8',
    size: 2,
    cycles: 16,
    fn: (cpu: CPU): void => {
      // this instruction was nightmare
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      const signedValue = signed8bit(value);

      const newSp = (cpu.sp + signedValue) & 0xffff;

      const lowerByteSp = cpu.sp & 0xff;
      const lowerByteValue = signedValue & 0xff;
      const sumLowerNimble = (lowerByteSp & 0xf) + (lowerByteValue & 0xf);
      const isHalfCarry =
        sumLowerNimble > 0xf ? FlagState.TRUE : FlagState.FALSE;

      const sumLowerByte = (lowerByteSp + lowerByteValue) & 0x1ff;
      const isCarry = sumLowerByte > 0xff ? FlagState.TRUE : FlagState.FALSE;

      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: isHalfCarry,
        C: isCarry,
      });

      cpu.sp = newSp;
    },
  },
};
