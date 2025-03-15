export const sleep = (ms: number) =>
  new Promise((res: any) => setTimeout(res, ms));

export function numTo8bitString(num: number): string {
  let converted = num.toString(2);
  while (converted.length < 8) {
    converted = '0'.concat(converted);
  }
  return converted;
}
