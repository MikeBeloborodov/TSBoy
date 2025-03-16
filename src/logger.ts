import fs from 'fs';

export class Logger {
  constructor() {}

  log(message: string) {
    fs.appendFileSync('log.txt', message + '\n');
  }
}
