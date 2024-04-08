module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['html', 'text'],
  coverageDirectory: './coverage',
  setupFiles: ['<rootDir>/testSetup.js']
}
