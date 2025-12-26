/** @type {import('jest').Config} */
const { createCjsPreset } = require('jest-preset-angular/presets');

const presetConfig = createCjsPreset();

module.exports = {
  ...presetConfig,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/src/test.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/*.config.ts',
    '!src/app/**/*.server.ts',
    '!src/app/**/index.ts',
    '!src/main.ts',
    '!src/**/*.d.ts'
  ],
};
