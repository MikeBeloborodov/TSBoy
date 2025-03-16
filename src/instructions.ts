import { CPU } from './CPU';
import { CombinedRegister, FlagState, InstructionsMap } from './types';
import { isHalfCarrySubstraction, unsignedSubtract } from './utils';

export const Instructions: InstructionsMap = {
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
  0x20: {
    asm: 'JR NZ, e8',
    size: 2,
    cycles: 12 / 8,
    fn: (cpu: CPU): void => {
      cpu.incrementProgramCounter(1);
      const value = cpu.memRead(cpu.pc);
      cpu.incrementProgramCounter(1);
      if (cpu.getFlags().Z) {
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
};
