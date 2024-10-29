export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    globals: {
      'ts-jest': {
        isolatedModules: true,
      },
    },
    silent: false
  };
  