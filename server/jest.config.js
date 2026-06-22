/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/*.test.ts'],
};

module.exports = config;
