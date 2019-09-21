import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    const file: any = fs.readFileSync(filePath);
    this.envConfig = dotenv.parse(file);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
