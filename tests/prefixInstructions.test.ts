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
      PrefixInstructions[0xc0].execute(cpu);
      expect(cpu.registers.b).toBe(0x01);
    });

    it('should set bit 2 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xd0].execute(cpu);
      expect(cpu.registers.b).toBe(0x04);
    });

    it('should set bit 4 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xe0].execute(cpu);
      expect(cpu.registers.b).toBe(0x10);
    });

    it('should set bit 6 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xf0].execute(cpu);
      expect(cpu.registers.b).toBe(0x40);
    });

    it('should set bit 0 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xc1].execute(cpu);
      expect(cpu.registers.c).toBe(0x01);
    });

    it('should set bit 2 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xd1].execute(cpu);
      expect(cpu.registers.c).toBe(0x04);
    });

    it('should set bit 4 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xe1].execute(cpu);
      expect(cpu.registers.c).toBe(0x10);
    });

    it('should set bit 6 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xf1].execute(cpu);
      expect(cpu.registers.c).toBe(0x40);
    });

    it('should set bit 0 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xc2].execute(cpu);
      expect(cpu.registers.d).toBe(0x01);
    });

    it('should set bit 2 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xd2].execute(cpu);
      expect(cpu.registers.d).toBe(0x04);
    });

    it('should set bit 4 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xe2].execute(cpu);
      expect(cpu.registers.d).toBe(0x10);
    });

    it('should set bit 6 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xf2].execute(cpu);
      expect(cpu.registers.d).toBe(0x40);
    });

    it('should set bit 0 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xc3].execute(cpu);
      expect(cpu.registers.e).toBe(0x01);
    });

    it('should set bit 2 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xd3].execute(cpu);
      expect(cpu.registers.e).toBe(0x04);
    });

    it('should set bit 4 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xe3].execute(cpu);
      expect(cpu.registers.e).toBe(0x10);
    });

    it('should set bit 6 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xf3].execute(cpu);
      expect(cpu.registers.e).toBe(0x40);
    });

    it('should set bit 0 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xc4].execute(cpu);
      expect(cpu.registers.h).toBe(0x01);
    });

    it('should set bit 2 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xd4].execute(cpu);
      expect(cpu.registers.h).toBe(0x04);
    });

    it('should set bit 4 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xe4].execute(cpu);
      expect(cpu.registers.h).toBe(0x10);
    });

    it('should set bit 6 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xf4].execute(cpu);
      expect(cpu.registers.h).toBe(0x40);
    });

    it('should set bit 0 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xc5].execute(cpu);
      expect(cpu.registers.l).toBe(0x01);
    });

    it('should set bit 2 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xd5].execute(cpu);
      expect(cpu.registers.l).toBe(0x04);
    });

    it('should set bit 4 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xe5].execute(cpu);
      expect(cpu.registers.l).toBe(0x10);
    });

    it('should set bit 6 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xf5].execute(cpu);
      expect(cpu.registers.l).toBe(0x40);
    });

    it('should set bit 0 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xc6].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x01);
    });

    it('should set bit 2 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xd6].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x04);
    });

    it('should set bit 4 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xe6].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x10);
    });

    it('should set bit 6 of value at the address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xf6].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x40);
    });

    it('should set bit 0 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xc7].execute(cpu);
      expect(cpu.registers.a).toBe(0x01);
    });

    it('should set bit 2 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xd7].execute(cpu);
      expect(cpu.registers.a).toBe(0x04);
    });

    it('should set bit 4 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xe7].execute(cpu);
      expect(cpu.registers.a).toBe(0x10);
    });

    it('should set bit 6 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xf7].execute(cpu);
      expect(cpu.registers.a).toBe(0x40);
    });

    it('should set bit 1 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xc8].execute(cpu);
      expect(cpu.registers.b).toBe(0x02);
    });

    it('should set bit 3 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xd8].execute(cpu);
      expect(cpu.registers.b).toBe(0x08);
    });

    it('should set bit 5 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xe8].execute(cpu);
      expect(cpu.registers.b).toBe(0x20);
    });

    it('should set bit 7 of register B to 1', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0xf8].execute(cpu);
      expect(cpu.registers.b).toBe(0x80);
    });

    it('should set bit 1 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xc9].execute(cpu);
      expect(cpu.registers.c).toBe(0x02);
    });

    it('should set bit 3 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xd9].execute(cpu);
      expect(cpu.registers.c).toBe(0x08);
    });

    it('should set bit 5 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xe9].execute(cpu);
      expect(cpu.registers.c).toBe(0x20);
    });

    it('should set bit 7 of register C to 1', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0xf9].execute(cpu);
      expect(cpu.registers.c).toBe(0x80);
    });

    it('should set bit 1 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xca].execute(cpu);
      expect(cpu.registers.d).toBe(0x02);
    });

    it('should set bit 3 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xda].execute(cpu);
      expect(cpu.registers.d).toBe(0x08);
    });

    it('should set bit 5 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xea].execute(cpu);
      expect(cpu.registers.d).toBe(0x20);
    });

    it('should set bit 7 of register D to 1', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0xfa].execute(cpu);
      expect(cpu.registers.d).toBe(0x80);
    });

    it('should set bit 1 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xcb].execute(cpu);
      expect(cpu.registers.e).toBe(0x02);
    });

    it('should set bit 3 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xdb].execute(cpu);
      expect(cpu.registers.e).toBe(0x08);
    });

    it('should set bit 5 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xeb].execute(cpu);
      expect(cpu.registers.e).toBe(0x20);
    });

    it('should set bit 7 of register E to 1', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0xfb].execute(cpu);
      expect(cpu.registers.e).toBe(0x80);
    });

    it('should set bit 1 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xcc].execute(cpu);
      expect(cpu.registers.h).toBe(0x02);
    });

    it('should set bit 3 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xdc].execute(cpu);
      expect(cpu.registers.h).toBe(0x08);
    });

    it('should set bit 5 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xec].execute(cpu);
      expect(cpu.registers.h).toBe(0x20);
    });

    it('should set bit 7 of register H to 1', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0xfc].execute(cpu);
      expect(cpu.registers.h).toBe(0x80);
    });

    it('should set bit 1 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xcd].execute(cpu);
      expect(cpu.registers.l).toBe(0x02);
    });

    it('should set bit 3 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xdd].execute(cpu);
      expect(cpu.registers.l).toBe(0x08);
    });

    it('should set bit 5 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xed].execute(cpu);
      expect(cpu.registers.l).toBe(0x20);
    });

    it('should set bit 7 of register L to 1', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0xfd].execute(cpu);
      expect(cpu.registers.l).toBe(0x80);
    });

    it('should set bit 1 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xce].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x02);
    });

    it('should set bit 3 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xde].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x08);
    });

    it('should set bit 5 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xee].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x20);
    });

    it('should set bit 7 of value at address HL to 1', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0xfe].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x80);
    });

    it('should set bit 1 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xcf].execute(cpu);
      expect(cpu.registers.a).toBe(0x02);
    });

    it('should set bit 3 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xdf].execute(cpu);
      expect(cpu.registers.a).toBe(0x08);
    });

    it('should set bit 5 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xef].execute(cpu);
      expect(cpu.registers.a).toBe(0x20);
    });

    it('should set bit 7 of register A to 1', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0xff].execute(cpu);
      expect(cpu.registers.a).toBe(0x80);
    });
  });

  describe('Tests for RES instructions', () => {
    it('should set bit 0 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x80].execute(cpu);
      expect(cpu.registers.b).toBe(0xfe);
    });

    it('should set bit 2 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x90].execute(cpu);
      expect(cpu.registers.b).toBe(0xfb);
    });

    it('should set bit 4 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xa0].execute(cpu);
      expect(cpu.registers.b).toBe(0xef);
    });

    it('should set bit 6 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xb0].execute(cpu);
      expect(cpu.registers.b).toBe(0xbf);
    });

    it('should set bit 0 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x81].execute(cpu);
      expect(cpu.registers.c).toBe(0xfe);
    });

    it('should set bit 2 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x91].execute(cpu);
      expect(cpu.registers.c).toBe(0xfb);
    });

    it('should set bit 4 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xa1].execute(cpu);
      expect(cpu.registers.c).toBe(0xef);
    });

    it('should set bit 6 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xb1].execute(cpu);
      expect(cpu.registers.c).toBe(0xbf);
    });

    it('should set bit 0 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x82].execute(cpu);
      expect(cpu.registers.d).toBe(0xfe);
    });

    it('should set bit 2 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x92].execute(cpu);
      expect(cpu.registers.d).toBe(0xfb);
    });

    it('should set bit 4 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xa2].execute(cpu);
      expect(cpu.registers.d).toBe(0xef);
    });

    it('should set bit 6 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xb2].execute(cpu);
      expect(cpu.registers.d).toBe(0xbf);
    });

    it('should set bit 0 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x83].execute(cpu);
      expect(cpu.registers.e).toBe(0xfe);
    });

    it('should set bit 2 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x93].execute(cpu);
      expect(cpu.registers.e).toBe(0xfb);
    });

    it('should set bit 4 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xa3].execute(cpu);
      expect(cpu.registers.e).toBe(0xef);
    });

    it('should set bit 6 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xb3].execute(cpu);
      expect(cpu.registers.e).toBe(0xbf);
    });

    it('should set bit 0 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x84].execute(cpu);
      expect(cpu.registers.h).toBe(0xfe);
    });

    it('should set bit 2 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x94].execute(cpu);
      expect(cpu.registers.h).toBe(0xfb);
    });

    it('should set bit 4 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xa4].execute(cpu);
      expect(cpu.registers.h).toBe(0xef);
    });

    it('should set bit 6 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xb4].execute(cpu);
      expect(cpu.registers.h).toBe(0xbf);
    });

    it('should set bit 0 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x85].execute(cpu);
      expect(cpu.registers.l).toBe(0xfe);
    });

    it('should set bit 2 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x95].execute(cpu);
      expect(cpu.registers.l).toBe(0xfb);
    });

    it('should set bit 4 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xa5].execute(cpu);
      expect(cpu.registers.l).toBe(0xef);
    });

    it('should set bit 6 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xb5].execute(cpu);
      expect(cpu.registers.l).toBe(0xbf);
    });

    it('should set bit 0 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x86].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xfe);
    });

    it('should set bit 2 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x96].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xfb);
    });

    it('should set bit 4 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xa6].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xef);
    });

    it('should set bit 6 of value at the address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xb6].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xbf);
    });

    it('should set bit 0 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x87].execute(cpu);
      expect(cpu.registers.a).toBe(0xfe);
    });

    it('should set bit 2 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x97].execute(cpu);
      expect(cpu.registers.a).toBe(0xfb);
    });

    it('should set bit 4 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xa7].execute(cpu);
      expect(cpu.registers.a).toBe(0xef);
    });

    it('should set bit 6 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xb7].execute(cpu);
      expect(cpu.registers.a).toBe(0xbf);
    });

    it('should set bit 1 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x88].execute(cpu);
      expect(cpu.registers.b).toBe(0xfd);
    });

    it('should set bit 3 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x98].execute(cpu);
      expect(cpu.registers.b).toBe(0xf7);
    });

    it('should set bit 5 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xa8].execute(cpu);
      expect(cpu.registers.b).toBe(0xdf);
    });

    it('should set bit 7 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xb8].execute(cpu);
      expect(cpu.registers.b).toBe(0x7f);
    });

    it('should set bit 7 of register B to 0', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0xb8].execute(cpu);
      expect(cpu.registers.b).toBe(0x7f);
    });

    it('should set bit 1 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x89].execute(cpu);
      expect(cpu.registers.c).toBe(0xfd);
    });

    it('should set bit 3 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x99].execute(cpu);
      expect(cpu.registers.c).toBe(0xf7);
    });

    it('should set bit 5 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xa9].execute(cpu);
      expect(cpu.registers.c).toBe(0xdf);
    });

    it('should set bit 7 of register C to 0', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0xb9].execute(cpu);
      expect(cpu.registers.c).toBe(0x7f);
    });

    it('should set bit 1 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x8a].execute(cpu);
      expect(cpu.registers.d).toBe(0xfd);
    });

    it('should set bit 3 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x9a].execute(cpu);
      expect(cpu.registers.d).toBe(0xf7);
    });

    it('should set bit 5 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xaa].execute(cpu);
      expect(cpu.registers.d).toBe(0xdf);
    });

    it('should set bit 7 of register D to 0', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0xba].execute(cpu);
      expect(cpu.registers.d).toBe(0x7f);
    });

    it('should set bit 1 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x8b].execute(cpu);
      expect(cpu.registers.e).toBe(0xfd);
    });

    it('should set bit 3 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x9b].execute(cpu);
      expect(cpu.registers.e).toBe(0xf7);
    });

    it('should set bit 5 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xab].execute(cpu);
      expect(cpu.registers.e).toBe(0xdf);
    });

    it('should set bit 7 of register E to 0', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0xbb].execute(cpu);
      expect(cpu.registers.e).toBe(0x7f);
    });

    it('should set bit 1 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x8c].execute(cpu);
      expect(cpu.registers.h).toBe(0xfd);
    });

    it('should set bit 3 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x9c].execute(cpu);
      expect(cpu.registers.h).toBe(0xf7);
    });

    it('should set bit 5 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xac].execute(cpu);
      expect(cpu.registers.h).toBe(0xdf);
    });

    it('should set bit 7 of register H to 0', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0xbc].execute(cpu);
      expect(cpu.registers.h).toBe(0x7f);
    });

    it('should set bit 1 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x8d].execute(cpu);
      expect(cpu.registers.l).toBe(0xfd);
    });

    it('should set bit 3 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x9d].execute(cpu);
      expect(cpu.registers.l).toBe(0xf7);
    });

    it('should set bit 5 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xad].execute(cpu);
      expect(cpu.registers.l).toBe(0xdf);
    });

    it('should set bit 7 of register L to 0', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0xbd].execute(cpu);
      expect(cpu.registers.l).toBe(0x7f);
    });

    it('should set bit 1 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x8e].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xfd);
    });

    it('should set bit 3 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x9e].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xf7);
    });

    it('should set bit 5 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xae].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0xdf);
    });

    it('should set bit 7 of value at address HL to 0', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0xbe].execute(cpu);
      expect(emu.memory[0xff00]).toBe(0x7f);
    });

    it('should set bit 1 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x8f].execute(cpu);
      expect(cpu.registers.a).toBe(0xfd);
    });

    it('should set bit 3 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x9f].execute(cpu);
      expect(cpu.registers.a).toBe(0xf7);
    });

    it('should set bit 5 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xaf].execute(cpu);
      expect(cpu.registers.a).toBe(0xdf);
    });

    it('should set bit 7 of register A to 0', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0xbf].execute(cpu);
      expect(cpu.registers.a).toBe(0x7f);
    });
  });

  describe('Tests BIT instructions', () => {
    it('should test 0x40 - bit 0 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x40].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x40 - bit 0 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x40].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x41 - bit 0 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x41].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x41 - bit 0 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x41].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x42 - bit 0 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x42].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x42 - bit 0 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x42].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x43 - bit 0 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x43].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x43 - bit 0 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x43].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x44 - bit 0 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x44].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x44 - bit 0 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x44].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x45 - bit 0 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x45].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x45 - bit 0 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x45].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x46 - bit 0 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x46].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x46 - bit 0 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x46].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x47 - bit 0 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x47].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x47 - bit 0 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x47].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x48 - bit 1 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x48].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x48 - bit 1 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x48].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x49 - bit 1 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x49].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x49 - bit 1 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x49].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4a - bit 1 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x4a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4a - bit 1 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x4a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4b - bit 1 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x4b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4b - bit 1 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x4b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4c - bit 1 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x4c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4c - bit 1 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x4c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4d - bit 1 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x4d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4d - bit 1 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x4d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4e - bit 1 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x4e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4e - bit 1 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x4e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x4f - bit 1 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x4f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x4f - bit 1 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x4f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x50 - bit 2 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x50].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x50 - bit 2 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x50].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x51 - bit 2 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x51].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x51 - bit 2 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x51].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x52 - bit 2 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x52].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x52 - bit 2 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x52].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x53 - bit 2 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x53].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x53 - bit 2 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x53].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x54 - bit 2 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x54].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x54 - bit 2 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x54].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x55 - bit 2 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x55].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x55 - bit 2 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x55].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x56 - bit 2 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x56].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x56 - bit 2 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x56].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x57 - bit 2 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x57].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x57 - bit 2 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x57].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x58 - bit 3 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x58].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x58 - bit 3 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x58].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x59 - bit 3 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x59].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x59 - bit 3 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x59].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5a - bit 3 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x5a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5a - bit 3 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x5a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5b - bit 3 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x5b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5b - bit 3 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x5b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5c - bit 3 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x5c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5c - bit 3 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x5c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5d - bit 3 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x5d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5d - bit 3 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x5d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5e - bit 3 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x5e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5e - bit 3 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x5e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x5f - bit 3 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x5f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x5f - bit 3 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x5f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x60 - bit 4 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x60].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x60 - bit 4 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x60].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x61 - bit 4 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x61].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x61 - bit 4 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x61].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x62 - bit 4 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x62].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x62 - bit 4 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x62].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x63 - bit 4 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x63].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x63 - bit 4 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x63].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x64 - bit 4 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x64].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x64 - bit 4 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x64].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x65 - bit 4 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x65].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x65 - bit 4 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x65].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x66 - bit 4 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x66].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x66 - bit 4 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x66].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x67 - bit 4 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x67].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x67 - bit 4 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x67].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x68 - bit 5 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x68].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x68 - bit 5 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x68].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x69 - bit 5 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x69].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x69 - bit 5 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x69].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6a - bit 5 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x6a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6a - bit 5 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x6a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6b - bit 5 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x6b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6b - bit 5 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x6b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6c - bit 5 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x6c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6c - bit 5 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x6c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6d - bit 5 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x6d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6d - bit 5 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x6d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6e - bit 5 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x6e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6e - bit 5 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x6e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x6f - bit 5 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x6f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x6f - bit 5 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x6f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x70 - bit 6 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x70].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x70 - bit 6 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x70].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x71 - bit 6 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x71].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x71 - bit 6 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x71].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x72 - bit 6 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x72].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x72 - bit 6 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x72].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x73 - bit 6 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x73].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x73 - bit 6 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x73].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x74 - bit 6 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x74].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x74 - bit 6 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x74].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x75 - bit 6 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x75].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x75 - bit 6 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x75].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x76 - bit 6 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x76].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x76 - bit 6 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x76].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x77 - bit 6 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x77].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x77 - bit 6 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x77].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x78 - bit 7 of register B', () => {
      cpu.registers.b = 0xff;
      PrefixInstructions[0x78].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x78 - bit 7 of register B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x78].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x79 - bit 7 of register C', () => {
      cpu.registers.c = 0xff;
      PrefixInstructions[0x79].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x79 - bit 7 of register C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x79].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7a - bit 7 of register D', () => {
      cpu.registers.d = 0xff;
      PrefixInstructions[0x7a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7a - bit 7 of register D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x7a].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7b - bit 7 of register E', () => {
      cpu.registers.e = 0xff;
      PrefixInstructions[0x7b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7b - bit 7 of register E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x7b].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7c - bit 7 of register H', () => {
      cpu.registers.h = 0xff;
      PrefixInstructions[0x7c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7c - bit 7 of register H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x7c].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7d - bit 7 of register L', () => {
      cpu.registers.l = 0xff;
      PrefixInstructions[0x7d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7d - bit 7 of register L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x7d].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7e - bit 7 of value at address HL', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0xff;
      PrefixInstructions[0x7e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7e - bit 7 of value at address HL zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x7e].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });

    it('should test 0x7f - bit 7 of register A', () => {
      cpu.registers.a = 0xff;
      PrefixInstructions[0x7f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 0, N: 0, H: 1 });
    });

    it('should test 0x7f - bit 7 of register A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x7f].execute(cpu);
      const { Z, N, H } = cpu.getFlags();
      expect({ Z, N, H }).toEqual({ Z: 1, N: 0, H: 1 });
    });
  });

  describe('Tests for SRL instructions', () => {
    it('should shift right 0x38 - register B carry', () => {
      cpu.registers.b = 0x03;
      PrefixInstructions[0x38].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x38 - register B no carry', () => {
      cpu.registers.b = 0x02;
      PrefixInstructions[0x38].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x39 - register C carry', () => {
      cpu.registers.c = 0x03;
      PrefixInstructions[0x39].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x39 - register C no carry', () => {
      cpu.registers.c = 0x02;
      PrefixInstructions[0x39].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3a - register D carry', () => {
      cpu.registers.d = 0x03;
      PrefixInstructions[0x3a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3a - register D no carry', () => {
      cpu.registers.d = 0x02;
      PrefixInstructions[0x3a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3b - register E carry', () => {
      cpu.registers.e = 0x03;
      PrefixInstructions[0x3b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3b - register E no carry', () => {
      cpu.registers.e = 0x02;
      PrefixInstructions[0x3b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3c - register H carry', () => {
      cpu.registers.h = 0x03;
      PrefixInstructions[0x3c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3c - register H no carry', () => {
      cpu.registers.h = 0x02;
      PrefixInstructions[0x3c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3d - register L carry', () => {
      cpu.registers.l = 0x03;
      PrefixInstructions[0x3d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3d - register L no carry', () => {
      cpu.registers.l = 0x02;
      PrefixInstructions[0x3d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3e - value at address HL carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x03;
      PrefixInstructions[0x3e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3e - value at address HL no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x02;
      PrefixInstructions[0x3e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should shift right 0x3f - register A carry', () => {
      cpu.registers.a = 0x03;
      PrefixInstructions[0x3f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should shift right 0x3f - register A no carry', () => {
      cpu.registers.a = 0x02;
      PrefixInstructions[0x3f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests RR functions', () => {
    it('should test 0x18 - register B with carry', () => {
      cpu.registers.b = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x18].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x18 - register B no carry', () => {
      cpu.registers.b = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x18].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x19 - register C with carry', () => {
      cpu.registers.c = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x19].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x19 - register C no carry', () => {
      cpu.registers.c = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x19].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1a - register D with carry', () => {
      cpu.registers.d = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1a - register D no carry', () => {
      cpu.registers.d = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1b - register E with carry', () => {
      cpu.registers.e = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1b - register E no carry', () => {
      cpu.registers.e = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1c - register H with carry', () => {
      cpu.registers.h = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1c - register H no carry', () => {
      cpu.registers.h = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1d - register L with carry', () => {
      cpu.registers.l = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1d - register L no carry', () => {
      cpu.registers.l = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1e - value from HL with carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1e - value from HL no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1f - register A with carry', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x1f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x81);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x1f - register A no carry', () => {
      cpu.registers.a = 0x03;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x1f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });
  });

  describe('Tests for RLC instructions', () => {
    it('should test 0x00 - RLC B', () => {
      cpu.registers.b = 0x80;
      PrefixInstructions[0x00].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x00 - RLC B no carry', () => {
      cpu.registers.b = 0x01;
      PrefixInstructions[0x00].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 00x - RLC B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x00].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x01 - RLC C', () => {
      cpu.registers.c = 0x80;
      PrefixInstructions[0x01].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x01 - RLC C no carry', () => {
      cpu.registers.c = 0x01;
      PrefixInstructions[0x01].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x01 - RLC C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x01].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x02 - RLC D', () => {
      cpu.registers.d = 0x80;
      PrefixInstructions[0x02].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x02 - RLC D no carry', () => {
      cpu.registers.d = 0x01;
      PrefixInstructions[0x02].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x02 - RLC D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x02].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x03 - RLC E', () => {
      cpu.registers.e = 0x80;
      PrefixInstructions[0x03].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x03 - RLC E no carry', () => {
      cpu.registers.e = 0x01;
      PrefixInstructions[0x03].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x03 - RLC E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x03].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x04 - RLC H', () => {
      cpu.registers.h = 0x80;
      PrefixInstructions[0x04].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x04 - RLC H no carry', () => {
      cpu.registers.h = 0x01;
      PrefixInstructions[0x04].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x04 - RLC H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x04].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x05 - RLC L', () => {
      cpu.registers.l = 0x80;
      PrefixInstructions[0x05].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x05 - RLC L no carry', () => {
      cpu.registers.l = 0x01;
      PrefixInstructions[0x05].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x05 - RLC L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x05].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x06 - RLC (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x80;
      PrefixInstructions[0x06].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x06 - RLC (HL) no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      PrefixInstructions[0x06].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x06 - RLC (HL) zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x06].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x07 - RLC A', () => {
      cpu.registers.a = 0x80;
      PrefixInstructions[0x07].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x07 - RLC A no carry', () => {
      cpu.registers.a = 0x01;
      PrefixInstructions[0x07].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x07 - RLC A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x07].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests RRC instructions', () => {
    it('should test 0x08 - RRC B', () => {
      cpu.registers.b = 0x01;
      PrefixInstructions[0x08].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x08 - RRC B no carry', () => {
      cpu.registers.b = 0x80;
      PrefixInstructions[0x08].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x08 - RRC B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x08].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x09 - RRC C', () => {
      cpu.registers.c = 0x01;
      PrefixInstructions[0x09].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x09 - RRC C no carry', () => {
      cpu.registers.c = 0x80;
      PrefixInstructions[0x09].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x09 - RRC C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x09].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0a - RRC D', () => {
      cpu.registers.d = 0x01;
      PrefixInstructions[0x0a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x0a - RRC D no carry', () => {
      cpu.registers.d = 0x80;
      PrefixInstructions[0x0a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0a - RRC D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x0a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0b - RRC E', () => {
      cpu.registers.e = 0x01;
      PrefixInstructions[0x0b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x0b - RRC E no carry', () => {
      cpu.registers.e = 0x80;
      PrefixInstructions[0x0b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0b - RRC E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x0b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0c - RRC H', () => {
      cpu.registers.h = 0x01;
      PrefixInstructions[0x0c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x0c - RRC H no carry', () => {
      cpu.registers.h = 0x80;
      PrefixInstructions[0x0c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0c - RRC H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x0c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0d - RRC L', () => {
      cpu.registers.l = 0x01;
      PrefixInstructions[0x0d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x0d - RRC L no carry', () => {
      cpu.registers.l = 0x80;
      PrefixInstructions[0x0d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0d - RRC L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x0d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0e - RRC (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      PrefixInstructions[0x0e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x0e - RRC (HL) no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x80;
      PrefixInstructions[0x0e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0e - RRC (HL) zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x0e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0f - RRC A', () => {
      cpu.registers.a = 0x01;
      PrefixInstructions[0x0f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x80);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x0f - RRC A no carry', () => {
      cpu.registers.a = 0x80;
      PrefixInstructions[0x0f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x40);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x0f - RRC A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x0f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });

  describe('Tests for RL instructions', () => {
    it('should test 0x10 - RL B', () => {
      cpu.registers.b = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x10].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x10 - RL B carry', () => {
      cpu.registers.b = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x10].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x10 - RL B zero', () => {
      cpu.registers.b = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x10].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x11 - RL C', () => {
      cpu.registers.c = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x11].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x11 - RL C carry', () => {
      cpu.registers.c = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x11].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x11 - RL C zero', () => {
      cpu.registers.c = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x11].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x12 - RL D', () => {
      cpu.registers.d = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x12].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x12 - RL D carry', () => {
      cpu.registers.d = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x12].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x12 - RL D zero', () => {
      cpu.registers.d = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x12].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x13 - RL E', () => {
      cpu.registers.e = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x13].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x13 - RL E carry', () => {
      cpu.registers.e = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x13].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x13 - RL E zero', () => {
      cpu.registers.e = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x13].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x14 - RL H', () => {
      cpu.registers.h = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x14].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x14 - RL H carry', () => {
      cpu.registers.h = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x14].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x14 - RL H zero', () => {
      cpu.registers.h = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x14].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x15 - RL L', () => {
      cpu.registers.l = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x15].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x15 - RL L carry', () => {
      cpu.registers.l = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x15].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x15 - RL L zero', () => {
      cpu.registers.l = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x15].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x16 - RL (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x16].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x16 - RL (HL) carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x16].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x16 - RL (HL) zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x16].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x17 - RL A', () => {
      cpu.registers.a = 0x01;
      cpu.setFlags({ C: 0 });
      PrefixInstructions[0x17].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x17 - RL A carry', () => {
      cpu.registers.a = 0x80;
      cpu.setFlags({ C: 1 });
      PrefixInstructions[0x17].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });
  });

  describe('Tests for SLA', () => {
    it('should test 0x20 - SLA B', () => {
      cpu.registers.b = 0x01;
      PrefixInstructions[0x20].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x20 - SLA B carry', () => {
      cpu.registers.b = 0x80;
      PrefixInstructions[0x20].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x21 - SLA C', () => {
      cpu.registers.c = 0x01;
      PrefixInstructions[0x21].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x21 - SLA C carry', () => {
      cpu.registers.c = 0x80;
      PrefixInstructions[0x21].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x22 - SLA D', () => {
      cpu.registers.d = 0x01;
      PrefixInstructions[0x22].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x22 - SLA D carry', () => {
      cpu.registers.d = 0x80;
      PrefixInstructions[0x22].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x23 - SLA E', () => {
      cpu.registers.e = 0x01;
      PrefixInstructions[0x23].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x23 - SLA E carry', () => {
      cpu.registers.e = 0x80;
      PrefixInstructions[0x23].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x24 - SLA H', () => {
      cpu.registers.h = 0x01;
      PrefixInstructions[0x24].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x24 - SLA H carry', () => {
      cpu.registers.h = 0x80;
      PrefixInstructions[0x24].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x25 - SLA L', () => {
      cpu.registers.l = 0x01;
      PrefixInstructions[0x25].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x25 - SLA L carry', () => {
      cpu.registers.l = 0x80;
      PrefixInstructions[0x25].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x26 - SLA (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      PrefixInstructions[0x26].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x26 - SLA (HL) carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x80;
      PrefixInstructions[0x26].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x27 - SLA A', () => {
      cpu.registers.a = 0x01;
      PrefixInstructions[0x27].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x02);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x27 - SLA A carry', () => {
      cpu.registers.a = 0x80;
      PrefixInstructions[0x27].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });
  });

  describe('Tests for SRA instructions', () => {
    it('should test 0x28 - SRA B', () => {
      cpu.registers.b = 0x01;
      PrefixInstructions[0x28].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x28 - SRA B carry', () => {
      cpu.registers.b = 0x81;
      PrefixInstructions[0x28].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x28 - SRA B no carry', () => {
      cpu.registers.b = 0x02;
      PrefixInstructions[0x28].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x29 - SRA C', () => {
      cpu.registers.c = 0x01;
      PrefixInstructions[0x29].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x29 - SRA C carry', () => {
      cpu.registers.c = 0x81;
      PrefixInstructions[0x29].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x29 - SRA C no carry', () => {
      cpu.registers.c = 0x02;
      PrefixInstructions[0x29].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x2a - SRA D', () => {
      cpu.registers.d = 0x01;
      PrefixInstructions[0x2a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2a - SRA D carry', () => {
      cpu.registers.d = 0x81;
      PrefixInstructions[0x2a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2a - SRA D no carry', () => {
      cpu.registers.d = 0x02;
      PrefixInstructions[0x2a].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x2b - SRA E', () => {
      cpu.registers.e = 0x01;
      PrefixInstructions[0x2b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2b - SRA E carry', () => {
      cpu.registers.e = 0x81;
      PrefixInstructions[0x2b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2b - SRA E no carry', () => {
      cpu.registers.e = 0x02;
      PrefixInstructions[0x2b].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x2c - SRA H', () => {
      cpu.registers.h = 0x01;
      PrefixInstructions[0x2c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2c - SRA H carry', () => {
      cpu.registers.h = 0x81;
      PrefixInstructions[0x2c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2c - SRA H no carry', () => {
      cpu.registers.h = 0x02;
      PrefixInstructions[0x2c].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x2d - SRA L', () => {
      cpu.registers.l = 0x01;
      PrefixInstructions[0x2d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2d - SRA L carry', () => {
      cpu.registers.l = 0x81;
      PrefixInstructions[0x2d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2d - SRA L no carry', () => {
      cpu.registers.l = 0x02;
      PrefixInstructions[0x2d].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x2e - SRA (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      PrefixInstructions[0x2e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2e - SRA (HL) carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x81;
      PrefixInstructions[0x2e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2e - SRA (HL) no carry', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x02;
      PrefixInstructions[0x2e].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x01);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x2f - SRA A', () => {
      cpu.registers.a = 0x01;
      PrefixInstructions[0x2f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 1 });
    });

    it('should test 0x2f - SRA A carry', () => {
      cpu.registers.a = 0x81;
      PrefixInstructions[0x2f].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0xc0);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 1 });
    });
  });

  describe('Tests swap instructions', () => {
    it('should test 0x30 - SWAP B', () => {
      cpu.registers.b = 0x01;
      PrefixInstructions[0x30].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x30 - SWAP B zero', () => {
      cpu.registers.b = 0x00;
      PrefixInstructions[0x30].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.b).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x31 - SWAP C', () => {
      cpu.registers.c = 0x01;
      PrefixInstructions[0x31].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x31 - SWAP C zero', () => {
      cpu.registers.c = 0x00;
      PrefixInstructions[0x31].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.c).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x32 - SWAP D', () => {
      cpu.registers.d = 0x01;
      PrefixInstructions[0x32].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x32 - SWAP D zero', () => {
      cpu.registers.d = 0x00;
      PrefixInstructions[0x32].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.d).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x33 - SWAP E', () => {
      cpu.registers.e = 0x01;
      PrefixInstructions[0x33].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x33 - SWAP E zero', () => {
      cpu.registers.e = 0x00;
      PrefixInstructions[0x33].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.e).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x34 - SWAP H', () => {
      cpu.registers.h = 0x01;
      PrefixInstructions[0x34].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x34 - SWAP H zero', () => {
      cpu.registers.h = 0x00;
      PrefixInstructions[0x34].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.h).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x35 - SWAP L', () => {
      cpu.registers.l = 0x01;
      PrefixInstructions[0x35].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x35 - SWAP L zero', () => {
      cpu.registers.l = 0x00;
      PrefixInstructions[0x35].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.l).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x36 - SWAP (HL)', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x01;
      PrefixInstructions[0x36].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x36 - SWAP (HL) zero', () => {
      cpu.registers.h = 0xff;
      cpu.registers.l = 0x00;
      emu.memory[0xff00] = 0x00;
      PrefixInstructions[0x36].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(emu.memory[0xff00]).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });

    it('should test 0x37 - SWAP A', () => {
      cpu.registers.a = 0x01;
      PrefixInstructions[0x37].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x10);
      expect({ Z, N, H, C }).toEqual({ Z: 0, N: 0, H: 0, C: 0 });
    });

    it('should test 0x37 - SWAP A zero', () => {
      cpu.registers.a = 0x00;
      PrefixInstructions[0x37].execute(cpu);
      const { Z, N, H, C } = cpu.getFlags();
      expect(cpu.registers.a).toBe(0x00);
      expect({ Z, N, H, C }).toEqual({ Z: 1, N: 0, H: 0, C: 0 });
    });
  });
});
