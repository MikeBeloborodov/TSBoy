import { CartridgeHeaderParser } from './CartridgeHeaderParser';
import { CPU } from './CPU';
import { HeaderInfo, Memory, u16, u8 } from './types';

export class Emulator {
  cpu: CPU;
  memory: Memory;
  cartridge: Memory;
  cartHeaderInfo: HeaderInfo;

  constructor(romFile: Buffer) {
    this.cpu = new CPU(this.memoryRead.bind(this), this.memoryWrite.bind(this));
    this.memory = new Uint8Array(0xffff).fill(0);
    this.cartridge = romFile;
    this.memory = new Uint8Array([
      ...this.cartridge.slice(0, 0x8000),
      ...this.memory.slice(0x8000),
    ]);
    this.cartHeaderInfo = new CartridgeHeaderParser(romFile).getHeaderInfo();
    console.log(this.cartHeaderInfo);

    // entry point
    this.cpu.execute();
  }

  memoryWrite(address: u16): void {
    // TODO
    address;
  }

  memoryRead(address: u16): u8 {
    return this.memory[address];
  }
}
