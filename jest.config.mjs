/** @ts-check */

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testTimeout: 1800000, // 30 minutes for instance test performing real installs
  moduleNameMapper: {
    '^jose$': 'jose',
    '^@/(.*)$': '<rootDir>/$1',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^next-intl$': '<rootDir>/node_modules/next-intl',
  },
  modulePathIgnorePatterns: [
    '/\\.next/'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '.temp', '/_lib/', '/_components/'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!_lib/**',
    '!_components/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|next-auth|@panva|debug|@apollo)/)',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
};

export default config; 