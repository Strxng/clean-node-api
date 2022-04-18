module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*js'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  modulePathIgnorePatterns: ['.history'],
  preset: '@shelf/jest-mongodb'
}
