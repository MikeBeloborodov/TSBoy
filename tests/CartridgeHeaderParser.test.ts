import { CartridgeHeaderParser } from '../src/CartridgeHeaderParser';
import { mockRomsContent } from './mocks/mockRomsData';
import fs from 'fs';

describe('CartridgeHeaderParser', () => {
  describe('getHeaderInfo', () => {
    it('should return correct info', () => {
      const mockRom = mockRomsContent[0];
      const romFile = fs.readFileSync(mockRom.path);
      const parser = new CartridgeHeaderParser(romFile);
      const parsedheader = parser.getHeaderInfo();
      expect(mockRomsContent[0].headerContents).toStrictEqual(parsedheader);
    });

    it('should return correct info with new licensee code', () => {
      const mockRom = mockRomsContent[1];
      const romFile = fs.readFileSync(mockRom.path);
      const parser = new CartridgeHeaderParser(romFile);
      const parsedheader = parser.getHeaderInfo();
      expect(mockRomsContent[1].headerContents).toStrictEqual(parsedheader);
    });

    it('should return correct info with wrong nintendo logo', () => {
      const mockRom = mockRomsContent[2];
      const romFile = fs.readFileSync(mockRom.path);
      const parser = new CartridgeHeaderParser(romFile);
      const parsedheader = parser.getHeaderInfo();
      expect(mockRomsContent[2].headerContents).toStrictEqual(parsedheader);
    });
  });
});
