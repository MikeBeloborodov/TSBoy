export const sleep = (ms: number) =>
  new Promise((res: any) => setTimeout(res, ms));

export function numTo8bitString(num: number): string {
  let converted = num.toString(2);
  while (converted.length < 8) {
    converted = '0'.concat(converted);
  }
  return converted;
}

export function isHalfCarrySubstraction(a: number, b: number): boolean {
  return (a & 0xf) < (b & 0xf);
}

export function isHalfCarrySum(a: number, b: number): boolean {
  return (((a & 0xf) + (b & 0xf)) & 0x10) == 0x10;
}

export function isCarrySum(a: number, b: number): boolean {
  return a + b > 0xff;
}

export function isCarrySubstraction(
  a: number,
  b: number,
  bits: number
): boolean {
  let mask = 0;
  if (bits === 8) {
    mask = 0xff;
  } else if (bits === 16) {
    mask = 0xffff;
  } else {
    throw new Error('Unsupported bit width. Use 8 or 16.');
  }

  const result = (a - b) & mask;

  // Check if a borrow occurred (i.e., if the result is greater than or equal to the original value)
  return result > a;
}

export function unsignedSubtract(a: number, b: number, bits: number): number {
  let mask = 0;
  if (bits === 8) {
    mask = 0xff;
  } else if (bits === 16) {
    mask = 0xffff;
  } else {
    throw new Error('Unsupported bit width. Use 8 or 16.');
  }

  return (a - b) & mask;
}

export function unsignedAddition(a: number, b: number, bits: number): number {
  const max = 1 << bits;
  return (a + b) % max;
}

export function unsigned8bit(a: number): number {
  return a & 0xff;
}

export function signed8bit(a: number): number {
  return a > 0x7f ? a - 0x100 : a;
}

export function sumThreeValuesWithCarryInfo(
  a: number,
  b: number,
  c: number
): { result: number; halfCarry: boolean; carry: boolean } {
  let sumAB = a + b;
  let halfCarryAB = (((a & 0xf) + (b & 0xf)) & 0x10) === 0x10;
  let carryAB = sumAB > 0xff;

  let result = sumAB + c;
  let halfCarry = (((sumAB & 0xf) + (c & 0xf)) & 0x10) === 0x10 || halfCarryAB;
  let carry = result > 0xff || carryAB;

  // Mask result to 8 bits
  result &= 0xff;

  return { result, halfCarry, carry };
}

export function substractThreeValuesWithCarryInfo(
  a: number,
  b: number,
  c: number
): { result: number; halfCarry: boolean; carry: boolean } {
  let diffAB = a - b;
  let halfCarryAB = (a & 0xf) < (b & 0xf);
  let carryAB = (diffAB & 0xff) > a;

  let result = diffAB - c;
  let halfCarry = (diffAB & 0xf) < (c & 0xf) || halfCarryAB;
  let carry = (result & 0xff) > diffAB || carryAB;

  // Mask result to 8 bits
  result &= 0xff;

  return { result, halfCarry, carry };
}
