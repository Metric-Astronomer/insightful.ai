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
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleDirectories: ['node_modules', 'src'],
  projects: [
    {
      displayName: 'background',
      testMatch: ['<rootDir>/src/background/__tests__/**/*.test.ts'],
      setupFilesAfterEnv: [
        '<rootDir>/src/background/__tests__/setup.ts',
        'fake-indexeddb/auto'
      ],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: 'tsconfig.json'
          }
        ]
      }
    }
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(dexie|@jest/globals)/)'
  ]
}