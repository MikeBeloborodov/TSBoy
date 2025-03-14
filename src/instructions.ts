import { FlagState, InstructionsMap, u16 } from './types';

export const Instructions: InstructionsMap = {
  0x00: {
    asm: `NOP`,
    flags: {
      Z: FlagState.UNTOUCHED,
      N: FlagState.UNTOUCHED,
      H: FlagState.UNTOUCHED,
      C: FlagState.UNTOUCHED,
    },
    size: 1,
    cycles: 4,
    fn: (): u16 | void => {},
  },
  0xc3: {
    asm: 'JP a16',
    flags: {
      Z: FlagState.UNTOUCHED,
      N: FlagState.UNTOUCHED,
      H: FlagState.UNTOUCHED,
      C: FlagState.UNTOUCHED,
    },
    size: 3,
    cycles: 16,
    fn: (pc: u16, memRead: Function): u16 | void => {
      const a = memRead(pc + 1);
      const b = memRead(pc + 2);
      const jumpAddress = (a << 8) | b;
      return jumpAddress;
    },
  },
};
