import { CartridgeHeaderParser } from './CartridgeHeaderParser';
import { CPU } from './CPU';
import { SerialPort } from './serialPort';
import { HeaderInfo, Memory, u16, u8 } from './types';

export class Emulator {
  cpu: CPU;
  memory: Memory;
  cartridge: Memory;
  cartHeaderInfo: HeaderInfo;
  serialPort: SerialPort;

  constructor(romFile: Buffer, delay?: number, debug?: boolean) {
    this.cpu = new CPU(
      this.memoryRead.bind(this),
      this.memoryWrite.bind(this),
      delay,
      debug
    );
    this.memory = new Uint8Array(0x10000).fill(0);
    this.cartridge = romFile;
    this.memory = new Uint8Array([
      ...this.cartridge.slice(0, 0x8000),
      ...this.memory.slice(0x8000),
    ]);
    this.memory[0xff44] = 0x90; // For testing purposes
    this.memory[0xff0f] = 0;
    this.memory[0xffff] = 0;
    this.cartHeaderInfo = new CartridgeHeaderParser(romFile).getHeaderInfo();
    this.serialPort = new SerialPort();
  }

  memoryWrite(address: u16, value: u8): void {
    if (address >= 0xff01 && address <= 0xff02) {
      this.serialPort.write(address, value);
    }

    // 8 KiB Video RAM (VRAM)
    if (address >= 0x8000 && address <= 0x9fff) {
      this.memory[address] = value;
      return;
    }

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

    // 4 KiB Work RAM (WRAM)
    if (address >= 0xc000 && address <= 0xcfff) {
      this.memory[address] = value;
      return;
    }

    throw new Error(
      `Trying write ${value.toString(16)} to the address: ${address.toString(16)} This address was not implemented for writing`
    );
  }

  memoryRead(address: u16): u8 {
    if (address >= 0xff01 && address <= 0xff02) {
      return this.serialPort.read(address);
    }

    return this.memory[address];
  }

  start() {
    this.cpu.execute();
  }
}
