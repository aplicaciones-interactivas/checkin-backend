const testContainersPReset = require('./jest-testcontainers-config');

module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "roots": [
    "<rootDir>/src/",
    "<rootDir>/libs/",
    "<rootDir>/apps/"
  ],
  "testRegex": ".spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "./coverage",
  "testEnvironment": "node"
};
