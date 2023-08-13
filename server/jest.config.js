/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/__tests__/**/*.+(ts)",
    "**/?(*.)+(spec|test).+(ts)"
  ],
  testTimeout: 10000
};