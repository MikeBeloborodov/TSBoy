export const sleep = (ms: number) =>
  new Promise((res: any) => setTimeout(res, ms));

export function numTo8bitString(num: number): string {
  let converted = num.toString(2);
  while (converted.length < 8) {
    converted = '0'.concat(converted);
  }
  return converted;
}

export function isHalfCarrySubtraction(
  a: number,
  b: number,
  bits: number = 8
): boolean {
  if (bits === 8) {
    return (a & 0xf) < (b & 0xf);
  } else if (bits === 16) {
    return (a & 0xfff) < (b & 0xfff);
  } else {
    throw new Error('Unsupported bit width. Use 8 or 16.');
  }
}
export function isHalfCarrySum(
  a: number,
  b: number,
  bits: number = 8
): boolean {
  if (bits === 8) {
    return (((a & 0xf) + (b & 0xf)) & 0x10) == 0x10;
  } else if (bits === 16) {
    return (((a & 0xfff) + (b & 0xfff)) & 0x1000) == 0x1000;
  } else {
    throw new Error('Unsupported bit width. Use 8 or 16.');
  }
}

export function isCarrySum(a: number, b: number, bits: number = 8): boolean {
  if (bits === 8) {
    return a + b > 0xff;
  } else if (bits === 16) {
    return a + b > 0xffff;
  } else {
    throw new Error('Unsupported bit width. Use 8 or 16.');
  }
}
export function isCarrySubtraction(
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

export function subtractThreeValuesWithCarryInfo(
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

export function hexToString(hex: number): string {
  let str = hex.toString(16).toUpperCase();
  if (str.length === 1) {
    str = '0' + str;
  }

  return '0x' + str;
}
