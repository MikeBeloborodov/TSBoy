import fs from 'fs';
import {
  NewNintendoLicenseeCodes,
  OldNintendoLicenseeCodes,
  OriginalNintendoLogo,
} from './misc';

const folder = './roms/';
const files = [
  'Final Fantasy Adventure (USA).gb',
  'Super Mario Land (World) (Rev 1).gb',
  'Mortal Kombat (USA, Europe).gb',
  "Legend of Zelda, The - Link's Awakening (U) (V1.2) [!].gb",
  "Tony Hawk's Pro Skater 3 (USA, Europe).gbc",
];

files.forEach((fileName) => {
  console.log(`File Name: ${fileName}`);
  const file = fs.readFileSync(folder + fileName);
  parseCartridgeHeader(file);
  console.log('----------------------------');
});

function parseCartridgeHeader(file: Buffer): void {
  const nLogoStart = 0x104;
  const nLogoEnd = 0x134;
  const nLogo = file.subarray(nLogoStart, nLogoEnd);
  console.log(
    nLogo.compare(OriginalNintendoLogo) === 0
      ? 'Nintendo Logo: true'
      : 'Nintendo Logo: false'
  );

  const titleStart = 0x134;
  const titleEnd = 0x144;
  const title = file.subarray(titleStart, titleEnd);
  console.log('Title:', title.toString('ascii'));

  // 013F-0142 — Manufacturer code
  // In older cartridges these bytes were part of the Title (see above). In newer cartridges they contain a 4-character manufacturer code (in uppercase ASCII). The purpose of the manufacturer code is unknown.

  // 0143 — CGB flag
  // In older cartridges this byte was part of the Title (see above). The CGB and later models interpret this byte to decide whether to enable Color mode (“CGB Mode”) or to fall back to monochrome compatibility mode (“Non-CGB Mode”).

  //   let licensee = '';
  const oldLicenseeCodeAdress = 0x14b;
  const newLicenseeCodeAddess = 0x144;
  let oldLicenseeCode = file[oldLicenseeCodeAdress];
  if (oldLicenseeCode === 0x33) {
    const newLicenseeCode = file.subarray(
      newLicenseeCodeAddess,
      newLicenseeCodeAddess + 2
    );
    console.log(
      'Licensee:',
      NewNintendoLicenseeCodes[newLicenseeCode.toString('ascii')]
    );
  } else {
    console.log('Licensee:', OldNintendoLicenseeCodes[oldLicenseeCode]);
  }
}
