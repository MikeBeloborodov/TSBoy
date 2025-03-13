export type HexTable = { [key: number]: string };
export type CodeTable = { [key: string]: string };

export type HeaderInfo = {
  isNintendoLogo: boolean;
  title: string;
  licensee: string;
  isSGB: boolean;
  cartridgeType: string;
  romSize: string;
  ramSize: string;
  destination: string;
  maskRom: number;
  isChecksumValid: boolean;
};

export type MockRom = {
  path: string;
  description: string;
  headerContents: HeaderInfo;
};

export type u8 = number;
export type u16 = number;
export type CombinedRegister = 'af' | 'bc' | 'de' | 'hl';

export type Registers = {
  a: u8;
  b: u8;
  c: u8;
  d: u8;
  e: u8;
  f: u8;
  h: u8;
  l: u8;
};
