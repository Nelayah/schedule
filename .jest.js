module.exports = {
  verbose: true,
  setupFiles: [
    './setup.js',
  ],
  setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js'],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  transformIgnorePatterns: [
    "node_modules"
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'md',
  ],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    }
  }
};
