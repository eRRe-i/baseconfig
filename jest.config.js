/** @type {import('jest').Config} */
export default {
  transform: {},
  testEnvironment: 'node',
  cache: false,
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  preset: 'ts-jest',
}
