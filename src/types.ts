export type HexTable = { [key: number]: string };
export type CodeTable = { [key: string]: string };

export interface Logger {
  log(input: string): void;
}
