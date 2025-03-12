import {
  CartridgeTypes,
  NewNintendoLicenseeCodes,
  OldNintendoLicenseeCodes,
  OriginalNintendoLogo,
  RAMSizes,
  ROMSizes,
} from './headerHexTables';
import { Logger } from './types';

export class CartridgeHeaderParser {
  private isNintendoLogo: boolean;
  private title: string;
  private licensee: string;
  private isSGB: boolean;
  private cartridgeType: string;
  private romSize: string;
  private ramSize: string;
  private destination: string;
  private maskRom: number;
  private isChecksumValid: boolean;

  constructor(romFile: Buffer) {
    this.isNintendoLogo = this.checkNintendoLogo(romFile);
    this.title = romFile
      .subarray(0x134, 0x144)
      .toString('ascii')
      .replace(/\u0000/g, '');
    this.licensee = this.parseLicensee(romFile);
    this.isSGB = romFile[0x146] === 0x03 ? true : false;
    this.cartridgeType = CartridgeTypes[romFile[0x147]];
    this.romSize = ROMSizes[romFile[0x148]];
    this.ramSize = RAMSizes[romFile[0x149]];
    this.destination = romFile[0x14a] === 0x00 ? 'Japan' : 'Overseas only';
    this.maskRom = romFile[0x14c];
    this.isChecksumValid = romFile[0x14d] === this.calculateChecksum(romFile);
  }

  outputParsedInfo(logger: Logger): void {
    logger.log(
      JSON.stringify({
        Title: this.title,
        'Nintendo logo': this.isNintendoLogo,
        Licensee: this.licensee,
        'SGB flag': this.isSGB,
        'Cartridge type': this.cartridgeType,
        'ROM size': this.romSize,
        'RAM size': this.ramSize,
        Destination: this.destination,
        'Mask ROM version': this.maskRom,
        'Checksum valid': this.isChecksumValid,
      })
    );
  }

  private checkNintendoLogo(romFile: Buffer): boolean {
    const logo = romFile.subarray(0x104, 0x134);
    return OriginalNintendoLogo.compare(logo) === 0 ? true : false;
  }

  private parseLicensee(romFile: Buffer): string {
    const oldLicenseeCode = romFile[0x14b];
    if (oldLicenseeCode === 0x33) {
      return NewNintendoLicenseeCodes[
        romFile.subarray(0x144, 0x144 + 2).toString('ascii')
      ];
    }
    return OldNintendoLicenseeCodes[oldLicenseeCode];
  }

  private calculateChecksum(romFile: Buffer): number {
    let checksum = 0;
    for (let address = 0x0134; address <= 0x014c; address++) {
      checksum = (checksum - romFile[address] - 1) & 0xff;
    }

    return checksum;
  }
}
