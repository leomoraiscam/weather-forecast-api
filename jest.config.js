/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/modules/**/usecases/**/*.ts',
    '!src/modules/**/usecases/**/*response.ts',
    'src/modules/**/domain/**/*.ts',
    'src/modules/**/helpers/**/*.ts',
    '!src/modules/**/domain/**/dtos/*.ts',
    '!src/modules/**/domain/**/dtos/*.ts',
    'src/external/**/services/*.ts',
    '!src/external/**/services/**/*response.ts',
    'src/main/**/routes/*.ts',
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
