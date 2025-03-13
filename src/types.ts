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
