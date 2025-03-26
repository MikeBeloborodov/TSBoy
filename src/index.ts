import fs from 'fs';
import { Emulator } from './emulator';

const args = process.argv.slice(2);

function findArg(arg: string): string | undefined {
  return args.find((a) => a.includes(arg))?.split('=')[1];
}

const rom = findArg('--rom');
if (!rom) {
  console.error('Please provide a ROM file');
  process.exit(1);
}
export const emu = new Emulator(fs.readFileSync(rom));
console.log('Starting emulator');
emu.start();
