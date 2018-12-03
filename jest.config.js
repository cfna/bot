module.exports = {
  roots: ['./'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts, js}', '!**/node_modules/**', '!**/vendor/**'],
};
