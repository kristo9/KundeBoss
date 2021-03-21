// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  silent: false,
  //preset: '@shelf/jest-mongodb',
};
export default config;
