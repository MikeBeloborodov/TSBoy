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
};
