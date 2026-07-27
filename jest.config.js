module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        target: 'es6',
        moduleResolution: 'node',
        allowJs: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  testMatch: ['**/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json']
}
