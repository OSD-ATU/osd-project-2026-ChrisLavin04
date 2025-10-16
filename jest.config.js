const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'],
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/testSetUp.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.test.{ts,js}',
    '!src/tests/**/*'
  ],
  testTimeout: 10000
};
module.exports = config;
