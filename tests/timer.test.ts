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
  it('should increment TIMA properly', async () => {
    for (let i = 0; i < 4; i++) {
      emu.memory[0x100 + i] = 0x00;
      await emu.update();
    }
    expect(emu.memory[0xff05]).toBe(1);
  });
});
