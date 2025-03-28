import { CPU } from '../src/CPU';
import { Emulator } from '../src/emulator';
import { Instructions } from '../src/instructions';
import { CombinedRegister } from '../src/types';

let emu: Emulator;
let cpu: CPU;

beforeEach(() => {
  emu = new Emulator(Buffer.alloc(0x200000));
  cpu = emu.cpu;
  emu.update = jest.fn(function () {
    const cycles = this.cpu.execute();
    this.updateTimers(cycles);
    this.cpu.doInterrupts();
  });
});

describe('Tests for CPU instructions', () => {
  describe('Tests for 0xc3 - JP a16', () => {
    it('should jump to a correct address', () => {
      cpu.memRead = jest.fn((address: number) => {
        if (address === 0x0101) return 0xab;
        return 0xcd;
      });
      Instructions[0xc3].execute(cpu);
    });
  });

  describe('Tests for 0xaf - XOR A, A', () => {
    it('should set register A to 0', () => {
      Instructions[0xaf].execute(cpu);
      expect(cpu.registers.a).toBe(0);
    });

    it('should set flags to 1 0 0 0', () => {
      Instructions[0xaf].execute(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests for 0x21 - LD HL, n16', () => {
    it('should load data into HL correctly', () => {
      cpu.memRead = jest.fn((address: number) => {
        if (address === 0x0100) return 0xab;
        return 0xcd;
      });
      Instructions[0x21].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0xcdab);
      expect(cpu.registers.h).toBe(0xcd);
      expect(cpu.registers.l).toBe(0xab);
    });
  });

  describe('Tests for 0x0e - LD C, n8', () => {
    it('should write value to the C register correctly', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x0e].execute(cpu);
      expect(cpu.registers.c).toBe(0xab);
    });
  });

  describe('Tests for 0x06 - LD B, n8', () => {
    it('should write value to the B register correctly', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x06].execute(cpu);
      expect(cpu.registers.b).toBe(0xab);
    });
  });

  describe('Tests for 0x3e - LD A, n8', () => {
    it('should write value to the A register correctly', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x3e].execute(cpu);
      expect(cpu.registers.a).toBe(0xab);
    });
  });

  describe('Tests for 0x32 - LD [HL-], A', () => {
    beforeEach(() => {
      cpu.registers.a = 0xcc;
      cpu.registers.h = 0xdf;
      cpu.registers.l = 0xff;
    });

    it('should write value from register A to the address of HL', () => {
      Instructions[0x32].execute(cpu);
      expect(emu.memory[0xdfff]).toBe(0xcc);
    });

    it('should decrement HL by 1', () => {
      Instructions[0x32].execute(cpu);
      expect(cpu.registers.h).toBe(0xdf);
      expect(cpu.registers.l).toBe(0xfe);
    });
  });

  describe('Tests for 0x05 - DEC B', () => {
    it('should decrement register B correctly', () => {
      cpu.registers.b = 0x01;
      Instructions[0x05].execute(cpu);
      expect(cpu.registers.b).toBe(0x00);
    });

    it('should set flags to 1 1 0 0', () => {
      cpu.registers.b = 0x01;
      Instructions[0x05].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should set half carry flag to 1', () => {
      cpu.registers.b = 0x10;
      Instructions[0x05].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should check register b overflow from 0 to 0xff', () => {
      cpu.registers.b = 0x00;
      Instructions[0x05].execute(cpu);
      expect(cpu.registers.b).toBe(0xff);
    });
  });

  describe('Tests for 0x20 - JR NZ, e8', () => {
    it('should jump forward', () => {
      cpu.registers.f = 0x00;
      cpu.memRead = jest.fn(() => 0x05);
      Instructions[0x20].execute(cpu);
    });

    it('should get negative 8bit and jump backward', () => {
      cpu.registers.f = 0x00;
      cpu.memRead = jest.fn(() => 0xfb);
      Instructions[0x20].execute(cpu);
    });

    it('should not jump if Z flag is set', () => {
      cpu.registers.f = 0x80;
      cpu.memRead = jest.fn(() => 0x05);
      Instructions[0x20].execute(cpu);
    });
  });

  describe('Tests for 0xe0 - LDH [a8], A', () => {
    beforeEach(() => {
      cpu.registers.a = 0x12;
    });

    it('should write value from register A to the correct address', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0xe0].execute(cpu);
      expect(emu.memory[0xffab]).toBe(0x12);
    });

    it('should write to the edge of the memory', () => {
      cpu.memRead = jest.fn(() => 0xff);
      Instructions[0xe0].execute(cpu);
      expect(emu.memory[0xffff]).toBe(0x12);
    });

    it('should write to the beginning of the memory', () => {
      cpu.memRead = jest.fn(() => 0x00);
      Instructions[0xe0].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });
  });

  describe('Tests for 0xf0 - LDH A, [a8]', () => {
    it('should write value from the correct address to register A', () => {
      emu.memory[0xffab] = 0x12;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0xab;
        return emu.memory[address];
      });
      Instructions[0xf0].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should read from the edge of the memory', () => {
      emu.memory[0xffff] = 0x12;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0xff;
        return emu.memory[address];
      });
      Instructions[0xf0].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should read from the beginning of the memory', () => {
      emu.memory[0xff00] = 0x12;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0x00;
        return emu.memory[address];
      });
      Instructions[0xf0].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });
  });

  describe('Tests for 0xfe - CP n8', () => {
    it('should subtract correctly', () => {
      cpu.registers.a = 0x01;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
    });

    it('should set flags correctly', () => {
      cpu.registers.a = 0x01;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].execute(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should set flags correctly', () => {
      cpu.registers.a = 0x10;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].execute(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should set flags correctly', () => {
      cpu.registers.a = 0x00;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].execute(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });
  });

  describe('Tests for LD instructions 0x40 - 0x4f', () => {
    it('should test LD B, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x40].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x41].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x42].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x43].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x44].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x45].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x46].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD B, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x47].execute(cpu);
      expect(cpu.registers.b).toBe(0x12);
    });

    it('should test LD C, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x48].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x49].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x4a].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x4b].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x4c].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x4d].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x4e].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });

    it('should test LD C, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x4f].execute(cpu);
      expect(cpu.registers.c).toBe(0x12);
    });
  });

  describe('Tests for LD instructions 0x50 - 0x5f', () => {
    it('should test LD D, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x50].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x51].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x52].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x53].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x54].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x55].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x56].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD D, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x57].execute(cpu);
      expect(cpu.registers.d).toBe(0x12);
    });

    it('should test LD E, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x58].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x59].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x5a].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x5b].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x5c].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x5d].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x5e].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });

    it('should test LD E, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x5f].execute(cpu);
      expect(cpu.registers.e).toBe(0x12);
    });
  });

  describe('Tests for LD instructions 0x60 - 0x6f', () => {
    it('should test LD H, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x60].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x61].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x62].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x63].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x64].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x65].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x66].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD H, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x67].execute(cpu);
      expect(cpu.registers.h).toBe(0x12);
    });

    it('should test LD L, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x68].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x69].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x6a].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x6b].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x6c].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x6d].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x6e].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });

    it('should test LD L, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x6f].execute(cpu);
      expect(cpu.registers.l).toBe(0x12);
    });
  });

  describe('Tests for LD instructions 0x70 - 0x7f', () => {
    it('should test LD (HL), B', () => {
      cpu.registers.b = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x70].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test LD (HL), C', () => {
      cpu.registers.c = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x71].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test LD (HL), D', () => {
      cpu.registers.d = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x72].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test LD (HL), E', () => {
      cpu.registers.e = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x73].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test LD (HL), H', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x74].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xff);
    });

    it('should test LD (HL), L', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x01;
      Instructions[0x75].execute(cpu);
      expect(emu.memory[0xff01]).toBe(0x01);
    });

    // it('should test HALT', () => {
    //   Instructions[0x76].execute(cpu);
    //   expect(cpu.halted).toBe(true);
    // });

    it('should test LD (HL), A', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x77].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test LD A, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x78].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x79].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x7a].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x7b].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x7c].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x7d].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x7e].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test LD A, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x7f].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });
  });

  describe('Tests for other LD instructions', () => {
    it('should test 0x01 - LD BC, n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0xab;
        return 0xcd;
      });
      Instructions[0x01].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0xcdab);
    });

    it('should test 0x11 - LD DE, n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0xab;
        return 0xcd;
      });
      Instructions[0x11].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xcdab);
    });

    it('should test 0x31 - LD SP, n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0xab;
        return 0xcd;
      });
      Instructions[0x31].execute(cpu);
      expect(cpu.sp).toBe(0xcdab);
    });

    it('should test 0x02 - LD (BC), A', () => {
      cpu.registers.b = 0xff;
      cpu.registers.c = 0x00;
      cpu.registers.a = 0x12;
      Instructions[0x02].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test 0x12 - LD (DE), A', () => {
      cpu.registers.d = 0xff;
      cpu.registers.e = 0x00;
      cpu.registers.a = 0x12;
      Instructions[0x12].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });

    it('should test 0x22 - LD (HL+), A', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      cpu.registers.a = 0x12;
      Instructions[0x22].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.registers.h).toBe(0xff);
      expect(cpu.registers.l).toBe(0x01);
    });

    it('should test 0x16 - LD D, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x16].execute(cpu);
      expect(cpu.registers.d).toBe(0xab);
    });

    it('should test 0x26 - LD H, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x26].execute(cpu);
      expect(cpu.registers.h).toBe(0xab);
    });

    it('should test 0x36 - LD (HL), n8', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x36].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xab);
    });

    it('should test 0x0a - LD A, (BC)', () => {
      cpu.registers.b = 0xff;
      cpu.registers.c = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x0a].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test 0x1a - LD A, (DE)', () => {
      cpu.registers.d = 0xff;
      cpu.registers.e = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x1a].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test 0x2a - LD A, (HL+)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x2a].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.registers.h).toBe(0xff);
      expect(cpu.registers.l).toBe(0x01);
    });

    it('should test 0x3a - LD A, (HL-)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x3a].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.registers.h).toBe(0xfe);
      expect(cpu.registers.l).toBe(0xff);
    });

    it('should test 0x1e - LD E, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x1e].execute(cpu);
      expect(cpu.registers.e).toBe(0xab);
    });

    it('should test 0x2e - LD L, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x2e].execute(cpu);
      expect(cpu.registers.l).toBe(0xab);
    });

    it('should test 0x08 - LD (n16), SP', () => {
      cpu.sp = 0xa0b0;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0x00;
        return 0xff;
      });
      Instructions[0x08].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xb0);
      expect(emu.memory[0xff01]).toBe(0xa0);
    });

    it('should test 0xe2 - LD (C), A', () => {
      cpu.registers.c = 0x12;
      cpu.registers.a = 0xab;
      Instructions[0xe2].execute(cpu);
      expect(emu.memory[0xff12]).toBe(0xab);
    });

    it('should test 0xf2 - LD A, (C)', () => {
      cpu.registers.c = 0x12;
      emu.memory[0xff12] = 0xab;
      Instructions[0xf2].execute(cpu);
      expect(cpu.registers.a).toBe(0xab);
    });

    it('should test 0xea - LD (n16), A', () => {
      cpu.registers.a = 0xab;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0x00;
        return 0xff;
      });
      Instructions[0xea].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xab);
    });

    it('should test 0xfa - LD A, (n16)', () => {
      emu.memory[0x0100] = 0x00;
      emu.memory[0x0101] = 0xff;
      emu.memory[0xff00] = 0xab;
      Instructions[0xfa].execute(cpu);
      expect(cpu.registers.a).toBe(0xab);
    });

    it('should test 0xf9 - LD SP, HL', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      Instructions[0xf9].execute(cpu);
      expect(cpu.sp).toBe(0xabcd);
    });
  });

  describe('Tests for INC instructions', () => {
    it('should test 0x04 - INC B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x04].execute(cpu);
      expect(cpu.registers.b).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x04 - INC B half-carry', () => {
      cpu.registers.b = 0x0f;
      Instructions[0x04].execute(cpu);
      expect(cpu.registers.b).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x04 - INC B zero', () => {
      cpu.registers.b = 0xff;
      Instructions[0x04].execute(cpu);
      expect(cpu.registers.b).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x14 - INC D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x14].execute(cpu);
      expect(cpu.registers.d).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x14 - INC D half-carry', () => {
      cpu.registers.d = 0x0f;
      Instructions[0x14].execute(cpu);
      expect(cpu.registers.d).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x14 - INC D zero', () => {
      cpu.registers.d = 0xff;
      Instructions[0x14].execute(cpu);
      expect(cpu.registers.d).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x24 - INC H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x24].execute(cpu);
      expect(cpu.registers.h).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x24 - INC H half-carry', () => {
      cpu.registers.h = 0x0f;
      Instructions[0x24].execute(cpu);
      expect(cpu.registers.h).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x24 - INC H zero', () => {
      cpu.registers.h = 0xff;
      Instructions[0x24].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x34 - INC (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x34].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x34 - INC (HL) half-carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x0f;
      Instructions[0x34].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x34 - INC (HL) zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      Instructions[0x34].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x0c - INC C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x0c].execute(cpu);
      expect(cpu.registers.c).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x0c - INC C half-carry', () => {
      cpu.registers.c = 0x0f;
      Instructions[0x0c].execute(cpu);
      expect(cpu.registers.c).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x0c - INC C zero', () => {
      cpu.registers.c = 0xff;
      Instructions[0x0c].execute(cpu);
      expect(cpu.registers.c).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x1c - INC E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x1c].execute(cpu);
      expect(cpu.registers.e).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x1c - INC E half-carry', () => {
      cpu.registers.e = 0x0f;
      Instructions[0x1c].execute(cpu);
      expect(cpu.registers.e).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x1c - INC E zero', () => {
      cpu.registers.e = 0xff;
      Instructions[0x1c].execute(cpu);
      expect(cpu.registers.e).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x2c - INC L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x2c].execute(cpu);
      expect(cpu.registers.l).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x2c - INC L half-carry', () => {
      cpu.registers.l = 0x0f;
      Instructions[0x2c].execute(cpu);
      expect(cpu.registers.l).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x2c - INC L zero', () => {
      cpu.registers.l = 0xff;
      Instructions[0x2c].execute(cpu);
      expect(cpu.registers.l).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x3c - INC A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x3c].execute(cpu);
      expect(cpu.registers.a).toBe(0x13);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x3c - INC A half-carry', () => {
      cpu.registers.a = 0x0f;
      Instructions[0x3c].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x3c - INC A zero', () => {
      cpu.registers.a = 0xff;
      Instructions[0x3c].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });
  });

  describe('Tests for 0xcd - CALL n16', () => {
    it('should test CALL n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0100) return 0x00;
        return 0xff;
      });
      Instructions[0xcd].execute(cpu);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xfffc]).toBe(0x02);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests for JR instructions e8, Z, C ', () => {
    it('should test JR e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      Instructions[0x18].execute(cpu);
    });

    it('should test JR e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      Instructions[0x18].execute(cpu);
    });

    it('should test JR Z, e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ Z: 1 });
      Instructions[0x28].execute(cpu);
    });

    it('should test JR Z, e8 no jump', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ Z: 0 });
      Instructions[0x28].execute(cpu);
    });

    it('should test JR Z, e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      cpu.setFlags({ Z: 1 });
      Instructions[0x28].execute(cpu);
    });

    it('should test JR C, e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 1 });
      Instructions[0x38].execute(cpu);
    });

    it('should test JR C, e8 no jump', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 0 });
      Instructions[0x38].execute(cpu);
    });

    it('should test JR C, e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      cpu.setFlags({ C: 1 });
      Instructions[0x38].execute(cpu);
    });

    it('shoult test 0x30 - JR NC, e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 0 });
      Instructions[0x30].execute(cpu);
    });

    it('shoult test 0x30 - JR NC, e8 no jump', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 1 });
      Instructions[0x30].execute(cpu);
    });

    it('shoult test 0x30 - JR NC, e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      cpu.setFlags({ C: 0 });
      Instructions[0x30].execute(cpu);
    });
  });

  describe('Tests for A instructions', () => {
    it('should test ADD A, n8', () => {
      cpu.memRead = jest.fn(() => 0x12);
      cpu.registers.a = 0x12;
      Instructions[0xc6].execute(cpu);
      expect(cpu.registers.a).toBe(0x24);
    });

    it('should test ADD A, n8 half-carry', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x0f;
      Instructions[0xc6].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test ADD A, n8 zero', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0xff;
      Instructions[0xc6].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0xd6 - SUB A n8', () => {
      cpu.memRead = jest.fn(() => 0x12);
      cpu.registers.a = 0x24;
      Instructions[0xd6].execute(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should test 0xd6 - SUB A n8 half-carry', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x10;
      Instructions[0xd6].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0xd6 - SUB A n8 zero', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x01;
      Instructions[0xd6].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });
  });

  describe('Tests for push and pop instructions', () => {
    it('should test 0xc1 - POP BC', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xc1].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0xcdab);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xd1 - POP DE', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xd1].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xcdab);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xe1 - POP HL', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xe1].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0xcdab);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xf1 - POP AF', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xf1].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.AF)).toBe(0xcda0);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xf1 flags', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xf0;
      emu.memory[0xfffd] = 0x00;
      Instructions[0xf1].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 1, C: 1 });
    });

    it('should test 0xc5 - PUSH BC', () => {
      cpu.setCombinedRegister(CombinedRegister.BC, 0xcdab);
      Instructions[0xc5].execute(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xd5 - PUSH DE', () => {
      cpu.setCombinedRegister(CombinedRegister.DE, 0xcdab);
      Instructions[0xd5].execute(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xe5 - PUSH HL', () => {
      cpu.setCombinedRegister(CombinedRegister.HL, 0xcdab);
      Instructions[0xe5].execute(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xf5 - PUSH AF', () => {
      cpu.setCombinedRegister(CombinedRegister.AF, 0xcdab);
      Instructions[0xf5].execute(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xa0);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests for INC instructions', () => {
    it('should test 0x03 - INC BC', () => {
      cpu.setCombinedRegister(CombinedRegister.BC, 0xabcd);
      Instructions[0x03].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0xabce);
    });

    it('shoult text 0x03 - INC BC overflow', () => {
      cpu.setCombinedRegister(CombinedRegister.BC, 0xffff);
      Instructions[0x03].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0x0000);
    });

    it('should test 0x13 - INC DE', () => {
      cpu.setCombinedRegister(CombinedRegister.DE, 0xabcd);
      Instructions[0x13].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xabce);
    });

    it('shoud test 0x13 - INC DE overflow', () => {
      cpu.setCombinedRegister(CombinedRegister.DE, 0xffff);
      Instructions[0x13].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0x0000);
    });

    it('should test 0x23 - INC HL', () => {
      cpu.setCombinedRegister(CombinedRegister.HL, 0xabcd);
      Instructions[0x23].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0xabce);
    });

    it('shoud test 0x23 - INC HL overflow', () => {
      cpu.setCombinedRegister(CombinedRegister.HL, 0xffff);
      Instructions[0x23].execute(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0x0000);
    });

    it('should test 0x33 - INC SP', () => {
      cpu.sp = 0xabcd;
      Instructions[0x33].execute(cpu);
      expect(cpu.sp).toBe(0xabce);
    });

    it('shoud test 0x33 - INC SP overflow', () => {
      cpu.sp = 0xffff;
      Instructions[0x33].execute(cpu);
      expect(cpu.sp).toBe(0x0000);
    });
  });

  describe('tests for 0x80 - 0x8f', () => {
    it('should test 0x80 - ADD A, B', () => {
      cpu.registers.a = 0x12;
      cpu.registers.b = 0x34;
      Instructions[0x80].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x80 - ADD A, B half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.b = 0x01;
      Instructions[0x80].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x80 - ADD A, B carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.b = 0x01;
      Instructions[0x80].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x80 - ADD A, B zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.b = 0x01;
      Instructions[0x80].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x81 - ADD A, C', () => {
      cpu.registers.a = 0x12;
      cpu.registers.c = 0x34;
      Instructions[0x81].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x81 - ADD A, C half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.c = 0x01;
      Instructions[0x81].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x81 - ADD A, C carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.c = 0x01;
      Instructions[0x81].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x81 - ADD A, C zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.c = 0x01;
      Instructions[0x81].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x82 - ADD A, D', () => {
      cpu.registers.a = 0x12;
      cpu.registers.d = 0x34;
      Instructions[0x82].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x82 - ADD A, D half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.d = 0x01;
      Instructions[0x82].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x82 - ADD A, D carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.d = 0x01;
      Instructions[0x82].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x82 - ADD A, D zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.d = 0x01;
      Instructions[0x82].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x83 - ADD A, E', () => {
      cpu.registers.a = 0x12;
      cpu.registers.e = 0x34;
      Instructions[0x83].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x83 - ADD A, E half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.e = 0x01;
      Instructions[0x83].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x83 - ADD A, E carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.e = 0x01;
      Instructions[0x83].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x83 - ADD A, E zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.e = 0x01;
      Instructions[0x83].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x84 - ADD A, H', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0x34;
      Instructions[0x84].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x84 - ADD A, H half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0x01;
      Instructions[0x84].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x84 - ADD A, H carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x01;
      Instructions[0x84].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x84 - ADD A, H zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x01;
      Instructions[0x84].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x85 - ADD A, L', () => {
      cpu.registers.a = 0x12;
      cpu.registers.l = 0x34;
      Instructions[0x85].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x85 - ADD A, L half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.l = 0x01;
      Instructions[0x85].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x85 - ADD A, L carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.l = 0x01;
      Instructions[0x85].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x85 - ADD A, L zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.l = 0x01;
      Instructions[0x85].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x86 - ADD A, (HL)', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x34;
      Instructions[0x86].execute(cpu);
      expect(cpu.registers.a).toBe(0x46);
    });

    it('should test 0x86 - ADD A, (HL) half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x86].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x86 - ADD A, (HL) carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x86].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x86 - ADD A, (HL) zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x86].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x87 - ADD A, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x87].execute(cpu);
      expect(cpu.registers.a).toBe(0x24);
    });

    it('should test 0x87 - ADD A, A half-carry', () => {
      cpu.registers.a = 0x0f;
      Instructions[0x87].execute(cpu);
      expect(cpu.registers.a).toBe(0x1e);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x87 - ADD A, A carry', () => {
      cpu.registers.a = 0xff;
      Instructions[0x87].execute(cpu);
      expect(cpu.registers.a).toBe(0xfe);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x87 - ADD A, A zero', () => {
      cpu.registers.a = 0xff;
      Instructions[0x87].execute(cpu);
      expect(cpu.registers.a).toBe(0xfe);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x88 - ADC A, B', () => {
      cpu.registers.a = 0x12;
      cpu.registers.b = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].execute(cpu);
      expect(cpu.registers.a).toBe(0x47);
    });

    it('should test 0x88 - ADC A, B half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x88 - ADC A, B carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x88 - ADC A, B zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x89 - ADC A, C', () => {
      cpu.registers.a = 0x12;
      cpu.registers.c = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].execute(cpu);
      expect(cpu.registers.a).toBe(0x47);
    });

    it('should test 0x89 - ADC A, C half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x89 - ADC A, C carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x89 - ADC A, C zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8a - ADC A, D', () => {
      cpu.registers.a = 0x12;
      cpu.registers.d = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].execute(cpu);
      expect(cpu.registers.a).toBe(0x47);
    });

    it('should test 0x8a - ADC A, D half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8a - ADC A, D carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8a - ADC A, D zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8b - ADC A, E', () => {
      cpu.registers.a = 0x12;
      cpu.registers.e = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].execute(cpu);
      expect(cpu.registers.a).toBe(0x47);
    });

    it('should test 0x8b - ADC A, E half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8b - ADC A, E carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8b - ADC A, E zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8c - ADC A, H', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].execute(cpu);
      expect(cpu.registers.a).toBe(0x47);
    });

    it('should test 0x8c - ADC A, H half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8c - ADC A, H carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8c - ADC A, H zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8d - ADC A, L', () => {
      cpu.registers.a = 0x12;
      cpu.registers.l = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].execute(cpu);
      expect(cpu.registers.a).toBe(0x47);
    });

    it('should test 0x8d - ADC A, L half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8d - ADC A, L carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8d - ADC A, L zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8e - ADC A, (HL)', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].execute(cpu);
      expect(cpu.registers.a).toBe(0x14);
    });

    it('should test 0x8e - ADC A, (HL) half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8e - ADC A, (HL) carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8e - ADC A, (HL) zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8f - ADC A, A', () => {
      cpu.registers.a = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x8f].execute(cpu);
      expect(cpu.registers.a).toBe(0x11);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0x8f - ADC A, A carry', () => {
      cpu.registers.a = 0xf1;
      cpu.setFlags({ C: 1 });
      Instructions[0x8f].execute(cpu);
      expect(cpu.registers.a).toBe(0xe3);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x8f - ADC A, A zero', () => {
      cpu.registers.a = 0x80;
      cpu.setFlags({ C: 1 });
      Instructions[0x8f].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });
  });

  describe('Tests for SUB instructions', () => {
    it('should test 0x90 - SUB A, B', () => {
      cpu.registers.a = 0x08;
      cpu.registers.b = 0x08;
      Instructions[0x90].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x90 - SUB A, B half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.b = 0x01;
      Instructions[0x90].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x90 - SUB A, B carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.b = 0x01;
      Instructions[0x90].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x90 - SUB A, B zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.b = 0x08;
      Instructions[0x90].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xd6 - SUB A n8 carry', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x00;
      Instructions[0xd6].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x91 - SUB A, C', () => {
      cpu.registers.a = 0x08;
      cpu.registers.c = 0x08;
      Instructions[0x91].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x91 - SUB A, C half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.c = 0x01;
      Instructions[0x91].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x91 - SUB A, C carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.c = 0x01;
      Instructions[0x91].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x91 - SUB A, C zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.c = 0x08;
      Instructions[0x91].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x92 - SUB A, D', () => {
      cpu.registers.a = 0x08;
      cpu.registers.d = 0x08;
      Instructions[0x92].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x92 - SUB A, D half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.d = 0x01;
      Instructions[0x92].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x92 - SUB A, D carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.d = 0x01;
      Instructions[0x92].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x92 - SUB A, D zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.d = 0x08;
      Instructions[0x92].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x93 - SUB A, E', () => {
      cpu.registers.a = 0x08;
      cpu.registers.e = 0x08;
      Instructions[0x93].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x93 - SUB A, E half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.e = 0x01;
      Instructions[0x93].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x93 - SUB A, E carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.e = 0x01;
      Instructions[0x93].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x93 - SUB A, E zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.e = 0x08;
      Instructions[0x93].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x94 - SUB A, H', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0x08;
      Instructions[0x94].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x94 - SUB A, H half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.h = 0x01;
      Instructions[0x94].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x94 - SUB A, H carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.h = 0x01;
      Instructions[0x94].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x94 - SUB A, H zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0x08;
      Instructions[0x94].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x95 - SUB A, L', () => {
      cpu.registers.a = 0x08;
      cpu.registers.l = 0x08;
      Instructions[0x95].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x95 - SUB A, L half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.l = 0x01;
      Instructions[0x95].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x95 - SUB A, L carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.l = 0x01;
      Instructions[0x95].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x95 - SUB A, L zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.l = 0x08;
      Instructions[0x95].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x96 - SUB A, (HL)', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x08;
      Instructions[0x96].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x96 - SUB A, (HL) half-carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x96].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x96 - SUB A, (HL) carry', () => {
      cpu.registers.a = 0x00;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x96].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x96 - SUB A, (HL) zero', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x08;
      Instructions[0x96].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x97 - SUB A, A', () => {
      cpu.registers.a = 0x08;
      Instructions[0x97].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });
  });

  describe('Tests SBC A instructions', () => {
    it('should test 0x98 - SBC A, B', () => {
      cpu.registers.a = 0x08;
      cpu.registers.b = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x98].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x98 - SBC A, B without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.b = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x98].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x98 - SBC A, B without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.b = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x98].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x98 - SBC A, B zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.b = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x98].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x98 - SBC A, B half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x98].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x99 - SBC A, C', () => {
      cpu.registers.a = 0x08;
      cpu.registers.c = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x99].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x99 - SBC A, C without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.c = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x99].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x99 - SBC A, C without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.c = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x99].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x99 - SBC A, C zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.c = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x99].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x99 - SBC A, C half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x99].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x9a - SBC A, D', () => {
      cpu.registers.a = 0x08;
      cpu.registers.d = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9a].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x9a - SBC A, D without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.d = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x9a].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9a - SBC A, D without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.d = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x9a].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9a - SBC A, D zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.d = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9a].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9a - SBC A, D half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x9a].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x9b - SBC A, E', () => {
      cpu.registers.a = 0x08;
      cpu.registers.e = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9b].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x9b - SBC A, E without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.e = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x9b].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9b - SBC A, E without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.e = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x9b].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9b - SBC A, E zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.e = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9b].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9b - SBC A, E half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x9b].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x9c - SBC A, H', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9c].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x9c - SBC A, H without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x9c].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9c - SBC A, H without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x9c].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9c - SBC A, H zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.h = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9c].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9c - SBC A, H half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x9c].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x9d - SBC A, L', () => {
      cpu.registers.a = 0x08;
      cpu.registers.l = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9d].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x9d - SBC A, L without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.l = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x9d].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9d - SBC A, L without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.l = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x9d].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9d - SBC A, L zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.l = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9d].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9d - SBC A, L half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x9d].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x9e - SBC A, (HL)', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9e].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0x9e - SBC A, (HL) without carry flag', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x04;
      cpu.setFlags({ C: 0 });
      Instructions[0x9e].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9e - SBC A, (HL) without other registers', () => {
      cpu.registers.a = 0x08;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      cpu.setFlags({ C: 1 });
      Instructions[0x9e].execute(cpu);
      expect(cpu.registers.a).toBe(0x07);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9e - SBC A, (HL) zero', () => {
      cpu.registers.a = 0x09;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9e].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0x9e - SBC A, (HL) half-carry only', () => {
      cpu.registers.a = 0x10;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x9e].execute(cpu);
      expect(cpu.registers.a).toBe(0x0e);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0x9f - SBC A, A', () => {
      cpu.registers.a = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x9f].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });
  });

  describe('Tests for OR instructions', () => {
    it('should test 0xb0 - OR A, B', () => {
      cpu.registers.a = 0x00;
      cpu.registers.b = 0x01;
      Instructions[0xb0].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb0 - OR A, B zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.b = 0x00;
      Instructions[0xb0].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb1 - OR A, C', () => {
      cpu.registers.a = 0x00;
      cpu.registers.c = 0x01;
      Instructions[0xb1].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb1 - OR A, C zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.c = 0x00;
      Instructions[0xb1].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb2 - OR A, D', () => {
      cpu.registers.a = 0x00;
      cpu.registers.d = 0x01;
      Instructions[0xb2].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb2 - OR A, D zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.d = 0x00;
      Instructions[0xb2].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb3 - OR A, E', () => {
      cpu.registers.a = 0x00;
      cpu.registers.e = 0x01;
      Instructions[0xb3].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb3 - OR A, E zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.e = 0x00;
      Instructions[0xb3].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb4 - OR A, H', () => {
      cpu.registers.a = 0x00;
      cpu.registers.h = 0x01;
      Instructions[0xb4].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb4 - OR A, H zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.h = 0x00;
      Instructions[0xb4].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb5 - OR A, L', () => {
      cpu.registers.a = 0x00;
      cpu.registers.l = 0x01;
      Instructions[0xb5].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb5 - OR A, L zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.l = 0x00;
      Instructions[0xb5].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb6 - OR A, (HL)', () => {
      cpu.registers.a = 0x00;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0xb6].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb6 - OR A, (HL) zero', () => {
      cpu.registers.a = 0x00;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      Instructions[0xb6].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb7 - OR A, A not zero', () => {
      cpu.registers.a = 0x01;
      Instructions[0xb7].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xb7 - OR A, A zero', () => {
      cpu.registers.a = 0x00;
      Instructions[0xb7].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Test CP instructions', () => {
    it('should test 0xb8 - CP A, B zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.b = 0x01;
      Instructions[0xb8].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xb8 - CP A, B not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.b = 0x01;
      Instructions[0xb8].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xb8 - CP A, B half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.b = 0x01;
      Instructions[0xb8].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xb8 - CP A, B carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.b = 0x02;
      Instructions[0xb8].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xb9 - CP A, C zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.c = 0x01;
      Instructions[0xb9].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xb9 - CP A, C not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.c = 0x01;
      Instructions[0xb9].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xb9 - CP A, C half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.c = 0x01;
      Instructions[0xb9].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xb9 - CP A, C carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.c = 0x02;
      Instructions[0xb9].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xba - CP A, D zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.d = 0x01;
      Instructions[0xba].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xba - CP A, D not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.d = 0x01;
      Instructions[0xba].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xba - CP A, D half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.d = 0x01;
      Instructions[0xba].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xba - CP A, D carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.d = 0x02;
      Instructions[0xba].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xbb - CP A, E zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.e = 0x01;
      Instructions[0xbb].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xbb - CP A, E not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.e = 0x01;
      Instructions[0xbb].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xbb - CP A, E half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.e = 0x01;
      Instructions[0xbb].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xbb - CP A, E carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.e = 0x02;
      Instructions[0xbb].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xbc - CP A, H zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0x01;
      Instructions[0xbc].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xbc - CP A, H not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.h = 0x01;
      Instructions[0xbc].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xbc - CP A, H half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.h = 0x01;
      Instructions[0xbc].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xbc - CP A, H carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0x02;
      Instructions[0xbc].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xbd - CP A, L zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.l = 0x01;
      Instructions[0xbd].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xbd - CP A, L not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.l = 0x01;
      Instructions[0xbd].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xbd - CP A, L half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.l = 0x01;
      Instructions[0xbd].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xbd - CP A, L carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.l = 0x02;
      Instructions[0xbd].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xbe - CP A, (HL) zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0xbe].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xbe - CP A, (HL) not zero', () => {
      cpu.registers.a = 0x02;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0xbe].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('shoud test 0xbe - CP A, (HL) half carry', () => {
      cpu.registers.a = 0x10;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0xbe].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xbe - CP A, (HL) carry', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x02;
      Instructions[0xbe].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xbf - CP A, A zero', () => {
      cpu.registers.a = 0x01;
      Instructions[0xbf].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });
  });

  describe('Tests for 0xe6 - AND d8', () => {
    it('should test 0xe6 - AND 0x00', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0100] = 0x00;
      Instructions[0xe6].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xe6 - AND 0x01', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0100] = 0x01;
      Instructions[0xe6].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });
  });

  describe('Tests for 0xf6 - OR d8', () => {
    it('should test 0xf6 - OR 0x00', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0101] = 0x00;
      Instructions[0xf6].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xf6 - OR 0x01', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0101] = 0x01;
      Instructions[0xf6].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xf6 - OR 0x00', () => {
      cpu.registers.a = 0x00;
      emu.memory[0x0101] = 0x00;
      Instructions[0xf6].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests for 0xc4 - CALL NZ, a16', () => {
    it('should test 0xc4 - CALL NZ, zero', () => {
      cpu.sp = 0xfffe;
      Instructions[0xc4].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xc4 - CALL NZ, not zero', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ Z: 0 });
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0xff;
      Instructions[0xc4].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
      emu.memory[0xfffe] = 0x01;
      emu.memory[0xfffc] = 0x03;
    });
  });

  describe('Tests for 0xd4 - CALL NC, a16', () => {
    it('should test 0xd4 - CALL NC, carry', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ C: 1 });
      Instructions[0xd4].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xd4 - CALL NC, not carry', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ C: 0 });
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0xff;
      Instructions[0xd4].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
      emu.memory[0xfffe] = 0x01;
      emu.memory[0xfffc] = 0x03;
    });
  });

  describe('Tests for 0xcc - CALL Z, a16', () => {
    it('should test 0xcc - CALL Z, not zero flag', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ Z: 0 });
      Instructions[0xcc].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xcc - CALL Z, zero flag', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ Z: 1 });
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0xff;
      Instructions[0xcc].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests for 0xdc - CALL C, a16', () => {
    it('should test 0xdc - CALL C, not carry flag', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ C: 0 });
      Instructions[0xdc].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xdc - CALL C, carry flag', () => {
      cpu.sp = 0xfffe;
      cpu.setFlags({ C: 1 });
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0xff;
      Instructions[0xdc].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests for AND instructions', () => {
    it('should test 0xa0 - AND A, B', () => {
      cpu.registers.a = 0x01;
      cpu.registers.b = 0x01;
      Instructions[0xa0].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa0 - AND A, B, zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.b = 0x00;
      Instructions[0xa0].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa1 - AND A, C', () => {
      cpu.registers.a = 0x01;
      cpu.registers.c = 0x01;
      Instructions[0xa1].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa1 - AND A, C, zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.c = 0x00;
      Instructions[0xa1].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa2 - AND A, D', () => {
      cpu.registers.a = 0x01;
      cpu.registers.d = 0x01;
      Instructions[0xa2].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa2 - AND A, D, zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.d = 0x00;
      Instructions[0xa2].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa3 - AND A, E', () => {
      cpu.registers.a = 0x01;
      cpu.registers.e = 0x01;
      Instructions[0xa3].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa3 - AND A, E, zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.e = 0x00;
      Instructions[0xa3].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa4 - AND A, H', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0x01;
      Instructions[0xa4].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa4 - AND A, H, zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0x00;
      Instructions[0xa4].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa5 - AND A, L', () => {
      cpu.registers.a = 0x01;
      cpu.registers.l = 0x01;
      Instructions[0xa5].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa5 - AND A, L, zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.l = 0x00;
      Instructions[0xa5].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa6 - AND A, (HL)', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0xa6].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa6 - AND A, (HL), zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      Instructions[0xa6].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa7 - AND A, A', () => {
      cpu.registers.a = 0x01;
      Instructions[0xa7].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xa7 - AND A, A, zero', () => {
      cpu.registers.a = 0x00;
      Instructions[0xa7].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 0 });
    });
  });

  describe('Tests XOR instructions', () => {
    it('should test 0xa8 - XOR A, B', () => {
      cpu.registers.a = 0x01;
      cpu.registers.b = 0x00;
      Instructions[0xa8].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xa8 - XOR A, B zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.b = 0x01;
      Instructions[0xa8].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xa9 - XOR A, C', () => {
      cpu.registers.a = 0x01;
      cpu.registers.c = 0x00;
      Instructions[0xa9].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xa9 - XOR A, C zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.c = 0x01;
      Instructions[0xa9].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xaa - XOR A, D', () => {
      cpu.registers.a = 0x01;
      cpu.registers.d = 0x00;
      Instructions[0xaa].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xaa - XOR A, D zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.d = 0x01;
      Instructions[0xaa].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xab - XOR A, E', () => {
      cpu.registers.a = 0x01;
      cpu.registers.e = 0x00;
      Instructions[0xab].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xab - XOR A, E zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.e = 0x01;
      Instructions[0xab].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xac - XOR A, H', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0x00;
      Instructions[0xac].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xac - XOR A, H zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0x01;
      Instructions[0xac].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xad - XOR A, L', () => {
      cpu.registers.a = 0x01;
      cpu.registers.l = 0x00;
      Instructions[0xad].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xad - XOR A, L zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.l = 0x01;
      Instructions[0xad].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xae - XOR A, (HL)', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      Instructions[0xae].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xae - XOR A, (HL) zero', () => {
      cpu.registers.a = 0x01;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0xae].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests for DEC C, E, L, A', () => {
    it('should test 0x0d - DEC C', () => {
      cpu.registers.c = 0x01;
      Instructions[0x0d].execute(cpu);
      expect(cpu.registers.c).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should test 0x0d - DEC C half carry', () => {
      cpu.registers.c = 0x10;
      Instructions[0x0d].execute(cpu);
      expect(cpu.registers.c).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x0d - DEC C carry', () => {
      cpu.registers.c = 0x00;
      Instructions[0x0d].execute(cpu);
      expect(cpu.registers.c).toBe(0xff);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x1d - DEC E', () => {
      cpu.registers.e = 0x01;
      Instructions[0x1d].execute(cpu);
      expect(cpu.registers.e).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should test 0x1d - DEC E half carry', () => {
      cpu.registers.e = 0x10;
      Instructions[0x1d].execute(cpu);
      expect(cpu.registers.e).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x1d - DEC E carry', () => {
      cpu.registers.e = 0x00;
      Instructions[0x1d].execute(cpu);
      expect(cpu.registers.e).toBe(0xff);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x2d - DEC L', () => {
      cpu.registers.l = 0x01;
      Instructions[0x2d].execute(cpu);
      expect(cpu.registers.l).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should test 0x2d - DEC L half carry', () => {
      cpu.registers.l = 0x10;
      Instructions[0x2d].execute(cpu);
      expect(cpu.registers.l).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x2d - DEC L carry', () => {
      cpu.registers.l = 0x00;
      Instructions[0x2d].execute(cpu);
      expect(cpu.registers.l).toBe(0xff);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x3d - DEC A', () => {
      cpu.registers.a = 0x01;
      Instructions[0x3d].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should test 0x3d - DEC A half carry', () => {
      cpu.registers.a = 0x10;
      Instructions[0x3d].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x3d - DEC A carry', () => {
      cpu.registers.a = 0x00;
      Instructions[0x3d].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });
  });

  describe('Test RRA and RRCA instructions', () => {
    it('should test RRA', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 1 });
      Instructions[0x1f].execute(cpu);
      expect(cpu.registers.a).toBe(0x81);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test RRA no carry init', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 0 });
      Instructions[0x1f].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test RRA no carry after', () => {
      cpu.registers.a = 0x10;
      cpu.setFlags({ C: 0 });
      Instructions[0x1f].execute(cpu);
      expect(cpu.registers.a).toBe(0x08);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test RRCA', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 1 });
      Instructions[0x0f].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test RRCA no carry init', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 0 });
      Instructions[0x0f].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test RRCA no carry after', () => {
      cpu.registers.a = 0x10;
      cpu.setFlags({ C: 0 });
      Instructions[0x0f].execute(cpu);
      expect(cpu.registers.a).toBe(0x08);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests misc instructions', () => {
    it('should test 0xce - ADC A,n with carry', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0xce].execute(cpu);
      expect(cpu.registers.a).toBe(0x03);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xce - ADC A,n no carry', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 0 });
      Instructions[0xce].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xce - ADC A,n half carry', () => {
      cpu.registers.a = 0x0f;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 0 });
      Instructions[0xce].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xce - ADC A,n zero', () => {
      cpu.registers.a = 0x00;
      emu.memory[0x0100] = 0x00;
      cpu.setFlags({ C: 0 });
      Instructions[0xce].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xde - SBC A,n with carry', () => {
      cpu.registers.a = 0x02;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0xde].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xde - SBC A,n no carry', () => {
      cpu.registers.a = 0x02;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 0 });
      Instructions[0xde].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 0, C: 0 });
    });

    it('should test 0xde - SBC A,n half carry', () => {
      cpu.registers.a = 0x10;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 0 });
      Instructions[0xde].execute(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should test 0xde - SBC A,n carry borrow', () => {
      cpu.registers.a = 0x00;
      emu.memory[0x0100] = 0x01;
      cpu.setFlags({ C: 0 });
      Instructions[0xde].execute(cpu);
      expect(cpu.registers.a).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });

    it('should test 0xee - XOR A,n zero', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0100] = 0x01;
      Instructions[0xee].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0xee - XOR A,n no zero', () => {
      cpu.registers.a = 0x01;
      emu.memory[0x0100] = 0x02;
      Instructions[0xee].execute(cpu);
      expect(cpu.registers.a).toBe(0x03);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x15 - DEC D', () => {
      cpu.registers.d = 0x01;
      Instructions[0x15].execute(cpu);
      expect(cpu.registers.d).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should test 0x15 - DEC D no zero', () => {
      cpu.registers.d = 0x02;
      Instructions[0x15].execute(cpu);
      expect(cpu.registers.d).toBe(0x01);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 0 });
    });

    it('should test 0x15 - DEC D half carry', () => {
      cpu.registers.d = 0x10;
      Instructions[0x15].execute(cpu);
      expect(cpu.registers.d).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0x25 - DEC H', () => {
      cpu.registers.h = 0x01;
      Instructions[0x25].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should test 0x25 - DEC H no zero', () => {
      cpu.registers.h = 0x02;
      Instructions[0x25].execute(cpu);
      expect(cpu.registers.h).toBe(0x01);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 0 });
    });

    it('should test 0x25 - DEC H half carry', () => {
      cpu.registers.h = 0x10;
      Instructions[0x25].execute(cpu);
      expect(cpu.registers.h).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should text 0x35 - DEC (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x35].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x00);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should text 0x35 - DEC (HL) no zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x02;
      Instructions[0x35].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x01);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 0 });
    });

    it('should text 0x35 - DEC (HL) half carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x10;
      Instructions[0x35].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x0f);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });
  });

  describe('Test NC, NZ, C, Z RET', () => {
    it('should test 0xc0 - RET NZ', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ Z: 0 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xc0].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xc0 - RET NZ no ret', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ Z: 1 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xc0].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xd0 - RET NC', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ C: 0 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xd0].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xd0 - RET NC no ret', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ C: 1 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xd0].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xc8 - RET Z', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ Z: 1 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xc8].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xc8 - RET Z no ret', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ Z: 0 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xc8].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xd8 - RET C', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ C: 1 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xd8].execute(cpu);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xd8 - RET C no ret', () => {
      cpu.sp = 0xfffc;
      cpu.setFlags({ C: 0 });
      emu.memory[0xfffc] = 0x05;
      emu.memory[0xfffd] = 0x01;
      Instructions[0xd8].execute(cpu);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests ADD HL and others', () => {
    it('should test 0x09 - ADD HL,BC', () => {
      cpu.registers.h = 0x00;
      cpu.registers.l = 0x0f;
      cpu.registers.b = 0x00;
      cpu.registers.c = 0xf0;
      Instructions[0x09].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0xff);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 0, C: 0 });
    });

    it('should test 0x09 - ADD HL,BC half carry', () => {
      cpu.registers.h = 0x08;
      cpu.registers.l = 0x00;
      cpu.registers.b = 0x08;
      cpu.registers.c = 0x00;
      Instructions[0x09].execute(cpu);
      expect(cpu.registers.h).toBe(0x10);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 0 });
    });

    it('should test 0x09 - ADD HL,BC carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0xff;
      cpu.registers.b = 0x00;
      cpu.registers.c = 0x01;
      Instructions[0x09].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 1 });
    });

    it('should test 0x19 - ADD HL,DE', () => {
      cpu.registers.h = 0x00;
      cpu.registers.l = 0x0f;
      cpu.registers.d = 0x00;
      cpu.registers.e = 0xf0;
      Instructions[0x19].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0xff);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 0, C: 0 });
    });

    it('should test 0x19 - ADD HL,DE half carry', () => {
      cpu.registers.h = 0x08;
      cpu.registers.l = 0x00;
      cpu.registers.d = 0x08;
      cpu.registers.e = 0x00;
      Instructions[0x19].execute(cpu);
      expect(cpu.registers.h).toBe(0x10);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 0 });
    });

    it('should test 0x19 - ADD HL,DE carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0xff;
      cpu.registers.d = 0x00;
      cpu.registers.e = 0x01;
      Instructions[0x19].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 1 });
    });

    it('should test 0x29 - ADD HL,HL', () => {
      cpu.registers.h = 0x00;
      cpu.registers.l = 0x05;
      Instructions[0x29].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x0a);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 0, C: 0 });
    });

    it('should test 0x29 - ADD HL,HL half carry', () => {
      cpu.registers.h = 0x08;
      cpu.registers.l = 0x00;
      Instructions[0x29].execute(cpu);
      expect(cpu.registers.h).toBe(0x10);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 0 });
    });

    it('should test 0x29 - ADD HL,HL carry', () => {
      cpu.registers.h = 0x80;
      cpu.registers.l = 0x01;
      Instructions[0x29].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x02);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 0, C: 1 });
    });

    it('should test 0x39 - ADD HL,SP', () => {
      cpu.registers.h = 0x00;
      cpu.registers.l = 0x0f;
      cpu.sp = 0x00f0;
      Instructions[0x39].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0xff);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 0, C: 0 });
    });

    it('should test 0x39 - ADD HL,SP half carry', () => {
      cpu.registers.h = 0x08;
      cpu.registers.l = 0x00;
      cpu.sp = 0x0800;
      Instructions[0x39].execute(cpu);
      expect(cpu.registers.h).toBe(0x10);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 0 });
    });

    it('should test 0x39 - ADD HL,SP carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0xff;
      cpu.sp = 0x0001;
      Instructions[0x39].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x00);
      const { N, H, C } = cpu.getFlags();
      expect({ N, H, C }).toStrictEqual({ N: 0, H: 1, C: 1 });
    });
  });

  describe('Test 0xe9 - JP (HL)', () => {
    it('should test 0xe9 - JP (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0xe9].execute(cpu);
    });
  });

  describe('Tests DEC instructions 0x0b - 03b', () => {
    it('should test 0x0b - DEC BC', () => {
      cpu.registers.b = 0x01;
      cpu.registers.c = 0x00;
      Instructions[0x0b].execute(cpu);
      expect(cpu.registers.b).toBe(0x00);
      expect(cpu.registers.c).toBe(0xff);
    });

    it('should test 0x0b - DEC BC wrap', () => {
      cpu.registers.b = 0x00;
      cpu.registers.c = 0x00;
      Instructions[0x0b].execute(cpu);
      expect(cpu.registers.b).toBe(0xff);
      expect(cpu.registers.c).toBe(0xff);
    });

    it('should text 0x1b - DEC DE', () => {
      cpu.registers.d = 0x01;
      cpu.registers.e = 0x00;
      Instructions[0x1b].execute(cpu);
      expect(cpu.registers.d).toBe(0x00);
      expect(cpu.registers.e).toBe(0xff);
    });

    it('should text 0x1b - DEC DE wrap', () => {
      cpu.registers.d = 0x00;
      cpu.registers.e = 0x00;
      Instructions[0x1b].execute(cpu);
      expect(cpu.registers.d).toBe(0xff);
      expect(cpu.registers.e).toBe(0xff);
    });

    it('should test 0x2b - DEC HL', () => {
      cpu.registers.h = 0x01;
      cpu.registers.l = 0x00;
      Instructions[0x2b].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0xff);
    });

    it('should test 0x2b - DEC HL wrap', () => {
      cpu.registers.h = 0x00;
      cpu.registers.l = 0x00;
      Instructions[0x2b].execute(cpu);
      expect(cpu.registers.h).toBe(0xff);
      expect(cpu.registers.l).toBe(0xff);
    });

    it('should test 0x3b - DEC SP', () => {
      cpu.sp = 0x0100;
      Instructions[0x3b].execute(cpu);
      expect(cpu.sp).toBe(0x00ff);
    });

    it('should test 0x3b - DEC SP wrap', () => {
      cpu.sp = 0x0000;
      Instructions[0x3b].execute(cpu);
      expect(cpu.sp).toBe(0xffff);
    });
  });

  describe('Tests for 0xe8 - ADD SP,n8', () => {
    it('should test 0xe8 - ADD SP,n8 positive', () => {
      cpu.sp = 0x0000;
      emu.memory[0x0100] = 0x01;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0001);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xe8 - ADD SP,n8 negative', () => {
      cpu.sp = 0x0002;
      emu.memory[0x0100] = 0xff;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0001);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0xe8 - ADD sp, e8 correct negative carry', () => {
      cpu.sp = 0x0010;
      emu.memory[0x0100] = 0xff;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x000f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0xe8 - ADD SP,n8 half-carry positive', () => {
      cpu.sp = 0x000f;
      emu.memory[0x0100] = 0x01;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0010);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xe8 - ADD SP,n8 carry positive', () => {
      cpu.sp = 0x00ff;
      emu.memory[0x0100] = 0x01;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0100);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0xe8 - ADD SP, e8 with correct flags', () => {
      cpu.sp = 0x0001;
      emu.memory[0x0100] = 0xff;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0000);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0xe8 - ADD SP, e8 with correct flags 3', () => {
      cpu.sp = 0x0100;
      emu.memory[0x0100] = 0xff;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x00ff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xe8 - ADD SP, e8 with correct flags 4', () => {
      cpu.sp = 0x1000;
      emu.memory[0x0100] = 0xff;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0fff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xe8 - ADD SP,e8 carry negative 2', () => {
      cpu.sp = 0x0000;
      emu.memory[0x0100] = 0xff;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0xffff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should pass my test - ADD SP, e8', () => {
      cpu.sp = 0x000f;
      emu.memory[0x0100] = 0x01;
      Instructions[0xe8].execute(cpu);
      expect(cpu.sp).toBe(0x0010);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });
  });

  describe('Tests for 0xf8 - LD HL,SP+n8', () => {
    it('should test 0xf8 - LD HL,SP+n8 positive', () => {
      cpu.sp = 0x0000;
      emu.memory[0x0100] = 0x01;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xf8 - LD HL,SP+n8 negative', () => {
      cpu.sp = 0x0002;
      emu.memory[0x0100] = 0xff;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x01);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0xf8 - LD HL,SP+e8 correct negative carry', () => {
      cpu.sp = 0x0010;
      emu.memory[0x0100] = 0xff;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x0f);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0xf8 - LD HL,SP+n8 half-carry positive', () => {
      cpu.sp = 0x000f;
      emu.memory[0x0100] = 0x01;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0xf8 - LD HL,SP+n8 carry positive', () => {
      cpu.sp = 0x00ff;
      emu.memory[0x0100] = 0x01;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x01);
      expect(cpu.registers.l).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0xf8 - LD HL,SP+e8 with correct flags', () => {
      cpu.sp = 0x0001;
      emu.memory[0x0100] = 0xff;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x00);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0xf8 - LD HL,SP+e8 with correct flags 3', () => {
      cpu.sp = 0x0100;
      emu.memory[0x0100] = 0xff;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xf8 - LD HL,SP+e8 with correct flags 4', () => {
      cpu.sp = 0x1000;
      emu.memory[0x0100] = 0xff;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x0f);
      expect(cpu.registers.l).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0xf8 - LD HL,SP+e8 carry negative 2', () => {
      cpu.sp = 0x0000;
      emu.memory[0x0100] = 0xff;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0xff);
      expect(cpu.registers.l).toBe(0xff);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should pass my test - LD HL,SP+e8', () => {
      cpu.sp = 0x000f;
      emu.memory[0x0100] = 0x01;
      Instructions[0xf8].execute(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.registers.l).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });
  });

  describe('Tests for JP conditional instrucitons', () => {
    it('should test 0xc2 - JP NZ,a16', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ Z: 0 });
      Instructions[0xc2].execute(cpu);
    });

    it('should test 0xc2 - JP NZ,a16 with Z flag set', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ Z: 1 });
      Instructions[0xc2].execute(cpu);
    });

    it('should test 0xd2 - JP NC,a16', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ C: 0 });
      Instructions[0xd2].execute(cpu);
    });

    it('should test 0xd2 - JP NC,a16 with C flag set', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ C: 1 });
      Instructions[0xd2].execute(cpu);
    });

    it('should test 0xca - JP Z,a16', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ Z: 1 });
      Instructions[0xca].execute(cpu);
    });

    it('should test 0xca - JP Z,a16 with Z flag set', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ Z: 0 });
      Instructions[0xca].execute(cpu);
    });

    it('should test 0xda - JP C,a16', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ C: 1 });
      Instructions[0xda].execute(cpu);
    });

    it('should test 0xda - JP C,a16 with C flag set', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0x05;
      cpu.setFlags({ C: 0 });
      Instructions[0xda].execute(cpu);
    });
  });

  describe('Test interrupt instructions', () => {
    it('should test 0xfb - EI', () => {
      cpu.IME = false;
      Instructions[0xfb].execute(cpu);
      expect(cpu.IME).toBe(true);
    });

    it('should test 0xf3 - DI', () => {
      cpu.IME = true;
      Instructions[0xf3].execute(cpu);
      expect(cpu.IME).toBe(false);
    });

    it('should test V-Blank interrupt', async () => {
      cpu.IME = true;
      cpu.pc = 0x105;
      emu.memory[0xffff] = 1;
      emu.memory[0xff0f] = 1;
      emu.memory[0x0105] = 0x00;
      emu.memory[0x40] = 0xd9;
      emu.update();
      expect(emu.memory[0xfffc]).toBe(0x06);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xff0f]).toBe(0);
      expect(cpu.IME).toBe(false);
      emu.update();
      expect(cpu.IME).toBe(true);
    });

    it('should test LCD interrupt', async () => {
      cpu.IME = true;
      cpu.pc = 0x105;
      emu.memory[0xffff] = 2;
      emu.memory[0xff0f] = 2;
      emu.memory[0x0105] = 0x00;
      emu.memory[0x48] = 0xd9;
      emu.update();
      expect(emu.memory[0xfffc]).toBe(0x06);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xff0f]).toBe(0);
      expect(cpu.IME).toBe(false);
      emu.update();
      expect(cpu.IME).toBe(true);
    });

    it('should test Timer interrupt', async () => {
      cpu.IME = true;
      cpu.pc = 0x105;
      emu.memory[0xffff] = 4;
      emu.memory[0xff0f] = 4;
      emu.memory[0x0105] = 0x00;
      emu.memory[0x50] = 0xd9;
      emu.update();
      expect(emu.memory[0xfffc]).toBe(0x06);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xff0f]).toBe(0);
      expect(cpu.IME).toBe(false);
      emu.update();
      expect(cpu.IME).toBe(true);
    });

    it('should test Serial interrupt', async () => {
      cpu.IME = true;
      cpu.pc = 0x105;
      emu.memory[0xffff] = 8;
      emu.memory[0xff0f] = 8;
      emu.memory[0x0105] = 0x00;
      emu.memory[0x58] = 0xd9;
      emu.update();
      expect(emu.memory[0xfffc]).toBe(0x06);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xff0f]).toBe(0);
      expect(cpu.IME).toBe(false);
      emu.update();
      expect(cpu.IME).toBe(true);
    });

    it('should test Joypad interrupt', async () => {
      cpu.IME = true;
      cpu.pc = 0x105;
      emu.memory[0xffff] = 16;
      emu.memory[0xff0f] = 16;
      emu.memory[0x0105] = 0x00;
      emu.memory[0x60] = 0xd9;
      emu.update();
      expect(emu.memory[0xfffc]).toBe(0x06);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xff0f]).toBe(0);
      expect(cpu.IME).toBe(false);
      emu.update();
      expect(cpu.IME).toBe(true);
    });
  });

  describe('Tests for DAA', () => {
    it('should test DAA', () => {
      cpu.setFlags({ N: 0, H: 0, C: 0, Z: 0 });
      cpu.registers.a = 0x0a;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test DAA 2', () => {
      cpu.setFlags({ H: 0, C: 0, Z: 0 });
      cpu.registers.a = 0x9a;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, H, C } = cpu.getFlags();
      expect({ Z, H, C }).toStrictEqual({ Z: 1, H: 0, C: 1 });
    });

    it('should test DAA 3', () => {
      cpu.setFlags({ H: 1, C: 0, Z: 0 });
      cpu.registers.a = 0x94;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0x9a);
      const { Z, H, C } = cpu.getFlags();
      expect({ Z, H, C }).toStrictEqual({ Z: 0, H: 0, C: 0 });
    });

    it('should test DAA 4', () => {
      cpu.setFlags({ H: 1, C: 0, Z: 0 });
      cpu.registers.a = 0x9a;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, H, C } = cpu.getFlags();
      expect({ Z, H, C }).toStrictEqual({ Z: 1, H: 0, C: 1 });
    });

    it('should test DAA 5', () => {
      cpu.setFlags({ H: 1, C: 0, Z: 0, N: 1 });
      cpu.registers.a = 0x06;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0x00);
      const { Z, H, C, N } = cpu.getFlags();
      expect({ Z, H, C, N }).toStrictEqual({ Z: 1, H: 0, C: 0, N: 1 });
    });

    it('should test DAA 6', () => {
      cpu.setFlags({ H: 0, C: 1, Z: 0, N: 1 });
      cpu.registers.a = 0x00;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0xa0);
      const { Z, H, C, N } = cpu.getFlags();
      expect({ Z, H, C, N }).toStrictEqual({ Z: 0, H: 0, C: 1, N: 1 });
    });

    it('should test DAA 7', () => {
      cpu.setFlags({ H: 1, C: 1, Z: 0, N: 1 });
      cpu.registers.a = 0x00;
      Instructions[0x27].execute(cpu);
      expect(cpu.registers.a).toBe(0x9a);
      const { Z, H, C, N } = cpu.getFlags();
      expect({ Z, H, C, N }).toStrictEqual({ Z: 0, H: 0, C: 1, N: 1 });
    });
  });

  describe('Tests for HALT', () => {
    it('should test HALT 1 - interrupted immediately', () => {
      Instructions[0xfb].execute(cpu);
      emu.memory[0x100] = 0x76;
      emu.memory[0xffff] = 0x01;
      emu.memory[0xff0f] = 0x01;
      emu.update();
      expect(cpu.isHalted).toBe(false);
    });

    it('should test HALT 2 - not interrupted', () => {
      emu.memory[0x100] = 0x76;
      emu.update();
      expect(cpu.isHalted).toBe(true);
    });

    it('should test HALT 3 - turned into haltBug and resolved', () => {
      emu.memory[0x100] = 0x76;
      emu.memory[0x101] = 0x00;
      emu.memory[0xffff] = 0x01;
      emu.memory[0xff0f] = 0x01;
      emu.update();
      expect(cpu.isHalted).toBe(false);
      expect(cpu.isHaltBug).toBe(true);
      emu.update();
      expect(cpu.isHaltBug).toBe(false);
    });

    it('should test HALT 4 - twice executed during haltBug', () => {
      emu.memory[0x100] = 0x76;
      emu.memory[0x101] = 0x04;
      emu.memory[0x102] = 0x00;
      emu.memory[0xffff] = 0x01;
      emu.memory[0xff0f] = 0x01;
      cpu.registers.b = 0x00;
      emu.update();
      expect(cpu.registers.b).toBe(0x00);
      expect(cpu.isHaltBug).toBe(true);
      expect(cpu.isHalted).toBe(false);
      emu.update();
      expect(cpu.registers.b).toBe(0x01);
      expect(cpu.pc).toBe(0x101);
      expect(cpu.isHaltBug).toBe(false);
      expect(cpu.isHalted).toBe(false);
      emu.update();
      expect(cpu.registers.b).toBe(0x02);
      expect(cpu.pc).toBe(0x102);
      expect(cpu.isHaltBug).toBe(false);
      expect(cpu.isHalted).toBe(false);
    });
  });
});
