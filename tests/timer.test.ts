import { CPU } from '../src/CPU';
import { Emulator } from '../src/emulator';
import { Instructions } from '../src/instructions';

let emu: Emulator;
let cpu: CPU;

beforeEach(() => {
  emu = new Emulator(Buffer.alloc(0x200000));
  cpu = emu.cpu;
  emu.update = jest.fn(async function () {
    const cycles = await this.cpu.execute();
    this.updateTimers(cycles);
    this.cpu.doInterrupts();
  });
  emu.memory[0xff07] = 0x04;
});

describe('Initial tests', () => {
  it('should increment TIMA properly at TAC=0', async () => {
    cpu.memWrite(0xff07, 0x04);
    expect(emu.mTimerCounter).toBe(1024);
    for (let i = 0; i < 256; i++) {
      emu.memory[0x100 + i] = 0x00;
      await emu.update();
    }
    expect(emu.memory[0xff05]).toBe(1);
  });

  it('should increment TIMA properly at TAC=1', async () => {
    cpu.memWrite(0xff07, 0x05);
    expect(emu.mTimerCounter).toBe(16);
    for (let i = 0; i < 4; i++) {
      emu.memory[0x100 + i] = 0x00;
      await emu.update();
    }
    expect(emu.memory[0xff05]).toBe(1);
  });

  it('should increment TIMA properly at TAC=2', async () => {
    cpu.memWrite(0xff07, 0x06);
    expect(emu.mTimerCounter).toBe(64);
    for (let i = 0; i < 16; i++) {
      emu.memory[0x100 + i] = 0x00;
      await emu.update();
    }
    expect(emu.memory[0xff05]).toBe(1);
  });

  it('should increment TIMA properly at TAC=3', async () => {
    cpu.memWrite(0xff07, 0x07);
    expect(emu.mTimerCounter).toBe(256);
    for (let i = 0; i < 64; i++) {
      emu.memory[0x100 + i] = 0x00;
      await emu.update();
    }
    expect(emu.memory[0xff05]).toBe(1);
  });

  it('should increment DIV properly at TAC=3', async () => {
    cpu.memWrite(0xff07, 0x07);
    expect(emu.mTimerCounter).toBe(256);
    for (let i = 0; i < 64; i++) {
      emu.memory[0x100 + i] = 0x00;
      await emu.update();
    }
    expect(emu.memory[0xff04]).toBe(0x01);
  });

  it('should reset DIV to 0 on write', () => {
    emu.memory[0xff04] = 0x01;
    cpu.memWrite(0xff04, 1);
    expect(emu.memory[0xff04]).toBe(0x00);
  });

  it('should increment TIMA mid-instruction (LD (a16), SP)', async () => {
    cpu.memWrite(0xff07, 0x05);
    emu.memory[0x100] = 0x08;
    emu.memory[0x101] = 0x00;
    emu.memory[0x102] = 0xff;
    await emu.update();
    expect(emu.memory[0xff05]).toBe(1);
  });

  it('should increment TIMA to 255 and check for interrupt', async () => {
    cpu.memWrite(0xff07, 0x05);
    expect(emu.mTimerCounter).toBe(16);
    for (let j = 0; j < 256; j++) {
      for (let i = 0; i < 4; i++) {
        emu.memory[0x100 + i] = 0x00;
        await emu.update();
      }
    }
    expect(emu.memory[0xff05]).toBe(0);
    expect(emu.memory[0xff0f]).toBe(4);
  });
});
