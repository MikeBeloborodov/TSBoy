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
    this.memory = new Uint8Array(0x10000).fill(0);
    this.cartridge = romFile;
    this.memory = new Uint8Array([
      ...this.cartridge.slice(0, 0x8000),
      ...this.memory.slice(0x8000),
    ]);
    this.cartHeaderInfo = new CartridgeHeaderParser(romFile).getHeaderInfo();
  }

  memoryWrite(address: u16, value: u8): void {
    // 4 KiB Work RAM (WRAM)
    if (address >= 0xd000 && address <= 0xdfff) {
      this.memory[address] = value;
      return;
    }

    // I/O Registers, High RAM (HRAM), Interrupt Enable register (IE)
    if (address >= 0xff00 && address <= 0xffff) {
      this.memory[address] = value;
      return;
    }

    throw new Error(
      `Trying write ${value} to the address: ${address} This address was not implemented for writing`
    );
  }

  memoryRead(address: u16): u8 {
    return this.memory[address];
  }

  start() {
    this.cpu.execute();
  }
}
