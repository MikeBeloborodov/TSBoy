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
});
