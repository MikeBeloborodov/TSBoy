import { CartridgeHeaderParser } from './CartridgeHeaderParser';
import { CPU } from './CPU';
import { SerialPort } from './serialPort';
import { HeaderInfo, Memory, u16, u8 } from './types';

export const DIV_ADDR = 0xff04;
export const TIMA_ADDR = 0xff05;
export const TMA_ADDR = 0xff06;
export const TAC_ADDR = 0xff07;

export const CLOCK_SPEED = 4194304;
// clock speed / 60 frames per second
export const MAXCYCLESPERFRAME = 69905;

export class Emulator {
  cpu: CPU;
  memory: Memory = new Uint8Array(0x10000).fill(0);
  cartridge: Memory;
  cartHeaderInfo: HeaderInfo;
  serialPort: SerialPort = new SerialPort();
  mTimerCounter: number = 1024;
  mDividerCounter: number = 0;

  constructor(romFile: Buffer, delay?: number, debug?: boolean) {
    this.cpu = new CPU(
      this.memoryRead.bind(this),
      this.memoryWrite.bind(this),
      delay,
      debug
    );
    this.cartridge = romFile;
    this.memory = new Uint8Array([
      ...this.cartridge.slice(0, 0x8000),
      ...this.memory.slice(0x8000),
    ]);
    this.memory[0xff44] = 0x90; // For testing purposes
    this.memory[0xff0f] = 0;
    this.memory[0xffff] = 0;
    this.cartHeaderInfo = new CartridgeHeaderParser(romFile).getHeaderInfo();
  }

  memoryWrite(address: u16, value: u8): void {
    if (address == TAC_ADDR) {
      this.memory[TAC_ADDR] = value;
      this.setClockFrequency();
      return;
    }

    if (address == DIV_ADDR) {
      this.mDividerCounter = 0;
      this.memory[DIV_ADDR] = 0;
      return;
    }

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
      if (address == 0xff0f || address == 0xffff) {
        this.memory[address] = value;
        return;
      }
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

  isClockEnabled(): number {
    const TAC = this.memory[TAC_ADDR];
    return TAC & 0x04;
  }

  getClockFrequency(): number {
    const TAC = this.memory[TAC_ADDR];
    return TAC & 0x03;
  }

  setClockFrequency(): void {
    const frequency = this.getClockFrequency();

    switch (frequency) {
      case 0:
        this.mTimerCounter = 1024;
        break;
      case 1:
        this.mTimerCounter = 16;
        break;
      case 2:
        this.mTimerCounter = 64;
        break;
      case 3:
        this.mTimerCounter = 256;
        break;
    }
  }

  doDividerRegister(cycles: number): void {
    this.mDividerCounter += cycles;

    if (this.mDividerCounter >= 256) {
      this.mDividerCounter -= 256;
      this.memory[DIV_ADDR]++;
    }
  }

  updateTimers(cycles: number): void {
    this.doDividerRegister(cycles);

    if (this.isClockEnabled()) {
      this.mTimerCounter -= cycles;

      while (this.mTimerCounter <= 0) {
        const overshoot = this.mTimerCounter;
        this.setClockFrequency();
        this.mTimerCounter += overshoot;

        if (this.memory[TIMA_ADDR] === 0xff) {
          this.memory[TIMA_ADDR] = this.memory[TMA_ADDR];
          this.cpu.requestInterrupt(2);
        } else {
          this.memory[TIMA_ADDR] += 1;
        }
      }
    }
  }

  async update() {
    let cyclesThisUpdate = 0;

    while (cyclesThisUpdate < MAXCYCLESPERFRAME) {
      if (this.cpu.pc > 0xffff) {
        throw new Error('Program counter overflow');
      }
      const cycles = await this.cpu.execute();
      cyclesThisUpdate += cycles;
      this.updateTimers(cycles);
      // this.updateGraphics(cycles);
      this.cpu.doInterrupts();
    }

    // this.renderScreen();
  }

  async start() {
    while (true) {
      await this.update();
    }
  }
}
