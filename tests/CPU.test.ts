import { CPU } from '../src/CPU';
import { CombinedRegister } from '../src/types';

describe('CPU', () => {
  describe('Initial values', () => {
    it('should return correct initial values', () => {
      const cpu = new CPU();
      expect(cpu.registers).toStrictEqual({
        a: 0x00,
        b: 0x00,
        c: 0x00,
        d: 0x00,
        e: 0x00,
        f: 0x00,
        h: 0x00,
        l: 0x00,
      });
      expect(cpu.sp).toBe(0xfffe);
      expect(cpu.pc).toBe(0x0100);
    });
  });

  describe('Register combination', () => {
    it('should return correct combined registers af', () => {
      const cpu = new CPU();
      cpu.registers.a = 0b11001100;
      cpu.registers.f = 0b10011001;
      expect(cpu.getCombinedRegister(CombinedRegister.AF).toString(2)).toBe(
        '1100110010011001'
      );
    });

    it('should return correct combined registers bc', () => {
      const cpu = new CPU();
      cpu.registers.b = 0x13;
      cpu.registers.c = 0x31;
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0x1331);
    });

    it('should return correct combined registers de', () => {
      const cpu = new CPU();
      cpu.registers.d = 0xaf;
      cpu.registers.e = 0x1b;
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xaf1b);
    });

    it('should return correct combined registers hl', () => {
      const cpu = new CPU();
      cpu.registers.h = 0x1c;
      cpu.registers.l = 0xa8;
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0x1ca8);
    });

    it('should correctly set combined registers af', () => {
      const cpu = new CPU();
      const value = 0x5d4e;
      cpu.setCombinedRegister(CombinedRegister.AF, value);
      expect(cpu.registers.a).toBe(0x5d);
      expect(cpu.registers.f).toBe(0x4e);
    });

    it('should correctly set combined registers bc', () => {
      const cpu = new CPU();
      const value = 0x5428;
      cpu.setCombinedRegister(CombinedRegister.BC, value);
      expect(cpu.registers.b).toBe(0x54);
      expect(cpu.registers.c).toBe(0x28);
    });

    it('should correctly set combined registers de', () => {
      const cpu = new CPU();
      const value = 0x9a4f;
      cpu.setCombinedRegister(CombinedRegister.DE, value);
      expect(cpu.registers.d).toBe(0x9a);
      expect(cpu.registers.e).toBe(0x4f);
    });

    it('should correctly set combined registers hl', () => {
      const cpu = new CPU();
      const value = 0xa1a2;
      cpu.setCombinedRegister(CombinedRegister.HL, value);
      expect(cpu.registers.h).toBe(0xa1);
      expect(cpu.registers.l).toBe(0xa2);
    });
  });
});
