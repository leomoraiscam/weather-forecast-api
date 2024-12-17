/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/test/**/*.spec.ts',
  ],
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/application/usecases/**/*.ts',
    '!src/application/usecases/**/dtos/*.ts',
    '!src/application/usecases/**/contracts/*.ts',
    'src/application/services/**/*.ts',
    'src/entities/**/*.ts',
    '!src/entities/**/dtos/*.ts',
    'src/presentation/controllers/**/*.ts',
  ],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  setupFiles: ['dotenv/config'],
};
