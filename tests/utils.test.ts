import { isHalfCarrySubstraction, unsignedSubtract } from '../src/utils';

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
});
