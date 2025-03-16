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
    beforeEach(() => {
      cpu.memRead = jest.fn(() => 0x05);
    });

    it('should increment pc by 2', () => {
      cpu.setFlags({ Z: 0 });
      checkCounterIncrement(0x20, 2);
    });

    it('should jump to the correct address if Z flag is false', () => {
      cpu.setFlags({ Z: 0 });
      Instructions[0x20].fn(cpu);
      expect(cpu.pc).toBe(0x0102);
    });

    it('should not jump if Z flag is true', () => {
      cpu.setFlags({ Z: 1 });
      Instructions[0x20].fn(cpu);
      expect(cpu.pc).toBe(0x0107);
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
});

function checkCounterIncrement(instruction: number, times: number) {
  const pcBefore = cpu.pc;
  Instructions[instruction].fn(cpu);
  expect(cpu.pc).toBe(pcBefore + times);
}
