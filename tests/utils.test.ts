import {
  isHalfCarrySubstraction,
  signed8bit,
  unsigned8bit,
  unsignedSubtract,
  sumThreeValuesWithCarryInfo,
} from '../src/utils';

describe('Tests for utils', () => {
  describe('Tests for isHalfCarrySubstraction', () => {
    it('should return false when no half carry', () => {
      expect(isHalfCarrySubstraction(0x01, 0x01)).toBe(false);
      expect(isHalfCarrySubstraction(0x0f, 0x01)).toBe(false);
      expect(isHalfCarrySubstraction(0x0f, 0x0f)).toBe(false);
      expect(isHalfCarrySubstraction(0x20, 0x10)).toBe(false);
      expect(isHalfCarrySubstraction(0x00, 0x00)).toBe(false);
    });

    it('should return true when there is half carry', () => {
      expect(isHalfCarrySubstraction(0x10, 0x01)).toBe(true);
      expect(isHalfCarrySubstraction(0x20, 0x01)).toBe(true);
      expect(isHalfCarrySubstraction(0x01, 0x0f)).toBe(true);
      expect(isHalfCarrySubstraction(0x10, 0x0f)).toBe(true);
    });
  });

  describe('Tests for unsignedSubtract', () => {
    it('should subtract correctly', () => {
      expect(unsignedSubtract(0x01, 0x01, 8)).toBe(0x00);
      expect(unsignedSubtract(0x10, 0x01, 8)).toBe(0x0f);
      expect(unsignedSubtract(0x10, 0x10, 8)).toBe(0x00);
      expect(unsignedSubtract(0x20, 0x10, 8)).toBe(0x10);
      expect(unsignedSubtract(0x00, 0x00, 8)).toBe(0x00);
      expect(unsignedSubtract(0x00, 0x01, 8)).toBe(0xff);
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

  describe('Tests for unsigned8bit', () => {
    it('should return positive number', () => {
      expect(unsigned8bit(0x01)).toBe(0x01);
      expect(unsigned8bit(0x7f)).toBe(0x7f);
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
});
