export const sleep = (ms: number) =>
  new Promise((res: any) => setTimeout(res, ms));
