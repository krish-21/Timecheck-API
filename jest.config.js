/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  projects: [
    {
      displayName: "Unit",
      preset: "ts-jest",
      testEnvironment: "node",
      cache: false,
      rootDir: "./src/test",
      modulePaths: ["<rootDir>../"],
    },
    {
      displayName: "Integration",
      preset: "ts-jest",
      testEnvironment: "node",
      cache: false,
      rootDir: "./src/z_integration",
      modulePaths: ["<rootDir>../"],
    },
  ],
};
