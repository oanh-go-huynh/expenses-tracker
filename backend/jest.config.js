module.exports = {
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
};