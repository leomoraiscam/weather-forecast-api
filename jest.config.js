/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/modules/**/usecases/**/*.ts', 'src/external/**/services/**/*.ts'],
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  setupFiles: ['dotenv/config'],
};
