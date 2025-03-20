export class SerialPort {
  serialTransferData: number = 0;
  serialControl: number = 0;

  read(address: number): number {
    if (address === 0xff01) {
      return this.serialTransferData;
    } else if (address === 0xff02) {
      return this.serialControl;
    }
    return 0;
  }

  write(address: number, value: number): void {
    if (address === 0xff01) {
      this.serialTransferData = value;
    } else if (address === 0xff02) {
      this.serialControl = value;
      if (value & 0x80) {
        // Transfer start bit is set
        this.transferData();
      }
    }
  }

  transferData(): void {
    // Simulate serial data transfer
    const char = String.fromCharCode(this.serialTransferData);
    process.stdout.write(char);
    this.serialControl &= ~0x80; // Clear the transfer start bit
  }
}
