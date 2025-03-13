import { MockRom } from '../../src/types';

export const mockRomsContent: Array<MockRom> = [
  {
    path: 'mock_roms/rom1.gb',
    description: 'Header only rom, not corrupted in any way',
    headerContents: {
      isNintendoLogo: true,
      title: 'MORTAL KOMBAT',
      licensee: 'Acclaim Entertainment',
      isSGB: false,
      cartridgeType: 'MBC1',
      romSize: '256 KiB',
      ramSize: '0 No RAM',
      destination: 'Overseas only',
      maskRom: 0,
      isChecksumValid: true,
    },
  },
  {
    path: 'mock_roms/rom2.gb',
    description: 'Header only, has new licensee',
    headerContents: {
      isNintendoLogo: true,
      title: 'DONKEY KONG',
      licensee: 'Nintendo Research & Development',
      isSGB: true,
      cartridgeType: 'MBC1+RAM+BATTERY',
      romSize: '512 KiB',
      ramSize: '8 KiB 1 bank',
      destination: 'Japan',
      maskRom: 1,
      isChecksumValid: true,
    },
  },
  {
    path: 'mock_roms/rom3.gb',
    description: 'Header only, wrong nintendo logo',
    headerContents: {
      isNintendoLogo: false,
      title: 'ZELDA',
      licensee: 'Nintendo',
      isSGB: false,
      cartridgeType: 'MBC1+RAM+BATTERY',
      romSize: '512 KiB',
      ramSize: '8 KiB 1 bank',
      destination: 'Overseas only',
      maskRom: 2,
      isChecksumValid: true,
    },
  },
];
