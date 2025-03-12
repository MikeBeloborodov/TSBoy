import fs from 'fs';
import { CartridgeHeaderParser } from './CartridgeHeaderParser';

const folder = './roms/';
const files = [
  'Final Fantasy Adventure (USA).gb',
  'Super Mario Land (World) (Rev 1).gb',
  'Mortal Kombat (USA, Europe).gb',
  "Legend of Zelda, The - Link's Awakening (U) (V1.2) [!].gb",
  "Tony Hawk's Pro Skater 3 (USA, Europe).gbc",
  'Donkey Kong (JU) (V1.1) [S][!].gb',
];

files.forEach((fileName) => {
  console.log(`File Name: ${fileName}`);
  const file = fs.readFileSync(folder + fileName);
  const parser = new CartridgeHeaderParser(file);
  parser.outputParsedInfo(console);
  console.log('----------------------------');
});
