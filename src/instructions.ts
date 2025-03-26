import { CPU } from './CPU';
import { PrefixInstructions, RLC, RR, SRL, RL } from './prefixInstructions';
import { CombinedRegister, TCycles, FlagState, InstructionsMap } from './types';
import {
  isCarrySubtraction,
  isCarrySum,
  isHalfCarrySubtraction,
  isHalfCarrySum,
  signed8bit,
  subtractThreeValuesWithCarryInfo,
  sumThreeValuesWithCarryInfo,
} from './utils';

export const Instructions: InstructionsMap = {
  0x00: {
    meta: {
      asm: `NOP`,
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => 4,
  },
  0x01: {
    meta: {
      asm: 'LD BC, n16',
      size: 3,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeWord();
      cpu.setCombinedRegister(CombinedRegister.BC, value);
      return 12;
    },
  },
  0x02: {
    meta: {
      asm: 'LD [BC], A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      cpu.memWrite(bc, cpu.registers.a);
      return 8;
    },
  },
  0x03: {
    meta: {
      asm: 'INC BC',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      const result = (bc + 1) & 0xffff;
      cpu.setCombinedRegister(CombinedRegister.BC, result);
      return 8;
    },
  },
  0x04: {
    meta: {
      asm: 'INC B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.b + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.b, 1);
      cpu.registers.b = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x05: {
    meta: {
      asm: 'DEC B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.b - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.b, 1);
      cpu.registers.b = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x06: {
    meta: {
      asm: 'LD B, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.consumeByte();
      return 8;
    },
  },
  0x07: {
    meta: {
      asm: 'RLCA',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RLC(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x08: {
    meta: {
      asm: 'LD [a16], SP',
      size: 3,
      cycles: '20',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      cpu.memWrite(address, cpu.sp & 0xff);
      cpu.memWrite(address + 1, (cpu.sp & 0xff00) >> 8);
      return 20;
    },
  },
  0x09: {
    meta: {
      asm: 'ADD HL, BC',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      const result = (hl + bc) & 0xffff;
      const isHalfCarry = isHalfCarrySum(hl, bc, 16);
      const isCarry = isCarrySum(hl, bc, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x0a: {
    meta: {
      asm: 'LD A, [BC]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      cpu.registers.a = cpu.memRead(bc);
      return 8;
    },
  },
  0x0b: {
    meta: {
      asm: 'DEC BC',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const bc = cpu.getCombinedRegister(CombinedRegister.BC);
      const result = (bc - 1) & 0xffff;
      cpu.setCombinedRegister(CombinedRegister.BC, result);
      return 8;
    },
  },
  0x0c: {
    meta: {
      asm: 'INC C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.c + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.c, 1);
      cpu.registers.c = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x0d: {
    meta: {
      asm: 'DEC C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.c - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.c, 1);
      cpu.registers.c = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x0e: {
    meta: {
      asm: 'LD C, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.consumeByte();
      return 8;
    },
  },
  0x0f: {
    meta: {
      asm: 'RRCA',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = SRL(cpu.registers.a);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  // 0x10: {
  //   meta: {
  //     asm: 'STOP',
  //     size: 1,
  //     cycles: '4',
  //   },
  //   execute: (cpu: CPU): TCycles => {
  //     return 4;
  //   },
  // },
  0x11: {
    meta: {
      asm: 'LD DE, n16',
      size: 3,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setCombinedRegister(CombinedRegister.DE, cpu.consumeWord());
      return 12;
    },
  },
  0x12: {
    meta: {
      asm: 'LD [DE], A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      cpu.memWrite(de, cpu.registers.a);
      return 8;
    },
  },
  0x13: {
    meta: {
      asm: 'INC DE',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      const result = (de + 1) & 0xffff;
      cpu.setCombinedRegister(CombinedRegister.DE, result);
      return 8;
    },
  },
  0x14: {
    meta: {
      asm: 'INC D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.d + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.d, 1);
      cpu.registers.d = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x15: {
    meta: {
      asm: 'DEC D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.d - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.d, 1);
      cpu.registers.d = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x16: {
    meta: {
      asm: 'LD D, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.consumeByte();
      return 8;
    },
  },
  0x17: {
    meta: {
      asm: 'RLA',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RL(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x18: {
    meta: {
      asm: 'JR r8',
      size: 2,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const value = signed8bit(cpu.consumeByte());
      cpu.pc += value;
      return 12;
    },
  },
  0x19: {
    meta: {
      asm: 'ADD HL, DE',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      const result = (hl + de) & 0xffff;
      const isHalfCarry = isHalfCarrySum(hl, de, 16);
      const isCarry = isCarrySum(hl, de, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x1a: {
    meta: {
      asm: 'LD A, [DE]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      cpu.registers.a = cpu.memRead(de);
      return 8;
    },
  },
  0x1b: {
    meta: {
      asm: 'DEC DE',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const de = cpu.getCombinedRegister(CombinedRegister.DE);
      const result = (de - 1) & 0xffff;
      cpu.setCombinedRegister(CombinedRegister.DE, result);
      return 8;
    },
  },
  0x1c: {
    meta: {
      asm: 'INC E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.e + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.e, 1);
      cpu.registers.e = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x1d: {
    meta: {
      asm: 'DEC E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.e - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.e, 1);
      cpu.registers.e = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x1e: {
    meta: {
      asm: 'LD E, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.consumeByte();
      return 8;
    },
  },
  0x1f: {
    meta: {
      asm: 'RRA',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const { value, carry } = RR(cpu.registers.a, cpu.getFlags().C);
      cpu.registers.a = value;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x20: {
    meta: {
      asm: 'JR NZ, e8',
      size: 2,
      cycles: '12 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = signed8bit(cpu.consumeByte());
      if (!cpu.getFlags().Z) {
        cpu.pc += value;
        return 12;
      }
      return 8;
    },
  },
  0x21: {
    meta: {
      asm: 'LD HL, n16',
      size: 3,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setCombinedRegister(CombinedRegister.HL, cpu.consumeWord());
      return 12;
    },
  },
  0x22: {
    meta: {
      asm: 'LD [HL+], A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.a);
      cpu.setCombinedRegister(CombinedRegister.HL, hl + 1);
      return 8;
    },
  },
  0x23: {
    meta: {
      asm: 'INC HL',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = (hl + 1) & 0xffff;
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      return 8;
    },
  },
  0x24: {
    meta: {
      asm: 'INC H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.h + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.h, 1);
      cpu.registers.h = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x25: {
    meta: {
      asm: 'DEC H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.h - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.h, 1);
      cpu.registers.h = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x26: {
    meta: {
      asm: 'LD H, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.consumeByte();
      return 8;
    },
  },
  0x27: {
    meta: {
      asm: 'DAA',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      let adjust = 0;
      let isCarry = false;
      const isNFlag = cpu.getFlags().N;

      if (isNFlag) {
        if (cpu.getFlags().H) adjust += -0x06;
        if (cpu.getFlags().C) {
          adjust += -0x60;
          isCarry = true;
        }
      } else {
        if (cpu.getFlags().H || (cpu.registers.a & 0xf) > 9) adjust += 0x06;
        if (cpu.getFlags().C || cpu.registers.a > 0x99) {
          adjust += 0x60;
          isCarry = true;
        }
      }

      cpu.registers.a = (cpu.registers.a + adjust) & 0xff;

      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        H: FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x28: {
    meta: {
      asm: 'JR Z, r8',
      size: 2,
      cycles: '12 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = signed8bit(cpu.consumeByte());
      if (cpu.getFlags().Z) {
        cpu.pc += value;
        return 12;
      }
      return 8;
    },
  },
  0x29: {
    meta: {
      asm: 'ADD HL, HL',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = (hl + hl) & 0xffff;
      let isHalfCarry = isHalfCarrySum(hl, hl, 16);
      const isCarry = isCarrySum(hl, hl, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x2a: {
    meta: {
      asm: 'LD A, [HL+]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.a = cpu.memRead(hl);
      cpu.setCombinedRegister(CombinedRegister.HL, hl + 1);
      return 8;
    },
  },
  0x2b: {
    meta: {
      asm: 'DEC HL',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = (hl - 1) & 0xffff;
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      return 8;
    },
  },
  0x2c: {
    meta: {
      asm: 'INC L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.l + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.l, 1);
      cpu.registers.l = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x2d: {
    meta: {
      asm: 'DEC L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.l - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.l, 1);
      cpu.registers.l = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x2e: {
    meta: {
      asm: 'LD L, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.consumeByte();
      return 8;
    },
  },
  0x2f: {
    meta: {
      asm: 'CPL',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = ~cpu.registers.a;
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.TRUE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0x30: {
    meta: {
      asm: 'JR NC, r8',
      size: 2,
      cycles: '12 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = signed8bit(cpu.consumeByte());
      if (!cpu.getFlags().C) {
        cpu.pc += value;
        return 12;
      }
      return 8;
    },
  },
  0x31: {
    meta: {
      asm: 'LD SP, n16',
      size: 3,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.sp = cpu.consumeWord();
      return 12;
    },
  },
  0x32: {
    meta: {
      asm: 'LD [HL-], A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.a);
      cpu.setCombinedRegister(CombinedRegister.HL, hl - 1);
      return 8;
    },
  },
  0x33: {
    meta: {
      asm: 'INC SP',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.sp = (cpu.sp + 1) & 0xffff;
      return 8;
    },
  },
  0x34: {
    meta: {
      asm: 'INC [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(hl);
      const result = (value + 1) & 0xff;
      const HC = isHalfCarrySum(value, 1);
      cpu.memWrite(hl, result);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 12;
    },
  },
  0x35: {
    meta: {
      asm: 'DEC [HL]',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const result = (value - 1) & 0xff;
      const HC = isHalfCarrySubtraction(value, 1);
      cpu.memWrite(cpu.getCombinedRegister(CombinedRegister.HL), result);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 12;
    },
  },
  0x36: {
    meta: {
      asm: 'LD [HL], n8',
      size: 2,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.consumeByte());
      return 12;
    },
  },
  0x37: {
    meta: {
      asm: 'SCF',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.TRUE,
      });
      return 4;
    },
  },
  0x38: {
    meta: {
      asm: 'JR C, r8',
      size: 2,
      cycles: '12 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = signed8bit(cpu.consumeByte());
      if (cpu.getFlags().C) {
        cpu.pc += value;
        return 12;
      }
      return 8;
    },
  },
  0x39: {
    meta: {
      asm: 'ADD HL, SP',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const result = (hl + cpu.sp) & 0xffff;
      const isHalfCarry = isHalfCarrySum(hl, cpu.sp, 16);
      const isCarry = isCarrySum(hl, cpu.sp, 16);
      cpu.setCombinedRegister(CombinedRegister.HL, result);
      cpu.setFlags({
        N: FlagState.FALSE,
        H: isHalfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: isCarry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x3a: {
    meta: {
      asm: 'LD A, [HL-]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.a = cpu.memRead(hl);
      cpu.setCombinedRegister(CombinedRegister.HL, hl - 1);
      return 8;
    },
  },
  0x3b: {
    meta: {
      asm: 'DEC SP',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.sp - 1) & 0xffff;
      cpu.sp = result;
      return 8;
    },
  },
  0x3c: {
    meta: {
      asm: 'INC A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + 1) & 0xff;
      const HC = isHalfCarrySum(cpu.registers.a, 1);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x3d: {
    meta: {
      asm: 'DEC A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - 1) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.a, 1);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x3e: {
    meta: {
      asm: 'LD A, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.consumeByte();
      return 8;
    },
  },
  0x3f: {
    meta: {
      asm: 'CCF',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: cpu.getFlags().C ? FlagState.FALSE : FlagState.TRUE,
      });
      return 4;
    },
  },
  0x40: {
    meta: {
      asm: 'LD B, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => 4,
  },
  0x41: {
    meta: {
      asm: 'LD B, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.registers.c;
      return 4;
    },
  },
  0x42: {
    meta: {
      asm: 'LD B, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.registers.d;
      return 4;
    },
  },
  0x43: {
    meta: {
      asm: 'LD B, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.registers.e;
      return 4;
    },
  },
  0x44: {
    meta: {
      asm: 'LD B, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.registers.h;
      return 4;
    },
  },
  0x45: {
    meta: {
      asm: 'LD B, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.registers.l;
      return 4;
    },
  },
  0x46: {
    meta: {
      asm: 'LD B, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.b = cpu.memRead(hl);
      return 8;
    },
  },
  0x47: {
    meta: {
      asm: 'LD B, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.b = cpu.registers.a;
      return 4;
    },
  },
  0x48: {
    meta: {
      asm: 'LD C, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.registers.b;
      return 4;
    },
  },
  0x49: {
    meta: {
      asm: 'LD C, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      return 4;
    },
  },
  0x4a: {
    meta: {
      asm: 'LD C, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.registers.d;
      return 4;
    },
  },
  0x4b: {
    meta: {
      asm: 'LD C, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.registers.e;
      return 4;
    },
  },
  0x4c: {
    meta: {
      asm: 'LD C, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.registers.h;
      return 4;
    },
  },
  0x4d: {
    meta: {
      asm: 'LD C, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.registers.l;
      return 4;
    },
  },
  0x4e: {
    meta: {
      asm: 'LD C, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.c = cpu.memRead(hl);
      return 8;
    },
  },
  0x4f: {
    meta: {
      asm: 'LD C, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.c = cpu.registers.a;
      return 4;
    },
  },
  0x50: {
    meta: {
      asm: 'LD D, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.registers.b;
      return 4;
    },
  },
  0x51: {
    meta: {
      asm: 'LD D, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.registers.c;
      return 4;
    },
  },
  0x52: {
    meta: {
      asm: 'LD D, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      return 4;
    },
  },
  0x53: {
    meta: {
      asm: 'LD D, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.registers.e;
      return 4;
    },
  },
  0x54: {
    meta: {
      asm: 'LD D, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.registers.h;
      return 4;
    },
  },
  0x55: {
    meta: {
      asm: 'LD D, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.registers.l;
      return 4;
    },
  },
  0x56: {
    meta: {
      asm: 'LD D, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.d = cpu.memRead(hl);
      return 8;
    },
  },
  0x57: {
    meta: {
      asm: 'LD D, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.d = cpu.registers.a;
      return 4;
    },
  },
  0x58: {
    meta: {
      asm: 'LD E, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.registers.b;
      return 4;
    },
  },
  0x59: {
    meta: {
      asm: 'LD E, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.registers.c;
      return 4;
    },
  },
  0x5a: {
    meta: {
      asm: 'LD E, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.registers.d;
      return 4;
    },
  },
  0x5b: {
    meta: {
      asm: 'LD E, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      return 4;
    },
  },
  0x5c: {
    meta: {
      asm: 'LD E, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.registers.h;
      return 4;
    },
  },
  0x5d: {
    meta: {
      asm: 'LD E, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.registers.l;
      return 4;
    },
  },
  0x5e: {
    meta: {
      asm: 'LD E, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.e = cpu.memRead(hl);
      return 8;
    },
  },
  0x5f: {
    meta: {
      asm: 'LD E, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.e = cpu.registers.a;
      return 4;
    },
  },
  0x60: {
    meta: {
      asm: 'LD H, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.registers.b;
      return 4;
    },
  },
  0x61: {
    meta: {
      asm: 'LD H, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.registers.c;
      return 4;
    },
  },
  0x62: {
    meta: {
      asm: 'LD H, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.registers.d;
      return 4;
    },
  },
  0x63: {
    meta: {
      asm: 'LD H, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.registers.e;
      return 4;
    },
  },
  0x64: {
    meta: {
      asm: 'LD H, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => 4,
  },
  0x65: {
    meta: {
      asm: 'LD H, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.registers.l;
      return 4;
    },
  },
  0x66: {
    meta: {
      asm: 'LD H, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.h = cpu.memRead(hl);
      return 8;
    },
  },
  0x67: {
    meta: {
      asm: 'LD H, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.h = cpu.registers.a;
      return 4;
    },
  },
  0x68: {
    meta: {
      asm: 'LD L, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.registers.b;
      return 4;
    },
  },
  0x69: {
    meta: {
      asm: 'LD L, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.registers.c;
      return 4;
    },
  },
  0x6a: {
    meta: {
      asm: 'LD L, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.registers.d;
      return 4;
    },
  },
  0x6b: {
    meta: {
      asm: 'LD L, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.registers.e;
      return 4;
    },
  },
  0x6c: {
    meta: {
      asm: 'LD L, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.registers.h;
      return 4;
    },
  },
  0x6d: {
    meta: {
      asm: 'LD L, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => 4,
  },
  0x6e: {
    meta: {
      asm: 'LD L, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.l = cpu.memRead(hl);
      return 8;
    },
  },
  0x6f: {
    meta: {
      asm: 'LD L, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.l = cpu.registers.a;
      return 4;
    },
  },
  0x70: {
    meta: {
      asm: 'LD [HL], B',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.b);
      return 8;
    },
  },
  0x71: {
    meta: {
      asm: 'LD [HL], C',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.c);
      return 8;
    },
  },
  0x72: {
    meta: {
      asm: 'LD [HL], D',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.d);
      return 8;
    },
  },
  0x73: {
    meta: {
      asm: 'LD [HL], E',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.e);
      return 8;
    },
  },
  0x74: {
    meta: {
      asm: 'LD [HL], H',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.h);
      return 8;
    },
  },
  0x75: {
    meta: {
      asm: 'LD [HL], L',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.l);
      return 8;
    },
  },
  0x76: {
    meta: {
      asm: 'HALT',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.isHalted = true;
      if (cpu.isPendingInterrupts()) {
        cpu.isHalted = false;
        if (!cpu.IME) {
          cpu.isHaltBug = true;
        }
      }
      return 4;
    },
  },
  0x77: {
    meta: {
      asm: 'LD [HL], A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.memWrite(hl, cpu.registers.a);
      return 8;
    },
  },
  0x78: {
    meta: {
      asm: 'LD A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.b;
      return 4;
    },
  },
  0x79: {
    meta: {
      asm: 'LD A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.c;
      return 4;
    },
  },
  0x7a: {
    meta: {
      asm: 'LD A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.d;
      return 4;
    },
  },
  0x7b: {
    meta: {
      asm: 'LD A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.e;
      return 4;
    },
  },
  0x7c: {
    meta: {
      asm: 'LD A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.h;
      return 4;
    },
  },
  0x7d: {
    meta: {
      asm: 'LD A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.l;
      return 4;
    },
  },
  0x7e: {
    meta: {
      asm: 'LD A, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.registers.a = cpu.memRead(hl);
      return 8;
    },
  },
  0x7f: {
    meta: {
      asm: 'LD A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      return 4;
    },
  },
  0x80: {
    meta: {
      asm: 'ADD A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.b) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.b);
      const C = isCarrySum(cpu.registers.a, cpu.registers.b);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x81: {
    meta: {
      asm: 'ADD A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.c) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.c);
      const C = isCarrySum(cpu.registers.a, cpu.registers.c);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x82: {
    meta: {
      asm: 'ADD A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.d) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.d);
      const C = isCarrySum(cpu.registers.a, cpu.registers.d);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x83: {
    meta: {
      asm: 'ADD A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.e) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.e);
      const C = isCarrySum(cpu.registers.a, cpu.registers.e);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x84: {
    meta: {
      asm: 'ADD A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.h) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.h);
      const C = isCarrySum(cpu.registers.a, cpu.registers.h);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x85: {
    meta: {
      asm: 'ADD A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.l) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.l);
      const C = isCarrySum(cpu.registers.a, cpu.registers.l);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x86: {
    meta: {
      asm: 'ADD A, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      const value = cpu.memRead(hl);
      const result = (cpu.registers.a + value) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, value);
      const C = isCarrySum(cpu.registers.a, value);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x87: {
    meta: {
      asm: 'ADD A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a + cpu.registers.a) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, cpu.registers.a);
      const C = isCarrySum(cpu.registers.a, cpu.registers.a);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x88: {
    meta: {
      asm: 'ADC A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x89: {
    meta: {
      asm: 'ADC A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x8a: {
    meta: {
      asm: 'ADC A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x8b: {
    meta: {
      asm: 'ADC A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x8c: {
    meta: {
      asm: 'ADC A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x8d: {
    meta: {
      asm: 'ADC A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x8e: {
    meta: {
      asm: 'ADC A, [HL]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 8;
    },
  },
  0x8f: {
    meta: {
      asm: 'ADC A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
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
      return 4;
    },
  },
  0x90: {
    meta: {
      asm: 'SUB A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.b) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.b
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.b, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x91: {
    meta: {
      asm: 'SUB A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.c) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.c
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.c, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x92: {
    meta: {
      asm: 'SUB A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.d) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.d
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.d, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x93: {
    meta: {
      asm: 'SUB A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.e) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.e
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.e, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x94: {
    meta: {
      asm: 'SUB A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.h) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.h
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.h, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x95: {
    meta: {
      asm: 'SUB A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.l) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.l
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.l, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0x96: {
    meta: {
      asm: 'SUB A, (HL)',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const result = (cpu.registers.a - value) & 0xff;
      const halfCarry = isHalfCarrySubtraction(cpu.registers.a, value);
      const carry = isCarrySubtraction(cpu.registers.a, value, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0x97: {
    meta: {
      asm: 'SUB A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = 0;
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.TRUE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0x98: {
    meta: {
      asm: 'SBC A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 4;
    },
  },
  0x99: {
    meta: {
      asm: 'SBC A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 4;
    },
  },
  0x9a: {
    meta: {
      asm: 'SBC A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 4;
    },
  },
  0x9b: {
    meta: {
      asm: 'SBC A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 4;
    },
  },
  0x9c: {
    meta: {
      asm: 'SBC A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 4;
    },
  },
  0x9d: {
    meta: {
      asm: 'SBC A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 4;
    },
  },
  0x9e: {
    meta: {
      asm: 'SBC A, (HL)',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const C = cpu.getFlags().C;
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 8;
    },
  },
  0x9f: {
    meta: {
      asm: 'SBC A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      if (cpu.getFlags().C) {
        cpu.setFlags({
          Z: FlagState.FALSE,
          N: FlagState.TRUE,
          H: FlagState.TRUE,
        });
        cpu.registers.a = 0xff;
      } else {
        cpu.setFlags({
          Z: FlagState.TRUE,
          N: FlagState.TRUE,
          H: FlagState.FALSE,
        });
        cpu.registers.a = 0;
      }
      return 4;
    },
  },
  0xa0: {
    meta: {
      asm: 'AND A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a &= cpu.registers.b;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa1: {
    meta: {
      asm: 'AND A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a &= cpu.registers.c;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa2: {
    meta: {
      asm: 'AND A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a &= cpu.registers.d;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa3: {
    meta: {
      asm: 'AND A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a &= cpu.registers.e;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa4: {
    meta: {
      asm: 'AND A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a &= cpu.registers.h;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa5: {
    meta: {
      asm: 'AND A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a &= cpu.registers.l;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa6: {
    meta: {
      asm: 'AND A, (HL)',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.registers.a &= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0xa7: {
    meta: {
      asm: 'AND A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa8: {
    meta: {
      asm: 'XOR A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a ^= cpu.registers.b;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xa9: {
    meta: {
      asm: 'XOR A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a ^= cpu.registers.c;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xaa: {
    meta: {
      asm: 'XOR A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a ^= cpu.registers.d;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xab: {
    meta: {
      asm: 'XOR A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a ^= cpu.registers.e;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xac: {
    meta: {
      asm: 'XOR A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a ^= cpu.registers.h;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xad: {
    meta: {
      asm: 'XOR A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a ^= cpu.registers.l;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xae: {
    meta: {
      asm: 'XOR A, (HL)',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.registers.a ^= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0xaf: {
    meta: {
      asm: 'XOR A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = 0;
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb0: {
    meta: {
      asm: 'OR A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.a | cpu.registers.b;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb1: {
    meta: {
      asm: 'OR A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.a | cpu.registers.c;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb2: {
    meta: {
      asm: 'OR A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.a | cpu.registers.d;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb3: {
    meta: {
      asm: 'OR A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.a | cpu.registers.e;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb4: {
    meta: {
      asm: 'OR A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.a | cpu.registers.h;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb5: {
    meta: {
      asm: 'OR A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.registers.a = cpu.registers.a | cpu.registers.l;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb6: {
    meta: {
      asm: 'OR A, (HL)',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      cpu.registers.a = cpu.registers.a | value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0xb7: {
    meta: {
      asm: 'OR A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb8: {
    meta: {
      asm: 'CP A, B',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.b) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.b
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.b, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0xb9: {
    meta: {
      asm: 'CP A, C',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.c) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.c
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.c, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0xba: {
    meta: {
      asm: 'CP A, D',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.d) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.d
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.d, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0xbb: {
    meta: {
      asm: 'CP A, E',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.e) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.e
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.e, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0xbc: {
    meta: {
      asm: 'CP A, H',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.h) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.h
      );
      const carry = isCarrySubtraction(cpu.registers.a, cpu.registers.h, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0xbd: {
    meta: {
      asm: 'CP A, L',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      const result = (cpu.registers.a - cpu.registers.l) & 0xff;
      const halfCarry = isHalfCarrySubtraction(
        cpu.registers.a,
        cpu.registers.l
      );
      const carry = (cpu.registers.a - cpu.registers.l) & 0x100;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 4;
    },
  },
  0xbe: {
    meta: {
      asm: 'CP A, (HL)',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.memRead(cpu.getCombinedRegister(CombinedRegister.HL));
      const result = (cpu.registers.a - value) & 0xff;
      const halfCarry = isHalfCarrySubtraction(cpu.registers.a, value);
      const carry = isCarrySubtraction(cpu.registers.a, value, 8);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: halfCarry ? FlagState.TRUE : FlagState.FALSE,
        C: carry ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0xbf: {
    meta: {
      asm: 'CP A, A',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setFlags({
        Z: FlagState.TRUE,
        N: FlagState.TRUE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 4;
    },
  },
  0xc0: {
    meta: {
      asm: 'RET NZ',
      size: 1,
      cycles: '20 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      if (!cpu.getFlags().Z) {
        cpu.pc = cpu.popStack();
        return 20;
      }
      return 8;
    },
  },
  0xc1: {
    meta: {
      asm: 'POP BC',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setCombinedRegister(CombinedRegister.BC, cpu.popStack());
      return 12;
    },
  },
  0xc2: {
    meta: {
      asm: 'JP NZ, a16',
      size: 3,
      cycles: '16 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      if (!cpu.getFlags().Z) {
        cpu.pc = address;
        return 16;
      }
      return 12;
    },
  },
  0xc3: {
    meta: {
      asm: 'JP a16',
      size: 3,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const jumpAddress = cpu.consumeWord();
      cpu.pc = jumpAddress;
      return 16;
    },
  },
  0xc4: {
    meta: {
      asm: 'CALL NZ, a16',
      size: 3,
      cycles: '24 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const jumpAddress = cpu.consumeWord();
      if (!cpu.getFlags().Z) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
        return 24;
      }
      return 12;
    },
  },
  0xc5: {
    meta: {
      asm: 'PUSH BC',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.BC));
      return 16;
    },
  },
  0xc6: {
    meta: {
      asm: 'ADD A, n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      const result = (cpu.registers.a + value) & 0xff;
      const H = isHalfCarrySum(cpu.registers.a, value);
      const C = isCarrySum(cpu.registers.a, value);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0xc7: {
    meta: {
      asm: 'RST 0x00',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x00;
      return 16;
    },
  },
  0xc8: {
    meta: {
      asm: 'RET Z',
      size: 1,
      cycles: '20 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      if (cpu.getFlags().Z) {
        cpu.pc = cpu.popStack();
        return 20;
      }
      return 8;
    },
  },
  0xc9: {
    meta: {
      asm: 'RET',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pc = cpu.popStack();
      return 16;
    },
  },
  0xca: {
    meta: {
      asm: 'JP Z, a16',
      size: 3,
      cycles: '16 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      if (cpu.getFlags().Z) {
        cpu.pc = address;
        return 16;
      }
      return 12;
    },
  },
  0xcb: {
    meta: {
      asm: 'PREFIX CB',
      size: 1,
      cycles: '0',
    },
    execute: (cpu: CPU): TCycles => {
      const instruction = cpu.consumeByte();
      const prefixInstruction = PrefixInstructions[instruction];
      if (!prefixInstruction) {
        throw new Error(
          `Unknown prefix instruction ${instruction.toString(16)}`
        );
      }

      const cycles = prefixInstruction.execute(cpu);
      return cycles;
    },
  },
  0xcc: {
    meta: {
      asm: 'CALL Z, a16',
      size: 3,
      cycles: '24 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const jumpAddress = cpu.consumeWord();
      if (cpu.getFlags().Z) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
        return 24;
      }
      return 12;
    },
  },
  0xcd: {
    meta: {
      asm: 'CALL a16',
      size: 3,
      cycles: '24',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      cpu.pushStack(cpu.pc);
      cpu.pc = address;
      return 24;
    },
  },
  0xce: {
    meta: {
      asm: 'ADC A, d8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
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
      return 8;
    },
  },
  0xcf: {
    meta: {
      asm: 'RST 0x08',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x08;
      return 16;
    },
  },
  0xd0: {
    meta: {
      asm: 'RET NC',
      size: 1,
      cycles: '20 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      if (!cpu.getFlags().C) {
        cpu.pc = cpu.popStack();
        return 20;
      }
      return 8;
    },
  },
  0xd1: {
    meta: {
      asm: 'POP DE',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setCombinedRegister(CombinedRegister.DE, cpu.popStack());
      return 12;
    },
  },
  0xd2: {
    meta: {
      asm: 'JP NC, a16',
      size: 3,
      cycles: '16 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      if (!cpu.getFlags().C) {
        cpu.pc = address;
        return 16;
      }
      return 12;
    },
  },
  0xd4: {
    meta: {
      asm: 'CALL NC, a16',
      size: 3,
      cycles: '24 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const jumpAddress = cpu.consumeWord();
      if (!cpu.getFlags().C) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
        return 24;
      }
      return 12;
    },
  },
  0xd5: {
    meta: {
      asm: 'PUSH DE',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.DE));
      return 16;
    },
  },
  0xd6: {
    meta: {
      asm: 'SUB A n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      const result = (cpu.registers.a - value) & 0xff;
      const H = isHalfCarrySubtraction(cpu.registers.a, value);
      const C = isCarrySubtraction(cpu.registers.a, value, 8);
      cpu.registers.a = result;
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: H ? FlagState.TRUE : FlagState.FALSE,
        C: C ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0xd7: {
    meta: {
      asm: 'RST 0x10',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x10;
      return 16;
    },
  },
  0xd8: {
    meta: {
      asm: 'RET C',
      size: 1,
      cycles: '20 / 8',
    },
    execute: (cpu: CPU): TCycles => {
      if (cpu.getFlags().C) {
        cpu.pc = cpu.popStack();
        return 20;
      }
      return 8;
    },
  },
  0xd9: {
    meta: {
      asm: 'RETI',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pc = cpu.popStack();
      cpu.IME = true;
      return 16;
    },
  },
  0xda: {
    meta: {
      asm: 'JP C, a16',
      size: 3,
      cycles: '16 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      if (cpu.getFlags().C) {
        cpu.pc = address;
        return 16;
      }
      return 12;
    },
  },
  0xdc: {
    meta: {
      asm: 'CALL C, a16',
      size: 3,
      cycles: '24 / 12',
    },
    execute: (cpu: CPU): TCycles => {
      const jumpAddress = cpu.consumeWord();
      if (cpu.getFlags().C) {
        cpu.pushStack(cpu.pc);
        cpu.pc = jumpAddress;
        return 24;
      }
      return 12;
    },
  },
  0xde: {
    meta: {
      asm: 'SBC A, d8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
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
      return 8;
    },
  },
  0xdf: {
    meta: {
      asm: 'RST 0x18',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x18;
      return 16;
    },
  },
  0xe0: {
    meta: {
      asm: 'LDH [a8], A',
      size: 2,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      const address = (0xff << 8) | value;
      cpu.memWrite(address, cpu.registers.a);
      return 12;
    },
  },
  0xe1: {
    meta: {
      asm: 'POP HL',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setCombinedRegister(CombinedRegister.HL, cpu.popStack());
      return 12;
    },
  },
  0xe2: {
    meta: {
      asm: 'LD [C], A',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const address = (0xff << 8) | cpu.registers.c;
      cpu.memWrite(address, cpu.registers.a);
      return 8;
    },
  },
  0xe5: {
    meta: {
      asm: 'PUSH HL',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.HL));
      return 16;
    },
  },
  0xe6: {
    meta: {
      asm: 'AND d8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      cpu.registers.a &= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.TRUE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0xe7: {
    meta: {
      asm: 'RST 0x20',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x20;
      return 16;
    },
  },
  0xe8: {
    meta: {
      asm: 'ADD SP, e8',
      size: 2,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      // this instruction was nightmare
      const value = cpu.consumeByte();
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
      return 16;
    },
  },
  0xe9: {
    meta: {
      asm: 'JP (HL)',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pc = cpu.getCombinedRegister(CombinedRegister.HL);
      return 4;
    },
  },
  0xea: {
    meta: {
      asm: 'LD [a16], A',
      size: 3,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      cpu.memWrite(address, cpu.registers.a);
      return 16;
    },
  },
  0xee: {
    meta: {
      asm: 'XOR d8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      cpu.registers.a ^= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0xef: {
    meta: {
      asm: 'RST 0x28',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x28;
      return 16;
    },
  },
  0xf0: {
    meta: {
      asm: 'LDH A, [a8]',
      size: 2,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      const address = (0xff << 8) | value;
      cpu.registers.a = cpu.memRead(address);
      return 12;
    },
  },
  0xf1: {
    meta: {
      asm: 'POP AF',
      size: 1,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.setCombinedRegister(CombinedRegister.AF, cpu.popStack());
      return 12;
    },
  },
  0xf2: {
    meta: {
      asm: 'LD A, [C]',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const address = (0xff << 8) | cpu.registers.c;
      cpu.registers.a = cpu.memRead(address);
      return 8;
    },
  },
  0xf3: {
    meta: {
      asm: 'DI',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.IME = false;
      return 4;
    },
  },
  0xf5: {
    meta: {
      asm: 'PUSH AF',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.getCombinedRegister(CombinedRegister.AF));
      return 16;
    },
  },
  0xf6: {
    meta: {
      asm: 'OR d8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      cpu.registers.a |= value;
      cpu.setFlags({
        Z: cpu.registers.a === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.FALSE,
        H: FlagState.FALSE,
        C: FlagState.FALSE,
      });
      return 8;
    },
  },
  0xf7: {
    meta: {
      asm: 'RST 0x30',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x30;
      return 16;
    },
  },
  0xf8: {
    meta: {
      asm: 'LD HL, SP+e8',
      size: 2,
      cycles: '12',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
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

      cpu.setCombinedRegister(CombinedRegister.HL, newSp);
      return 12;
    },
  },
  0xf9: {
    meta: {
      asm: 'LD SP, HL',
      size: 1,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const hl = cpu.getCombinedRegister(CombinedRegister.HL);
      cpu.sp = hl;
      return 8;
    },
  },
  0xfa: {
    meta: {
      asm: 'LD A, [a16]',
      size: 3,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      const address = cpu.consumeWord();
      cpu.registers.a = cpu.memRead(address);
      return 16;
    },
  },
  0xfb: {
    meta: {
      asm: 'EI',
      size: 1,
      cycles: '4',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.IME = true;
      return 4;
    },
  },
  0xfe: {
    meta: {
      asm: 'CP n8',
      size: 2,
      cycles: '8',
    },
    execute: (cpu: CPU): TCycles => {
      const value = cpu.consumeByte();
      const result = (cpu.registers.a - value) & 0xff;
      const HC = isHalfCarrySubtraction(cpu.registers.a, value);
      cpu.setFlags({
        Z: result === 0 ? FlagState.TRUE : FlagState.FALSE,
        N: FlagState.TRUE,
        H: HC ? FlagState.TRUE : FlagState.FALSE,
        C: cpu.registers.a < value ? FlagState.TRUE : FlagState.FALSE,
      });
      return 8;
    },
  },
  0xff: {
    meta: {
      asm: 'RST 0x38',
      size: 1,
      cycles: '16',
    },
    execute: (cpu: CPU): TCycles => {
      cpu.pushStack(cpu.pc);
      cpu.pc = 0x38;
      return 16;
    },
  },
};
