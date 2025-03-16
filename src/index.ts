import fs from 'fs';
// import { CartridgeHeaderParser } from './CartridgeHeaderParser';

import { Emulator } from './emulator';

// const folder = './mock_roms/';
// const files = ['rom1.gb', 'rom2.gb', 'rom3.gb', 'rom4.gb'];

// files.forEach((fileName) => {
//   console.log(`File Name: ${fileName}`);
//   const file = fs.readFileSync(folder + fileName);
//   const parser = new CartridgeHeaderParser(file);
//   console.log(parser.getHeaderInfo());
//   console.log('----------------------------');
// });

export const emu = new Emulator(
  fs.readFileSync('./blarggs/individual/03-op sp,hl.gb')
);
emu.start();
