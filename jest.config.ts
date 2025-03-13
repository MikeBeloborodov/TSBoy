import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  testEnvironment: 'node', // Test environment (Node.js for backend, 'jsdom' for frontend)
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Match test files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions to look for
  collectCoverage: true, // Enable code coverage
  coverageDirectory: 'coverage', // Directory for coverage reports
  coverageReporters: ['text', 'html'], // Coverage report formats
};

export default config;