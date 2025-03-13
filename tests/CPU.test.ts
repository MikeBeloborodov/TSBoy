import { CPU } from '../src/CPU';

describe('CPU', () => {
  describe('Initial values', () => {
    it('should return correct initial registers', () => {
      const cpu = new CPU();
      expect(cpu.registers).toStrictEqual({
        a: 0b00000000,
        b: 0b00000000,
        c: 0b00000000,
        d: 0b00000000,
        e: 0b00000000,
        f: 0b00000000,
        h: 0b00000000,
        l: 0b00000000,
      });
    });

    it('should return correct initial program counter', () => {
      const cpu = new CPU();
      expect(cpu.pc).toBe(0b00000000);
    });
  });

  describe('Register combination', () => {
    it('should return correct combined registers af', () => {
      const cpu = new CPU();
      cpu.registers.a = 0b11001100;
      cpu.registers.f = 0b10011001;
      expect(cpu.getCombinedRegister('af').toString(2)).toBe(
        '1100110010011001'
      );
    });

    it('should return correct combined registers bc', () => {
      const cpu = new CPU();
      cpu.registers.b = 0b10110110;
      cpu.registers.c = 0b10101011;
      expect(cpu.getCombinedRegister('bc').toString(2)).toBe(
        '1011011010101011'
      );
    });

    it('should return correct combined registers de', () => {
      const cpu = new CPU();
      cpu.registers.d = 0b11001111;
      cpu.registers.e = 0b11111101;
      expect(cpu.getCombinedRegister('de').toString(2)).toBe(
        '1100111111111101'
      );
    });

    it('should return correct combined registers hl', () => {
      const cpu = new CPU();
      cpu.registers.h = 0b10000111;
      cpu.registers.l = 0b10101101;
      expect(cpu.getCombinedRegister('hl').toString(2)).toBe(
        '1000011110101101'
      );
    });

    it('should correctly set combined registers af', () => {
      const cpu = new CPU();
      const value = 0b1100110010011001;
      cpu.setCombined('af', value);
      expect(cpu.registers.a.toString(2)).toBe('11001100');
      expect(cpu.registers.f.toString(2)).toBe('10011001');
    });

    it('should correctly set combined registers bc', () => {
      const cpu = new CPU();
      const value = 0b1011011010101011;
      cpu.setCombined('bc', value);
      expect(cpu.registers.b.toString(2)).toBe('10110110');
      expect(cpu.registers.c.toString(2)).toBe('10101011');
    });

    it('should correctly set combined registers de', () => {
      const cpu = new CPU();
      const value = 0b1100111111111101;
      cpu.setCombined('de', value);
      expect(cpu.registers.d.toString(2)).toBe('11001111');
      expect(cpu.registers.e.toString(2)).toBe('11111101');
    });

    it('should correctly set combined registers hl', () => {
      const cpu = new CPU();
      const value = 0b1000011110101101;
      cpu.setCombined('hl', value);
      expect(cpu.registers.h.toString(2)).toBe('10000111');
      expect(cpu.registers.l.toString(2)).toBe('10101101');
    });
  });
});
