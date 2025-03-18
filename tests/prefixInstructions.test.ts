import { CPU } from '../src/CPU';
import { Emulator } from '../src/emulator';
import { PrefixInstructions } from '../src/prefixInstructions';

let emu: Emulator;
let cpu: CPU;

beforeEach(() => {
  emu = new Emulator(Buffer.alloc(0x200000));
  cpu = emu.cpu;
});

describe('Tests prefix instructions', () => {
  describe('Tests for SET instructions', () => {
    it('should set bit 0 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xc0].fn(cpu);
      expect(cpu.registers.b).toBe(0x01);
    });

    it('should set bit 2 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xd0].fn(cpu);
      expect(cpu.registers.b).toBe(0x04);
    });

    it('should set bit 4 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xe0].fn(cpu);
      expect(cpu.registers.b).toBe(0x10);
    });

    it('should set bit 6 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xf0].fn(cpu);
      expect(cpu.registers.b).toBe(0x40);
    });

    it('should set bit 0 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xc1].fn(cpu);
      expect(cpu.registers.c).toBe(0x01);
    });

    it('should set bit 2 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xd1].fn(cpu);
      expect(cpu.registers.c).toBe(0x04);
    });

    it('should set bit 4 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xe1].fn(cpu);
      expect(cpu.registers.c).toBe(0x10);
    });

    it('should set bit 6 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xf1].fn(cpu);
      expect(cpu.registers.c).toBe(0x40);
    });

    it('should set bit 0 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xc2].fn(cpu);
      expect(cpu.registers.d).toBe(0x01);
    });

    it('should set bit 2 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xd2].fn(cpu);
      expect(cpu.registers.d).toBe(0x04);
    });

    it('should set bit 4 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xe2].fn(cpu);
      expect(cpu.registers.d).toBe(0x10);
    });

    it('should set bit 6 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xf2].fn(cpu);
      expect(cpu.registers.d).toBe(0x40);
    });

    it('should set bit 0 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xc3].fn(cpu);
      expect(cpu.registers.e).toBe(0x01);
    });

    it('should set bit 2 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xd3].fn(cpu);
      expect(cpu.registers.e).toBe(0x04);
    });

    it('should set bit 4 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xe3].fn(cpu);
      expect(cpu.registers.e).toBe(0x10);
    });

    it('should set bit 6 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xf3].fn(cpu);
      expect(cpu.registers.e).toBe(0x40);
    });

    it('should set bit 0 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xc4].fn(cpu);
      expect(cpu.registers.h).toBe(0x01);
    });

    it('should set bit 2 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xd4].fn(cpu);
      expect(cpu.registers.h).toBe(0x04);
    });

    it('should set bit 4 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xe4].fn(cpu);
      expect(cpu.registers.h).toBe(0x10);
    });

    it('should set bit 6 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xf4].fn(cpu);
      expect(cpu.registers.h).toBe(0x40);
    });

    it('should set bit 0 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xc5].fn(cpu);
      expect(cpu.registers.l).toBe(0x01);
    });

    it('should set bit 2 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xd5].fn(cpu);
      expect(cpu.registers.l).toBe(0x04);
    });

    it('should set bit 4 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xe5].fn(cpu);
      expect(cpu.registers.l).toBe(0x10);
    });

    it('should set bit 6 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xf5].fn(cpu);
      expect(cpu.registers.l).toBe(0x40);
    });

    it('should set bit 0 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xc6].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x01);
    });

    it('should set bit 2 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xd6].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x04);
    });

    it('should set bit 4 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xe6].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x10);
    });

    it('should set bit 6 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xf6].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x40);
    });

    it('should set bit 0 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xc7].fn(cpu);
      expect(cpu.registers.a).toBe(0x01);
    });

    it('should set bit 2 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xd7].fn(cpu);
      expect(cpu.registers.a).toBe(0x04);
    });

    it('should set bit 4 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xe7].fn(cpu);
      expect(cpu.registers.a).toBe(0x10);
    });

    it('should set bit 6 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xf7].fn(cpu);
      expect(cpu.registers.a).toBe(0x40);
    });

    it('should set bit 1 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xc8].fn(cpu);
      expect(cpu.registers.b).toBe(0x02);
    });

    it('should set bit 3 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xd8].fn(cpu);
      expect(cpu.registers.b).toBe(0x08);
    });

    it('should set bit 5 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xe8].fn(cpu);
      expect(cpu.registers.b).toBe(0x20);
    });

    it('should set bit 7 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xf8].fn(cpu);
      expect(cpu.registers.b).toBe(0x80);
    });

    it('should set bit 1 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xc9].fn(cpu);
      expect(cpu.registers.c).toBe(0x02);
    });

    it('should set bit 3 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xd9].fn(cpu);
      expect(cpu.registers.c).toBe(0x08);
    });

    it('should set bit 5 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xe9].fn(cpu);
      expect(cpu.registers.c).toBe(0x20);
    });

    it('should set bit 7 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xf9].fn(cpu);
      expect(cpu.registers.c).toBe(0x80);
    });

    it('should set bit 1 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xca].fn(cpu);
      expect(cpu.registers.d).toBe(0x02);
    });

    it('should set bit 3 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xda].fn(cpu);
      expect(cpu.registers.d).toBe(0x08);
    });

    it('should set bit 5 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xea].fn(cpu);
      expect(cpu.registers.d).toBe(0x20);
    });

    it('should set bit 7 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xfa].fn(cpu);
      expect(cpu.registers.d).toBe(0x80);
    });

    it('should set bit 1 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xcb].fn(cpu);
      expect(cpu.registers.e).toBe(0x02);
    });

    it('should set bit 3 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xdb].fn(cpu);
      expect(cpu.registers.e).toBe(0x08);
    });

    it('should set bit 5 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xeb].fn(cpu);
      expect(cpu.registers.e).toBe(0x20);
    });

    it('should set bit 7 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xfb].fn(cpu);
      expect(cpu.registers.e).toBe(0x80);
    });

    it('should set bit 1 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xcc].fn(cpu);
      expect(cpu.registers.h).toBe(0x02);
    });

    it('should set bit 3 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xdc].fn(cpu);
      expect(cpu.registers.h).toBe(0x08);
    });

    it('should set bit 5 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xec].fn(cpu);
      expect(cpu.registers.h).toBe(0x20);
    });

    it('should set bit 7 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xfc].fn(cpu);
      expect(cpu.registers.h).toBe(0x80);
    });

    it('should set bit 1 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xcd].fn(cpu);
      expect(cpu.registers.l).toBe(0x02);
    });

    it('should set bit 3 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xdd].fn(cpu);
      expect(cpu.registers.l).toBe(0x08);
    });

    it('should set bit 5 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xed].fn(cpu);
      expect(cpu.registers.l).toBe(0x20);
    });

    it('should set bit 7 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xfd].fn(cpu);
      expect(cpu.registers.l).toBe(0x80);
    });

    it('should set bit 1 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xce].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x02);
    });

    it('should set bit 3 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xde].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x08);
    });

    it('should set bit 5 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xee].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x20);
    });

    it('should set bit 7 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xfe].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x80);
    });

    it('should set bit 1 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xcf].fn(cpu);
      expect(cpu.registers.a).toBe(0x02);
    });

    it('should set bit 3 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xdf].fn(cpu);
      expect(cpu.registers.a).toBe(0x08);
    });

    it('should set bit 5 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xef].fn(cpu);
      expect(cpu.registers.a).toBe(0x20);
    });

    it('should set bit 7 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xff].fn(cpu);
      expect(cpu.registers.a).toBe(0x80);
    });
  });

  describe('Tests for RES instructions', () => {
    it('should set bit 0 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x80].fn(cpu);
      expect(cpu.registers.b).toBe(0xfe);
    });

    it('should set bit 2 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x90].fn(cpu);
      expect(cpu.registers.b).toBe(0xfb);
    });

    it('should set bit 4 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xa0].fn(cpu);
      expect(cpu.registers.b).toBe(0xef);
    });

    it('should set bit 6 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xb0].fn(cpu);
      expect(cpu.registers.b).toBe(0xbf);
    });

    it('should set bit 0 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x81].fn(cpu);
      expect(cpu.registers.c).toBe(0xfe);
    });

    it('should set bit 2 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x91].fn(cpu);
      expect(cpu.registers.c).toBe(0xfb);
    });

    it('should set bit 4 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xa1].fn(cpu);
      expect(cpu.registers.c).toBe(0xef);
    });

    it('should set bit 6 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xb1].fn(cpu);
      expect(cpu.registers.c).toBe(0xbf);
    });

    it('should set bit 0 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x82].fn(cpu);
      expect(cpu.registers.d).toBe(0xfe);
    });

    it('should set bit 2 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x92].fn(cpu);
      expect(cpu.registers.d).toBe(0xfb);
    });

    it('should set bit 4 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xa2].fn(cpu);
      expect(cpu.registers.d).toBe(0xef);
    });

    it('should set bit 6 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xb2].fn(cpu);
      expect(cpu.registers.d).toBe(0xbf);
    });

    it('should set bit 0 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x83].fn(cpu);
      expect(cpu.registers.e).toBe(0xfe);
    });

    it('should set bit 2 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x93].fn(cpu);
      expect(cpu.registers.e).toBe(0xfb);
    });

    it('should set bit 4 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xa3].fn(cpu);
      expect(cpu.registers.e).toBe(0xef);
    });

    it('should set bit 6 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xb3].fn(cpu);
      expect(cpu.registers.e).toBe(0xbf);
    });

    it('should set bit 0 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x84].fn(cpu);
      expect(cpu.registers.h).toBe(0xfe);
    });

    it('should set bit 2 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x94].fn(cpu);
      expect(cpu.registers.h).toBe(0xfb);
    });

    it('should set bit 4 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xa4].fn(cpu);
      expect(cpu.registers.h).toBe(0xef);
    });

    it('should set bit 6 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xb4].fn(cpu);
      expect(cpu.registers.h).toBe(0xbf);
    });

    it('should set bit 0 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x85].fn(cpu);
      expect(cpu.registers.l).toBe(0xfe);
    });

    it('should set bit 2 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x95].fn(cpu);
      expect(cpu.registers.l).toBe(0xfb);
    });

    it('should set bit 4 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xa5].fn(cpu);
      expect(cpu.registers.l).toBe(0xef);
    });

    it('should set bit 6 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xb5].fn(cpu);
      expect(cpu.registers.l).toBe(0xbf);
    });

    it('should set bit 0 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x86].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xfe);
    });

    it('should set bit 2 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x96].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xfb);
    });

    it('should set bit 4 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xa6].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xef);
    });

    it('should set bit 6 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xb6].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xbf);
    });

    it('should set bit 0 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x87].fn(cpu);
      expect(cpu.registers.a).toBe(0xfe);
    });

    it('should set bit 2 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x97].fn(cpu);
      expect(cpu.registers.a).toBe(0xfb);
    });

    it('should set bit 4 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xa7].fn(cpu);
      expect(cpu.registers.a).toBe(0xef);
    });

    it('should set bit 6 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xb7].fn(cpu);
      expect(cpu.registers.a).toBe(0xbf);
    });

    it('should set bit 1 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x88].fn(cpu);
      expect(cpu.registers.b).toBe(0xfd);
    });

    it('should set bit 3 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x98].fn(cpu);
      expect(cpu.registers.b).toBe(0xf7);
    });

    it('should set bit 5 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xa8].fn(cpu);
      expect(cpu.registers.b).toBe(0xdf);
    });

    it('should set bit 7 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xb8].fn(cpu);
      expect(cpu.registers.b).toBe(0x7f);
    });

    it('should set bit 7 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xb8].fn(cpu);
      expect(cpu.registers.b).toBe(0x7f);
    });

    it('should set bit 1 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x89].fn(cpu);
      expect(cpu.registers.c).toBe(0xfd);
    });

    it('should set bit 3 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x99].fn(cpu);
      expect(cpu.registers.c).toBe(0xf7);
    });

    it('should set bit 5 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xa9].fn(cpu);
      expect(cpu.registers.c).toBe(0xdf);
    });

    it('should set bit 7 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xb9].fn(cpu);
      expect(cpu.registers.c).toBe(0x7f);
    });

    it('should set bit 1 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x8a].fn(cpu);
      expect(cpu.registers.d).toBe(0xfd);
    });

    it('should set bit 3 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x9a].fn(cpu);
      expect(cpu.registers.d).toBe(0xf7);
    });

    it('should set bit 5 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xaa].fn(cpu);
      expect(cpu.registers.d).toBe(0xdf);
    });

    it('should set bit 7 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xba].fn(cpu);
      expect(cpu.registers.d).toBe(0x7f);
    });

    it('should set bit 1 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x8b].fn(cpu);
      expect(cpu.registers.e).toBe(0xfd);
    });

    it('should set bit 3 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x9b].fn(cpu);
      expect(cpu.registers.e).toBe(0xf7);
    });

    it('should set bit 5 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xab].fn(cpu);
      expect(cpu.registers.e).toBe(0xdf);
    });

    it('should set bit 7 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xbb].fn(cpu);
      expect(cpu.registers.e).toBe(0x7f);
    });

    it('should set bit 1 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x8c].fn(cpu);
      expect(cpu.registers.h).toBe(0xfd);
    });

    it('should set bit 3 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x9c].fn(cpu);
      expect(cpu.registers.h).toBe(0xf7);
    });

    it('should set bit 5 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xac].fn(cpu);
      expect(cpu.registers.h).toBe(0xdf);
    });

    it('should set bit 7 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xbc].fn(cpu);
      expect(cpu.registers.h).toBe(0x7f);
    });

    it('should set bit 1 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x8d].fn(cpu);
      expect(cpu.registers.l).toBe(0xfd);
    });

    it('should set bit 3 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x9d].fn(cpu);
      expect(cpu.registers.l).toBe(0xf7);
    });

    it('should set bit 5 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xad].fn(cpu);
      expect(cpu.registers.l).toBe(0xdf);
    });

    it('should set bit 7 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xbd].fn(cpu);
      expect(cpu.registers.l).toBe(0x7f);
    });

    it('should set bit 1 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x8e].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xfd);
    });

    it('should set bit 3 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x9e].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xf7);
    });

    it('should set bit 5 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xae].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0xdf);
    });

    it('should set bit 7 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xbe].fn(cpu);
      expect(emu.memory[0xff00]).toBe(0x7f);
    });

    it('should set bit 1 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x8f].fn(cpu);
      expect(cpu.registers.a).toBe(0xfd);
    });

    it('should set bit 3 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x9f].fn(cpu);
      expect(cpu.registers.a).toBe(0xf7);
    });

    it('should set bit 5 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xaf].fn(cpu);
      expect(cpu.registers.a).toBe(0xdf);
    });

    it('should set bit 7 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xbf].fn(cpu);
      expect(cpu.registers.a).toBe(0x7f);
    });
  });

  describe('Tests BIT instructions', () => {
    it('should test 0x40 - bit 0 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x40].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x40 - bit 0 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x40].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x41 - bit 0 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x41].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x41 - bit 0 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x41].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x42 - bit 0 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x42].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x42 - bit 0 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x42].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x43 - bit 0 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x43].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x43 - bit 0 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x43].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x44 - bit 0 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x44].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x44 - bit 0 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x44].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x45 - bit 0 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x45].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x45 - bit 0 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x45].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x46 - bit 0 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x46].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x46 - bit 0 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x46].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x47 - bit 0 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x47].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x47 - bit 0 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x47].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x48 - bit 1 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x48].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x48 - bit 1 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x48].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x49 - bit 1 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x49].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x49 - bit 1 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x49].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4a - bit 1 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x4a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4a - bit 1 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x4a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4b - bit 1 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x4b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4b - bit 1 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x4b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4c - bit 1 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x4c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4c - bit 1 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x4c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4d - bit 1 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x4d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4d - bit 1 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x4d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4e - bit 1 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x4e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4e - bit 1 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x4e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4f - bit 1 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x4f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4f - bit 1 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x4f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x50 - bit 2 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x50].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x50 - bit 2 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x50].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x51 - bit 2 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x51].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x51 - bit 2 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x51].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x52 - bit 2 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x52].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x52 - bit 2 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x52].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x53 - bit 2 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x53].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x53 - bit 2 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x53].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x54 - bit 2 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x54].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x54 - bit 2 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x54].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x55 - bit 2 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x55].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x55 - bit 2 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x55].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x56 - bit 2 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x56].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x56 - bit 2 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x56].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x57 - bit 2 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x57].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x57 - bit 2 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x57].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x58 - bit 3 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x58].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x58 - bit 3 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x58].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x59 - bit 3 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x59].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x59 - bit 3 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x59].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5a - bit 3 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x5a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5a - bit 3 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x5a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5b - bit 3 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x5b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5b - bit 3 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x5b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5c - bit 3 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x5c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5c - bit 3 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x5c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5d - bit 3 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x5d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5d - bit 3 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x5d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5e - bit 3 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x5e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5e - bit 3 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x5e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5f - bit 3 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x5f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5f - bit 3 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x5f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x60 - bit 4 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x60].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x60 - bit 4 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x60].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x61 - bit 4 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x61].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x61 - bit 4 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x61].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x62 - bit 4 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x62].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x62 - bit 4 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x62].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x63 - bit 4 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x63].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x63 - bit 4 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x63].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x64 - bit 4 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x64].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x64 - bit 4 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x64].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x65 - bit 4 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x65].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x65 - bit 4 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x65].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x66 - bit 4 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x66].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x66 - bit 4 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x66].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x67 - bit 4 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x67].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x67 - bit 4 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x67].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x68 - bit 5 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x68].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x68 - bit 5 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x68].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x69 - bit 5 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x69].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x69 - bit 5 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x69].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6a - bit 5 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x6a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6a - bit 5 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x6a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6b - bit 5 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x6b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6b - bit 5 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x6b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6c - bit 5 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x6c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6c - bit 5 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x6c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6d - bit 5 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x6d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6d - bit 5 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x6d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6e - bit 5 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x6e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6e - bit 5 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x6e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6f - bit 5 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x6f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6f - bit 5 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x6f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x70 - bit 6 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x70].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x70 - bit 6 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x70].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x71 - bit 6 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x71].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x71 - bit 6 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x71].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x72 - bit 6 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x72].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x72 - bit 6 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x72].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x73 - bit 6 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x73].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x73 - bit 6 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x73].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x74 - bit 6 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x74].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x74 - bit 6 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x74].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x75 - bit 6 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x75].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x75 - bit 6 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x75].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x76 - bit 6 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x76].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x76 - bit 6 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x76].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x77 - bit 6 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x77].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x77 - bit 6 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x77].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x78 - bit 7 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x78].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x78 - bit 7 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x78].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x79 - bit 7 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x79].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x79 - bit 7 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x79].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7a - bit 7 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x7a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7a - bit 7 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x7a].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7b - bit 7 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x7b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7b - bit 7 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x7b].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7c - bit 7 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x7c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7c - bit 7 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x7c].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7d - bit 7 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x7d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7d - bit 7 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x7d].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7e - bit 7 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x7e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7e - bit 7 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x7e].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7f - bit 7 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x7f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7f - bit 7 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x7f].fn(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });
  });

  describe('Tests for SRL instructions', () => {
    it('should shift right 0x38 - register B carry', () => {
      cpu.registers.b = 0x03;
      PrefixInstructions[0x38].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x38 - register B no carry', () => {
      cpu.registers.b = 0x02;
      PrefixInstructions[0x38].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x39 - register C carry', () => {
      cpu.registers.c = 0x03;
      PrefixInstructions[0x39].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x39 - register C no carry', () => {
      cpu.registers.c = 0x02;
      PrefixInstructions[0x39].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3a - register D carry', () => {
      cpu.registers.d = 0x03;
      PrefixInstructions[0x3a].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3a - register D no carry', () => {
      cpu.registers.d = 0x02;
      PrefixInstructions[0x3a].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3b - register E carry', () => {
      cpu.registers.e = 0x03;
      PrefixInstructions[0x3b].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3b - register E no carry', () => {
      cpu.registers.e = 0x02;
      PrefixInstructions[0x3b].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3c - register H carry', () => {
      cpu.registers.h = 0x03;
      PrefixInstructions[0x3c].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3c - register H no carry', () => {
      cpu.registers.h = 0x02;
      PrefixInstructions[0x3c].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3d - register L carry', () => {
      cpu.registers.l = 0x03;
      PrefixInstructions[0x3d].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3d - register L no carry', () => {
      cpu.registers.l = 0x02;
      PrefixInstructions[0x3d].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3e - value at address HL carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x03;
      PrefixInstructions[0x3e].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3e - value at address HL no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x02;
      PrefixInstructions[0x3e].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3f - register A carry', () => {
      cpu.registers.a = 0x03;
      PrefixInstructions[0x3f].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3f - register A no carry', () => {
      cpu.registers.a = 0x02;
      PrefixInstructions[0x3f].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests RR functions', () => {
    it('should test 0x18 - register B with carry', () => {
      cpu.registers.b = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x18].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x18 - register B no carry', () => {
      cpu.registers.b = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x18].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x19 - register C with carry', () => {
      cpu.registers.c = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x19].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x19 - register C no carry', () => {
      cpu.registers.c = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x19].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1a - register D with carry', () => {
      cpu.registers.d = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1a].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1a - register D no carry', () => {
      cpu.registers.d = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1a].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1b - register E with carry', () => {
      cpu.registers.e = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1b].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1b - register E no carry', () => {
      cpu.registers.e = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1b].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1c - register H with carry', () => {
      cpu.registers.h = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1c].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1c - register H no carry', () => {
      cpu.registers.h = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1c].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1d - register L with carry', () => {
      cpu.registers.l = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1d].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1d - register L no carry', () => {
      cpu.registers.l = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1d].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1e - value from HL with carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1e].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1e - value from HL no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1e].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1f - register A with carry', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1f].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1f - register A no carry', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1f].fn(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });
  });
});
