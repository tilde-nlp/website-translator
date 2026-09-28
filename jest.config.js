module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://widget.example/page'
  },
  testMatch: ['**/*.test.ts']
}