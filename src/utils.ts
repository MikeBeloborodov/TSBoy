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

export function isCarrySubstraction(a: number, b: number): boolean {
  return (a & 0xf) < (b & 0xf);
}

export function unsignedSubtract(a: number, b: number, bits: number): number {
  const max = 1 << bits;
  return (a - b + max) % max;
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
