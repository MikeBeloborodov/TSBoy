import {
  isHalfCarrySubtraction,
  signed8bit,
  sumThreeValuesWithCarryInfo,
  subtractThreeValuesWithCarryInfo,
} from '../src/utils';

describe('Tests for utils', () => {
  describe('Tests for isHalfCarrySubstraction', () => {
    it('should return false when no half carry', () => {
      expect(isHalfCarrySubtraction(0x01, 0x01)).toBe(false);
      expect(isHalfCarrySubtraction(0x0f, 0x01)).toBe(false);
      expect(isHalfCarrySubtraction(0x0f, 0x0f)).toBe(false);
      expect(isHalfCarrySubtraction(0x20, 0x10)).toBe(false);
      expect(isHalfCarrySubtraction(0x00, 0x00)).toBe(false);
    });

    it('should return true when there is half carry', () => {
      expect(isHalfCarrySubtraction(0x10, 0x01)).toBe(true);
      expect(isHalfCarrySubtraction(0x20, 0x01)).toBe(true);
      expect(isHalfCarrySubtraction(0x01, 0x0f)).toBe(true);
      expect(isHalfCarrySubtraction(0x10, 0x0f)).toBe(true);
    });
  });

  describe('Tests for signed8bit', () => {
    it('should return positive number', () => {
      expect(signed8bit(0x01)).toBe(0x01);
      expect(signed8bit(0x7f)).toBe(0x7f);
    });

    it('should return negative number', () => {
      expect(signed8bit(0x80)).toBe(-0x80);
      expect(signed8bit(0xff)).toBe(-0x01);
    });
  });

  describe('Tests for sumThreeValuesWithCarryInfo', () => {
    it('should return correct values', () => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        0x01,
        0x01,
        0x01
      );
      expect(result).toBe(0x03);
      expect(halfCarry).toBe(false);
      expect(carry).toBe(false);
    });

    it('should return correct values', () => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        0x0f,
        0x01,
        0x01
      );
      expect(result).toBe(0x11);
      expect(halfCarry).toBe(true);
      expect(carry).toBe(false);
    });

    it('should return correct values with carry', () => {
      const { result, halfCarry, carry } = sumThreeValuesWithCarryInfo(
        0xff,
        0x01,
        0x01
      );
      expect(result).toBe(0x01);
      expect(halfCarry).toBe(true);
      expect(carry).toBe(true);
    });
  });

  describe('Tests for substractThreeValuesWithCarryInfo', () => {
    it('should return correct values', () => {
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
        0x02,
        0x01,
        0x01
      );
      expect(result).toBe(0x00);
      expect(halfCarry).toBe(false);
      expect(carry).toBe(false);
    });

    it('should return correct values with carry', () => {
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
        0x01,
        0x01,
        0x01
      );
      expect(result).toBe(0xff);
      expect(halfCarry).toBe(true);
      expect(carry).toBe(true);
    });

    it('should return correct values with half carry', () => {
      const { result, halfCarry, carry } = subtractThreeValuesWithCarryInfo(
        0x10,
        0x01,
        0x01
      );
      expect(result).toBe(0x0e);
      expect(halfCarry).toBe(true);
      expect(carry).toBe(false);
    });
  });
});
