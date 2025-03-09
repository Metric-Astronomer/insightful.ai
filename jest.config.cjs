/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json'
      }
    ]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  // Enable manual mocks
  moduleDirectories: ['node_modules', 'src'],
  // Use separate project configs
  projects: [
    {
      displayName: 'content',
      testMatch: ['<rootDir>/src/content/__tests__/**/*.test.ts'],
      setupFilesAfterEnv: [
        '<rootDir>/src/content/__tests__/setup.ts'
      ]
    },
    {
      displayName: 'background',
      testMatch: ['<rootDir>/src/background/__tests__/**/*.test.ts'],
      setupFilesAfterEnv: [
        '<rootDir>/src/background/__tests__/setup.ts',
        'fake-indexeddb/auto'
      ]
    }
  ]
};