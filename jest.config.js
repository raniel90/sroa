module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*'],
  setupFiles: ["./jest.setup.js"],
  coveragePathIgnorePatterns: [
    "tsconfig.json"
  ],
};
