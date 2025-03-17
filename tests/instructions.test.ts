import { CPU } from '../src/CPU';
import { Emulator } from '../src/emulator';
import { Instructions } from '../src/instructions';
import { CombinedRegister } from '../src/types';

let emu: Emulator;
let cpu: CPU;

beforeEach(() => {
  emu = new Emulator(Buffer.alloc(0x200000));
  cpu = emu.cpu;
});

describe('Tests for CPU instructions', () => {
  describe('Tests for 0x00 - NOP', () => {
    it('should increment pc by 1', () => {
      checkCounterIncrement(0x00, 1);
    });
  });

  describe('Tests for 0xc3 - JP a16', () => {
    it('should jump to a correct address', () => {
      cpu.memRead = jest.fn((address: number) => {
        if (address === 0x0101) return 0xab;
        return 0xcd;
      });
      Instructions[0xc3].fn(cpu);
      expect(cpu.pc).toBe(0xcdab);
    });
  });

  describe('Tests for 0xaf - XOR A, A', () => {
    it('should increment pc by 1', () => {
      checkCounterIncrement(0xaf, 1);
    });

    it('should set register A to 0', () => {
      Instructions[0xaf].fn(cpu);
      expect(cpu.registers.a).toBe(0);
    });

    it('should set flags to 1 0 0 0', () => {
      Instructions[0xaf].fn(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests for 0x21 - LD HL, n16', () => {
    it('should increment pc by 3', () => {
      checkCounterIncrement(0x21, 3);
    });

    it('should load data into HL correctly', () => {
      cpu.memRead = jest.fn((address: number) => {
        if (address === 0x0101) return 0xab;
        return 0xcd;
      });
      Instructions[0x21].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0xcdab);
      expect(cpu.registers.h).toBe(0xcd);
      expect(cpu.registers.l).toBe(0xab);
    });
  });

  describe('Tests for 0x0e - LD C, n8', () => {
    it('should increment pc by 2', () => {
      checkCounterIncrement(0x0e, 2);
    });

    it('should write value to the C register correctly', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x0e].fn(cpu);
      expect(cpu.registers.c).toBe(0xab);
    });
  });

  describe('Tests for 0x06 - LD B, n8', () => {
    it('should increment pc by 2', () => {
      checkCounterIncrement(0x06, 2);
    });

    it('should write value to the B register correctly', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x06].fn(cpu);
      expect(cpu.registers.b).toBe(0xab);
    });
  });

  describe('Tests for 0x3e - LD A, n8', () => {
    it('should increment pc by 2', () => {
      checkCounterIncrement(0x3e, 2);
    });

    it('should write value to the A register correctly', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x3e].fn(cpu);
      expect(cpu.registers.a).toBe(0xab);
    });
  });

  describe('Tests for 0x32 - LD [HL-], A', () => {
    beforeEach(() => {
      cpu.registers.a = 0xcc;
      cpu.registers.h = 0xdf;
      cpu.registers.l = 0xff;
    });

    it('should increment pc by 1', () => {
      checkCounterIncrement(0x32, 1);
    });

    it('should write value from register A to the address of HL', () => {
      Instructions[0x32].fn(cpu);
      expect(emu.memory[0xdfff]).toBe(0xcc);
    });

    it('should decrement HL by 1', () => {
      Instructions[0x32].fn(cpu);
      expect(cpu.registers.h).toBe(0xdf);
      expect(cpu.registers.l).toBe(0xfe);
    });
  });

  describe('Tests for 0x05 - DEC B', () => {
    it('should increment pc by 1', () => {
      checkCounterIncrement(0x05, 1);
    });

    it('should decrement register B correctly', () => {
      cpu.registers.b = 0x01;
      Instructions[0x05].fn(cpu);
      expect(cpu.registers.b).toBe(0x00);
    });

    it('should set flags to 1 1 0 0', () => {
      cpu.registers.b = 0x01;
      Instructions[0x05].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should set half carry flag to 1', () => {
      cpu.registers.b = 0x10;
      Instructions[0x05].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should check register b overflow from 0 to 0xff', () => {
      cpu.registers.b = 0x00;
      Instructions[0x05].fn(cpu);
      expect(cpu.registers.b).toBe(0xff);
    });
  });

  describe('Tests for 0x0d - DEC C', () => {
    it('should increment pc by 1', () => {
      checkCounterIncrement(0x0d, 1);
    });

    it('should decrement register C correctly', () => {
      cpu.registers.c = 0x01;
      Instructions[0x0d].fn(cpu);
      expect(cpu.registers.c).toBe(0x00);
    });

    it('should set flags to 1 1 0', () => {
      cpu.registers.c = 0x01;
      Instructions[0x0d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 1, H: 0 });
    });

    it('should set half carry flag to 1', () => {
      cpu.registers.c = 0x10;
      Instructions[0x0d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should check register c overflow from 0 to 0xff', () => {
      cpu.registers.c = 0x00;
      Instructions[0x0d].fn(cpu);
      expect(cpu.registers.c).toBe(0xff);
    });
  });

  describe('Tests for 0x20 - JR NZ, e8', () => {
    it('should jump forward', () => {
      cpu.registers.f = 0x00;
      cpu.memRead = jest.fn(() => 0x05);
      Instructions[0x20].fn(cpu);
      expect(cpu.pc).toBe(0x0107);
    });

    it('should get negative 8bit and jump backward', () => {
      cpu.registers.f = 0x00;
      cpu.memRead = jest.fn(() => 0xfb);
      Instructions[0x20].fn(cpu);
      expect(cpu.pc).toBe(0x00fd);
    });

    it('should not jump if Z flag is set', () => {
      cpu.registers.f = 0x80;
      cpu.memRead = jest.fn(() => 0x05);
      Instructions[0x20].fn(cpu);
      expect(cpu.pc).toBe(0x0102);
    });
  });

  describe('Tests for 0xf3 - DI', () => {
    it('should increment pc by 1', () => {
      checkCounterIncrement(0xf3, 1);
    });
  });

  describe('Tests for 0xe0 - LDH [a8], A', () => {
    beforeEach(() => {
      cpu.registers.a = 0x12;
    });

    it('should increment pc by 2', () => {
      checkCounterIncrement(0xe0, 2);
    });

    it('should write value from register A to the correct address', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0xe0].fn(cpu);
      expect(emu.memory[0xffab]).toBe(0x12);
    });

    it('should write to the edge of the memory', () => {
      cpu.memRead = jest.fn(() => 0xff);
      Instructions[0xe0].fn(cpu);
      expect(emu.memory[0xffff]).toBe(0x12);
    });

    it('should write to the beginning of the memory', () => {
      cpu.memRead = jest.fn(() => 0x00);
      Instructions[0xe0].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
    });
  });

  describe('Tests for 0xf0 - LDH A, [a8]', () => {
    it('should increment pc by 2', () => {
      checkCounterIncrement(0xf0, 2);
    });

    it('should write value from the correct address to register A', () => {
      emu.memory[0xffab] = 0x12;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0xab;
        return emu.memory[address];
      });
      Instructions[0xf0].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should read from the edge of the memory', () => {
      emu.memory[0xffff] = 0x12;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0xff;
        return emu.memory[address];
      });
      Instructions[0xf0].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });

    it('should read from the beginning of the memory', () => {
      emu.memory[0xff00] = 0x12;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0x00;
        return emu.memory[address];
      });
      Instructions[0xf0].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
    });
  });

  describe('Tests for 0xfe - CP n8', () => {
    it('should increment pc by 2', () => {
      checkCounterIncrement(0xfe, 2);
    });

    it('should subtract correctly', () => {
      cpu.registers.a = 0x01;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
    });

    it('should set flags correctly', () => {
      cpu.registers.a = 0x01;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].fn(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should set flags correctly', () => {
      cpu.registers.a = 0x10;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].fn(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 0, N: 1, H: 1, C: 0 });
    });

    it('should set flags correctly', () => {
      cpu.registers.a = 0x00;
      cpu.memRead = jest.fn(() => 0x01);
      Instructions[0xfe].fn(cpu);
      expect(cpu.getFlags()).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });
  });

  describe('Tests for LD instructions 0x40 - 0x4f', () => {
    it('should test LD B, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x40].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x41].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x42].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x43].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x44].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x45].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x46].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD B, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x47].fn(cpu);
      expect(cpu.registers.b).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x48].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x49].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x4a].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x4b].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x4c].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x4d].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x4e].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD C, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x4f].fn(cpu);
      expect(cpu.registers.c).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });
  });

  describe('Tests for LD instructions 0x50 - 0x5f', () => {
    it('should test LD D, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x50].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x51].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x52].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x53].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x54].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x55].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x56].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD D, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x57].fn(cpu);
      expect(cpu.registers.d).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x58].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x59].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x5a].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x5b].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x5c].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x5d].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x5e].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD E, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x5f].fn(cpu);
      expect(cpu.registers.e).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });
  });

  describe('Tests for LD instructions 0x60 - 0x6f', () => {
    it('should test LD H, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x60].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x61].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x62].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x63].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x64].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x65].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x66].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD H, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x67].fn(cpu);
      expect(cpu.registers.h).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x68].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x69].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x6a].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x6b].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x6c].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x6d].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x6e].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD L, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x6f].fn(cpu);
      expect(cpu.registers.l).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });
  });

  describe('Tests for LD instructions 0x70 - 0x7f', () => {
    it('should test LD (HL), B', () => {
      cpu.registers.b = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x70].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD (HL), C', () => {
      cpu.registers.c = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x71].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD (HL), D', () => {
      cpu.registers.d = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x72].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD (HL), E', () => {
      cpu.registers.e = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x73].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD (HL), H', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x74].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xff);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD (HL), L', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x01;
      Instructions[0x75].fn(cpu);
      expect(emu.memory[0xff01]).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
    });

    // it('should test HALT', () => {
    //   Instructions[0x76].fn(cpu);
    //   expect(cpu.halted).toBe(true);
    // });

    it('should test LD (HL), A', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      Instructions[0x77].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x78].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x79].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x7a].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x7b].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x7c].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x7d].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, (HL)', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      emu.memory[0xabcd] = 0x12;
      Instructions[0x7e].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test LD A, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x7f].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });
  });

  describe('Tests for other LD instructions', () => {
    it('should test 0x01 - LD BC, n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0xab;
        return 0xcd;
      });
      Instructions[0x01].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0103);
    });

    it('should test 0x11 - LD DE, n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0xab;
        return 0xcd;
      });
      Instructions[0x11].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0103);
    });

    it('should test 0x31 - LD SP, n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0xab;
        return 0xcd;
      });
      Instructions[0x31].fn(cpu);
      expect(cpu.sp).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0103);
    });

    it('should test 0x02 - LD (BC), A', () => {
      cpu.registers.b = 0xff;
      cpu.registers.c = 0x00;
      cpu.registers.a = 0x12;
      Instructions[0x02].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x12 - LD (DE), A', () => {
      cpu.registers.d = 0xff;
      cpu.registers.e = 0x00;
      cpu.registers.a = 0x12;
      Instructions[0x12].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x22 - LD (HL+), A', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      cpu.registers.a = 0x12;
      Instructions[0x22].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.registers.h).toBe(0xff);
      expect(cpu.registers.l).toBe(0x01);
    });

    it('should test 0x16 - LD D, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x16].fn(cpu);
      expect(cpu.registers.d).toBe(0xab);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test 0x26 - LD H, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x26].fn(cpu);
      expect(cpu.registers.h).toBe(0xab);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test 0x36 - LD (HL), n8', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x36].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xab);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test 0x0a - LD A, (BC)', () => {
      cpu.registers.b = 0xff;
      cpu.registers.c = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x0a].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x1a - LD A, (DE)', () => {
      cpu.registers.d = 0xff;
      cpu.registers.e = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x1a].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x2a - LD A, (HL+)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x2a].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.registers.h).toBe(0xff);
      expect(cpu.registers.l).toBe(0x01);
    });

    it('should test 0x3a - LD A, (HL-)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x3a].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.registers.h).toBe(0xfe);
      expect(cpu.registers.l).toBe(0xff);
    });

    it('should test 0x1e - LD E, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x1e].fn(cpu);
      expect(cpu.registers.e).toBe(0xab);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test 0x2e - LD L, n8', () => {
      cpu.memRead = jest.fn(() => 0xab);
      Instructions[0x2e].fn(cpu);
      expect(cpu.registers.l).toBe(0xab);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test 0x08 - LD (n16), SP', () => {
      cpu.sp = 0xa0b0;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0x00;
        return 0xff;
      });
      Instructions[0x08].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xb0);
      expect(emu.memory[0xff01]).toBe(0xa0);
      expect(cpu.pc).toBe(0x0103);
    });

    it('should test 0xe2 - LD (C), A', () => {
      cpu.registers.c = 0x12;
      cpu.registers.a = 0xab;
      Instructions[0xe2].fn(cpu);
      expect(emu.memory[0xff12]).toBe(0xab);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0xf2 - LD A, (C)', () => {
      cpu.registers.c = 0x12;
      emu.memory[0xff12] = 0xab;
      Instructions[0xf2].fn(cpu);
      expect(cpu.registers.a).toBe(0xab);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0xea - LD (n16), A', () => {
      cpu.registers.a = 0xab;
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0x00;
        return 0xff;
      });
      Instructions[0xea].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xab);
      expect(cpu.pc).toBe(0x0103);
    });

    it('should test 0xfa - LD A, (n16)', () => {
      emu.memory[0x0101] = 0x00;
      emu.memory[0x0102] = 0xff;
      emu.memory[0xff00] = 0xab;
      Instructions[0xfa].fn(cpu);
      expect(cpu.registers.a).toBe(0xab);
      expect(cpu.pc).toBe(0x0103);
    });

    it('should test 0xf9 - LD SP, HL', () => {
      cpu.registers.h = 0xab;
      cpu.registers.l = 0xcd;
      Instructions[0xf9].fn(cpu);
      expect(cpu.sp).toBe(0xabcd);
      expect(cpu.pc).toBe(0x0101);
    });
  });

  describe('Tests for INC instructions', () => {
    it('should test 0x04 - INC B', () => {
      cpu.registers.b = 0x12;
      Instructions[0x04].fn(cpu);
      expect(cpu.registers.b).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x04 - INC B half-carry', () => {
      cpu.registers.b = 0x0f;
      Instructions[0x04].fn(cpu);
      expect(cpu.registers.b).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x04 - INC B zero', () => {
      cpu.registers.b = 0xff;
      Instructions[0x04].fn(cpu);
      expect(cpu.registers.b).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x14 - INC D', () => {
      cpu.registers.d = 0x12;
      Instructions[0x14].fn(cpu);
      expect(cpu.registers.d).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x14 - INC D half-carry', () => {
      cpu.registers.d = 0x0f;
      Instructions[0x14].fn(cpu);
      expect(cpu.registers.d).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x14 - INC D zero', () => {
      cpu.registers.d = 0xff;
      Instructions[0x14].fn(cpu);
      expect(cpu.registers.d).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x24 - INC H', () => {
      cpu.registers.h = 0x12;
      Instructions[0x24].fn(cpu);
      expect(cpu.registers.h).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x24 - INC H half-carry', () => {
      cpu.registers.h = 0x0f;
      Instructions[0x24].fn(cpu);
      expect(cpu.registers.h).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x24 - INC H zero', () => {
      cpu.registers.h = 0xff;
      Instructions[0x24].fn(cpu);
      expect(cpu.registers.h).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x34 - INC (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x12;
      Instructions[0x34].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x34 - INC (HL) half-carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x0f;
      Instructions[0x34].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x34 - INC (HL) zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      Instructions[0x34].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x0c - INC C', () => {
      cpu.registers.c = 0x12;
      Instructions[0x0c].fn(cpu);
      expect(cpu.registers.c).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x0c - INC C half-carry', () => {
      cpu.registers.c = 0x0f;
      Instructions[0x0c].fn(cpu);
      expect(cpu.registers.c).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x0c - INC C zero', () => {
      cpu.registers.c = 0xff;
      Instructions[0x0c].fn(cpu);
      expect(cpu.registers.c).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x1c - INC E', () => {
      cpu.registers.e = 0x12;
      Instructions[0x1c].fn(cpu);
      expect(cpu.registers.e).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x1c - INC E half-carry', () => {
      cpu.registers.e = 0x0f;
      Instructions[0x1c].fn(cpu);
      expect(cpu.registers.e).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x1c - INC E zero', () => {
      cpu.registers.e = 0xff;
      Instructions[0x1c].fn(cpu);
      expect(cpu.registers.e).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x2c - INC L', () => {
      cpu.registers.l = 0x12;
      Instructions[0x2c].fn(cpu);
      expect(cpu.registers.l).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x2c - INC L half-carry', () => {
      cpu.registers.l = 0x0f;
      Instructions[0x2c].fn(cpu);
      expect(cpu.registers.l).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x2c - INC L zero', () => {
      cpu.registers.l = 0xff;
      Instructions[0x2c].fn(cpu);
      expect(cpu.registers.l).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x3c - INC A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x3c].fn(cpu);
      expect(cpu.registers.a).toBe(0x13);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 0 });
    });

    it('should test 0x3c - INC A half-carry', () => {
      cpu.registers.a = 0x0f;
      Instructions[0x3c].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x3c - INC A zero', () => {
      cpu.registers.a = 0xff;
      Instructions[0x3c].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 1, N: 0, H: 1 });
    });
  });

  describe('Tests for 0xcd - CALL n16', () => {
    it('should test CALL n16', () => {
      cpu.memRead = jest.fn((address) => {
        if (address === 0x0101) return 0x00;
        return 0xff;
      });
      Instructions[0xcd].fn(cpu);
      expect(emu.memory[0xfffd]).toBe(0x01);
      expect(emu.memory[0xfffc]).toBe(0x03);
      expect(cpu.pc).toBe(0xff00);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests for JR instructions e8, Z, C ', () => {
    it('should test JR e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      Instructions[0x18].fn(cpu);
      expect(cpu.pc).toBe(0x0105);
    });

    it('should test JR e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      Instructions[0x18].fn(cpu);
      expect(cpu.pc).toBe(0x00fd);
    });

    it('should test JR Z, e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ Z: 1 });
      Instructions[0x28].fn(cpu);
      expect(cpu.pc).toBe(0x0105);
    });

    it('should test JR Z, e8 no jump', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ Z: 0 });
      Instructions[0x28].fn(cpu);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test JR Z, e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      cpu.setFlags({ Z: 1 });
      Instructions[0x28].fn(cpu);
      expect(cpu.pc).toBe(0x00fd);
    });

    it('should test JR C, e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 1 });
      Instructions[0x38].fn(cpu);
      expect(cpu.pc).toBe(0x0105);
    });

    it('should test JR C, e8 no jump', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 0 });
      Instructions[0x38].fn(cpu);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test JR C, e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      cpu.setFlags({ C: 1 });
      Instructions[0x38].fn(cpu);
      expect(cpu.pc).toBe(0x00fd);
    });

    it('shoult test 0x30 - JR NC, e8 jump forward', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 0 });
      Instructions[0x30].fn(cpu);
      expect(cpu.pc).toBe(0x0105);
    });

    it('shoult test 0x30 - JR NC, e8 no jump', () => {
      cpu.memRead = jest.fn(() => 0x03);
      cpu.setFlags({ C: 1 });
      Instructions[0x30].fn(cpu);
      expect(cpu.pc).toBe(0x0102);
    });

    it('shoult test 0x30 - JR NC, e8 jump backward', () => {
      cpu.memRead = jest.fn(() => 0xfb);
      cpu.setFlags({ C: 0 });
      Instructions[0x30].fn(cpu);
      expect(cpu.pc).toBe(0x00fd);
    });
  });

  describe('Tests for A instructions', () => {
    it('should test ADD A, n8', () => {
      cpu.memRead = jest.fn(() => 0x12);
      cpu.registers.a = 0x12;
      Instructions[0xc6].fn(cpu);
      expect(cpu.registers.a).toBe(0x24);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test ADD A, n8 half-carry', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x0f;
      Instructions[0xc6].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0102);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test ADD A, n8 zero', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0xff;
      Instructions[0xc6].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0102);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0xd6 - SUB A n8', () => {
      cpu.memRead = jest.fn(() => 0x12);
      cpu.registers.a = 0x24;
      Instructions[0xd6].fn(cpu);
      expect(cpu.registers.a).toBe(0x12);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should test 0xd6 - SUB A n8 half-carry', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x10;
      Instructions[0xd6].fn(cpu);
      expect(cpu.registers.a).toBe(0x0f);
      expect(cpu.pc).toBe(0x0102);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 1, H: 1 });
    });

    it('should test 0xd6 - SUB A n8 zero', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x01;
      Instructions[0xd6].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0102);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 0, C: 0 });
    });

    it('should test 0xd6 - SUB A n8 carry', () => {
      cpu.memRead = jest.fn(() => 0x01);
      cpu.registers.a = 0x00;
      Instructions[0xd6].fn(cpu);
      expect(cpu.registers.a).toBe(0xff);
      expect(cpu.pc).toBe(0x0102);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 1, H: 1, C: 1 });
    });
  });

  describe('Tests for push and pop instructions', () => {
    it('should test 0xc1 - POP BC', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xc1].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xd1 - POP DE', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xd1].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xe1 - POP HL', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xe1].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xf1 - POP AF', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xab;
      emu.memory[0xfffd] = 0xcd;
      Instructions[0xf1].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.AF)).toBe(0xcdab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffe);
    });

    it('should test 0xf1 flags', () => {
      cpu.sp = 0xfffc;
      emu.memory[0xfffc] = 0xf0;
      emu.memory[0xfffd] = 0x00;
      Instructions[0xf1].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 1, H: 1, C: 1 });
    });

    it('should test 0xc5 - PUSH BC', () => {
      cpu.setCombinedRegister(CombinedRegister.BC, 0xcdab);
      Instructions[0xc5].fn(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xd5 - PUSH DE', () => {
      cpu.setCombinedRegister(CombinedRegister.DE, 0xcdab);
      Instructions[0xd5].fn(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xe5 - PUSH HL', () => {
      cpu.setCombinedRegister(CombinedRegister.HL, 0xcdab);
      Instructions[0xe5].fn(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffc);
    });

    it('should test 0xf5 - PUSH AF', () => {
      cpu.setCombinedRegister(CombinedRegister.AF, 0xcdab);
      Instructions[0xf5].fn(cpu);
      expect(emu.memory[0xfffd]).toBe(0xcd);
      expect(emu.memory[0xfffc]).toBe(0xab);
      expect(cpu.pc).toBe(0x0101);
      expect(cpu.sp).toBe(0xfffc);
    });
  });

  describe('Tests for INC instructions', () => {
    it('should test 0x03 - INC BC', () => {
      cpu.setCombinedRegister(CombinedRegister.BC, 0xabcd);
      Instructions[0x03].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0xabce);
      expect(cpu.pc).toBe(0x0101);
    });

    it('shoult text 0x03 - INC BC overflow', () => {
      cpu.setCombinedRegister(CombinedRegister.BC, 0xffff);
      Instructions[0x03].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.BC)).toBe(0x0000);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x13 - INC DE', () => {
      cpu.setCombinedRegister(CombinedRegister.DE, 0xabcd);
      Instructions[0x13].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0xabce);
      expect(cpu.pc).toBe(0x0101);
    });

    it('shoud test 0x13 - INC DE overflow', () => {
      cpu.setCombinedRegister(CombinedRegister.DE, 0xffff);
      Instructions[0x13].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.DE)).toBe(0x0000);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x23 - INC HL', () => {
      cpu.setCombinedRegister(CombinedRegister.HL, 0xabcd);
      Instructions[0x23].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0xabce);
      expect(cpu.pc).toBe(0x0101);
    });

    it('shoud test 0x23 - INC HL overflow', () => {
      cpu.setCombinedRegister(CombinedRegister.HL, 0xffff);
      Instructions[0x23].fn(cpu);
      expect(cpu.getCombinedRegister(CombinedRegister.HL)).toBe(0x0000);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x33 - INC SP', () => {
      cpu.sp = 0xabcd;
      Instructions[0x33].fn(cpu);
      expect(cpu.sp).toBe(0xabce);
      expect(cpu.pc).toBe(0x0101);
    });

    it('shoud test 0x33 - INC SP overflow', () => {
      cpu.sp = 0xffff;
      Instructions[0x33].fn(cpu);
      expect(cpu.sp).toBe(0x0000);
      expect(cpu.pc).toBe(0x0101);
    });
  });

  describe('tests for 0x80 - 0x8f', () => {
    it('should test 0x80 - ADD A, B', () => {
      cpu.registers.a = 0x12;
      cpu.registers.b = 0x34;
      Instructions[0x80].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x80 - ADD A, B half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.b = 0x01;
      Instructions[0x80].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x80 - ADD A, B carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.b = 0x01;
      Instructions[0x80].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x80 - ADD A, B zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.b = 0x01;
      Instructions[0x80].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x81 - ADD A, C', () => {
      cpu.registers.a = 0x12;
      cpu.registers.c = 0x34;
      Instructions[0x81].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x81 - ADD A, C half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.c = 0x01;
      Instructions[0x81].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x81 - ADD A, C carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.c = 0x01;
      Instructions[0x81].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x81 - ADD A, C zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.c = 0x01;
      Instructions[0x81].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x82 - ADD A, D', () => {
      cpu.registers.a = 0x12;
      cpu.registers.d = 0x34;
      Instructions[0x82].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x82 - ADD A, D half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.d = 0x01;
      Instructions[0x82].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x82 - ADD A, D carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.d = 0x01;
      Instructions[0x82].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x82 - ADD A, D zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.d = 0x01;
      Instructions[0x82].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x83 - ADD A, E', () => {
      cpu.registers.a = 0x12;
      cpu.registers.e = 0x34;
      Instructions[0x83].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x83 - ADD A, E half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.e = 0x01;
      Instructions[0x83].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x83 - ADD A, E carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.e = 0x01;
      Instructions[0x83].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x83 - ADD A, E zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.e = 0x01;
      Instructions[0x83].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x84 - ADD A, H', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0x34;
      Instructions[0x84].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x84 - ADD A, H half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0x01;
      Instructions[0x84].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x84 - ADD A, H carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x01;
      Instructions[0x84].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x84 - ADD A, H zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x01;
      Instructions[0x84].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x85 - ADD A, L', () => {
      cpu.registers.a = 0x12;
      cpu.registers.l = 0x34;
      Instructions[0x85].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x85 - ADD A, L half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.l = 0x01;
      Instructions[0x85].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should text 0x85 - ADD A, L carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.l = 0x01;
      Instructions[0x85].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x85 - ADD A, L zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.l = 0x01;
      Instructions[0x85].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x86 - ADD A, (HL)', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x34;
      Instructions[0x86].fn(cpu);
      expect(cpu.registers.a).toBe(0x46);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x86 - ADD A, (HL) half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x86].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x86 - ADD A, (HL) carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x86].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x86 - ADD A, (HL) zero', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      Instructions[0x86].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x87 - ADD A, A', () => {
      cpu.registers.a = 0x12;
      Instructions[0x87].fn(cpu);
      expect(cpu.registers.a).toBe(0x24);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x87 - ADD A, A half-carry', () => {
      cpu.registers.a = 0x0f;
      Instructions[0x87].fn(cpu);
      expect(cpu.registers.a).toBe(0x1e);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toStrictEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x87 - ADD A, A carry', () => {
      cpu.registers.a = 0xff;
      Instructions[0x87].fn(cpu);
      expect(cpu.registers.a).toBe(0xfe);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x87 - ADD A, A zero', () => {
      cpu.registers.a = 0xff;
      Instructions[0x87].fn(cpu);
      expect(cpu.registers.a).toBe(0xfe);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x88 - ADC A, B', () => {
      cpu.registers.a = 0x12;
      cpu.registers.b = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].fn(cpu);
      expect(cpu.registers.a).toBe(0x47);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x88 - ADC A, B half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x88 - ADC A, B carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x88 - ADC A, B zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x88].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x89 - ADC A, C', () => {
      cpu.registers.a = 0x12;
      cpu.registers.c = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].fn(cpu);
      expect(cpu.registers.a).toBe(0x47);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x89 - ADC A, C half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x89 - ADC A, C carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x89 - ADC A, C zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x89].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8a - ADC A, D', () => {
      cpu.registers.a = 0x12;
      cpu.registers.d = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].fn(cpu);
      expect(cpu.registers.a).toBe(0x47);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x8a - ADC A, D half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8a - ADC A, D carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8a - ADC A, D zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8a].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8b - ADC A, E', () => {
      cpu.registers.a = 0x12;
      cpu.registers.e = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].fn(cpu);
      expect(cpu.registers.a).toBe(0x47);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x8b - ADC A, E half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8b - ADC A, E carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8b - ADC A, E zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8b].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8c - ADC A, H', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].fn(cpu);
      expect(cpu.registers.a).toBe(0x47);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x8c - ADC A, H half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8c - ADC A, H carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8c - ADC A, H zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8c].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8d - ADC A, L', () => {
      cpu.registers.a = 0x12;
      cpu.registers.l = 0x34;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].fn(cpu);
      expect(cpu.registers.a).toBe(0x47);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x8d - ADC A, L half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8d - ADC A, L carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8d - ADC A, L zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8d].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8e - ADC A, (HL)', () => {
      cpu.registers.a = 0x12;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].fn(cpu);
      expect(cpu.registers.a).toBe(0x14);
      expect(cpu.pc).toBe(0x0101);
    });

    it('should test 0x8e - ADC A, (HL) half-carry', () => {
      cpu.registers.a = 0x0f;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should text 0x8e - ADC A, (HL) carry', () => {
      cpu.registers.a = 0xff;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8e - ADC A, (HL) zero', () => {
      cpu.registers.a = 0xfe;
      cpu.registers.h = 0x34;
      cpu.registers.l = 0x56;
      emu.memory[0x3456] = 0x01;
      cpu.setFlags({ C: 1 });
      Instructions[0x8e].fn(cpu);
      expect(cpu.registers.a).toBe(0x00);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 1, N: 0, H: 1, C: 1 });
    });

    it('should test 0x8f - ADC A, A', () => {
      cpu.registers.a = 0x08;
      cpu.setFlags({ C: 1 });
      Instructions[0x8f].fn(cpu);
      expect(cpu.registers.a).toBe(0x11);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 1, C: 0 });
    });

    it('should test 0x8f - ADC A, A carry', () => {
      cpu.registers.a = 0xf1;
      cpu.setFlags({ C: 1 });
      Instructions[0x8f].fn(cpu);
      expect(cpu.registers.a).toBe(0xe3);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x8f - ADC A, A zero', () => {
      cpu.registers.a = 0x80;
      cpu.setFlags({ C: 1 });
      Instructions[0x8f].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
      expect(cpu.pc).toBe(0x0101);
      const { Z, N, H, C } = cpu.getFlags();
      expect({ Z, N, H, C }).toStrictEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });
  });
});

function checkCounterIncrement(instruction: number, times: number) {
  const pcBefore = cpu.pc;
  Instructions[instruction].fn(cpu);
  expect(cpu.pc).toBe(pcBefore + times);
}
